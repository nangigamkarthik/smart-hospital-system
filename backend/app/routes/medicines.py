import json
import re
from datetime import datetime
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

medicines_bp = Blueprint('medicines', __name__)

OPENFDA_LABEL_URL = 'https://api.fda.gov/drug/label.json'
DAILYMED_INFO_URL = 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid={set_id}'

MEDICINE_ALIASES = {
    'paracetamol': 'acetaminophen',
    'crocin': 'acetaminophen',
    'dolo': 'acetaminophen',
    'dolo 650': 'acetaminophen',
    'tylenol': 'acetaminophen',
    'combiflam': 'ibuprofen',
    'brufen': 'ibuprofen',
}

OCR_STOPWORDS = {
    'tablet', 'tablets', 'capsule', 'capsules', 'usp', 'ip', 'mg', 'ml', 'oral',
    'solution', 'suspension', 'drop', 'drops', 'cream', 'ointment', 'injection',
    'dose', 'dosage', 'prescription', 'rx', 'drug', 'medicine', 'medicines',
    'for', 'with', 'and', 'use', 'uses', 'only', 'take', 'keep', 'store',
    'doctor', 'pharmacy', 'pharmacist', 'children', 'adult', 'adults', 'extra',
    'strength', 'film', 'coated', 'extended', 'release',
}

AGE_SENTENCE_PATTERN = re.compile(
    r'(?i)(?:children?|adults?|pediatric|geriatric|elderly|under\s+\d+|over\s+\d+|'
    r'less than\s+\d+|older than\s+\d+)[^.]{0,180}'
)


def _fetch_json(url):
    request = Request(url, headers={'User-Agent': 'SmartHospitalMedicineLookup/1.0'})
    with urlopen(request, timeout=12) as response:
        return json.load(response)


def _clean_text(value):
    if not value:
        return ''

    if isinstance(value, list):
        value = ' '.join(str(item) for item in value if item)

    value = str(value)
    value = re.sub(r'\[[^\]]+\]', ' ', value)
    value = re.sub(r'\(\s*\d+(?:\.\d+)?\s*\)', ' ', value)
    value = re.sub(r'\s+', ' ', value).strip()
    return value


def _truncate_text(value, limit=1200):
    text = _clean_text(value)
    if len(text) <= limit:
        return text
    shortened = text[:limit].rsplit(' ', 1)[0].strip()
    return f'{shortened}...'


def _listify_text(value, limit=6):
    text = _clean_text(value)
    if not text:
        return []

    raw_parts = re.split(r'(?<=[.;])\s+|\s\*\s', text)
    parts = []

    for part in raw_parts:
        cleaned = _clean_text(part)
        if cleaned and cleaned not in parts:
            parts.append(cleaned)
        if len(parts) >= limit:
            break

    return parts


def _normalize_compare(text):
    text = _clean_text(text).lower()
    text = re.sub(r'[^a-z0-9\s-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def _format_date(effective_time):
    if not effective_time:
        return ''

    try:
        return datetime.strptime(str(effective_time), '%Y%m%d').strftime('%b %d, %Y')
    except ValueError:
        return str(effective_time)


def _extract_names(result):
    openfda = result.get('openfda', {})
    names = []

    for field in ('brand_name', 'generic_name', 'substance_name'):
        for name in openfda.get(field, []):
            cleaned = _clean_text(name)
            if cleaned and cleaned not in names:
                names.append(cleaned)

    return names


def _section_text(result, *fields, limit=1400):
    for field in fields:
        value = result.get(field)
        if value:
            return _truncate_text(value, limit=limit)
    return ''


def _section_bullets(result, *fields, limit=6):
    for field in fields:
        value = result.get(field)
        if value:
            bullets = _listify_text(value, limit=limit)
            if bullets:
                return bullets
    return []


def _extract_age_guidance(result):
    guidance = []
    pediatric = _section_text(result, 'pediatric_use', limit=700)
    geriatric = _section_text(result, 'geriatric_use', limit=700)

    if pediatric:
        guidance.append({
            'group': 'Pediatric use',
            'details': pediatric,
        })

    if geriatric:
        guidance.append({
            'group': 'Geriatric use',
            'details': geriatric,
        })

    if not guidance:
        age_text = _clean_text(
            result.get('dosage_and_administration')
            or result.get('directions')
            or result.get('indications_and_usage')
        )
        matches = []
        for match in AGE_SENTENCE_PATTERN.findall(age_text):
            cleaned = _clean_text(match)
            if cleaned and cleaned not in matches:
                matches.append(cleaned)
            if len(matches) >= 4:
                break

        for sentence in matches:
            guidance.append({
                'group': 'Age-related directions',
                'details': sentence,
            })

    return guidance


def _score_result(result, query):
    normalized_query = _normalize_compare(query)
    score = 0

    for name in _extract_names(result):
        normalized_name = _normalize_compare(name)
        if not normalized_name:
            continue

        if normalized_name == normalized_query:
            score += 100
        elif normalized_query in normalized_name:
            score += 70
        elif normalized_name in normalized_query:
            score += 55

    if result.get('adverse_reactions'):
        score += 8
    if result.get('dosage_and_administration') or result.get('directions'):
        score += 8
    if result.get('pediatric_use'):
        score += 6
    if result.get('geriatric_use'):
        score += 6

    return score


def _build_search_queries(term):
    safe_term = _clean_text(term).replace('"', '')
    return [
        f'openfda.brand_name:"{safe_term}"',
        f'openfda.generic_name:"{safe_term}"',
        f'openfda.substance_name:"{safe_term}"',
        f'openfda.brand_name:{safe_term}',
        f'openfda.generic_name:{safe_term}',
        f'openfda.substance_name:{safe_term}',
    ]


def _search_openfda(term, limit=5):
    last_error = None

    for query in _build_search_queries(term):
        try:
            url = f'{OPENFDA_LABEL_URL}?search={quote(query)}&limit={limit}'
            data = _fetch_json(url)
            return data.get('results', [])
        except HTTPError as error:
            last_error = error
            if error.code != 404:
                raise
        except (URLError, TimeoutError, OSError) as error:
            raise RuntimeError('Unable to reach FDA label service.') from error

    if last_error and getattr(last_error, 'code', None) == 404:
        return []

    return []


def _resolve_query_candidates(medicine_name=None, ocr_text=None):
    candidates = []

    if medicine_name:
        cleaned = _clean_text(medicine_name)
        if cleaned:
            candidates.append(cleaned)

    if ocr_text:
        lines = [
            _clean_text(line)
            for line in re.split(r'[\r\n]+', ocr_text)
            if _clean_text(line)
        ]

        for line in lines[:10]:
            line = re.sub(r'\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|%)\b', ' ', line, flags=re.IGNORECASE)
            tokens = [
                token for token in re.findall(r'[A-Za-z][A-Za-z0-9-]+', line)
                if token.lower() not in OCR_STOPWORDS
            ]

            for size in (3, 2, 1):
                if len(tokens) >= size:
                    candidate = ' '.join(tokens[:size])
                    if len(candidate) > 2 and candidate not in candidates:
                        candidates.append(candidate)

    normalized_candidates = []
    for candidate in candidates:
        normalized = MEDICINE_ALIASES.get(_normalize_compare(candidate), candidate)
        if normalized not in normalized_candidates:
            normalized_candidates.append(normalized)

    return normalized_candidates[:8]


def _build_medicine_payload(result, matched_query, input_mode):
    openfda = result.get('openfda', {})
    brand_names = [_clean_text(name) for name in openfda.get('brand_name', []) if _clean_text(name)]
    generic_names = [_clean_text(name) for name in openfda.get('generic_name', []) if _clean_text(name)]
    manufacturer = [_clean_text(name) for name in openfda.get('manufacturer_name', []) if _clean_text(name)]
    route = [_clean_text(name) for name in openfda.get('route', []) if _clean_text(name)]
    dosage_form = [_clean_text(name) for name in openfda.get('dosage_form', []) if _clean_text(name)]

    use_summary = _section_text(result, 'indications_and_usage', 'purpose', limit=1200)
    how_to_use = _section_text(result, 'dosage_and_administration', 'directions', limit=1400)
    side_effects = _section_text(result, 'adverse_reactions', 'stop_use', limit=1400)
    warnings = _section_text(result, 'warnings_and_precautions', 'warnings', 'when_using', limit=1400)
    contraindications = _section_text(result, 'contraindications', 'do_not_use', 'ask_doctor', limit=1000)

    display_name = brand_names[0] if brand_names else generic_names[0] if generic_names else matched_query

    return {
        'display_name': display_name,
        'matched_query': matched_query,
        'input_mode': input_mode,
        'generic_names': generic_names,
        'brand_names': brand_names,
        'manufacturer_names': manufacturer,
        'dosage_form': dosage_form,
        'route': route,
        'product_type': _clean_text(result.get('product_type') or openfda.get('product_type', [''])),
        'use_summary': use_summary,
        'how_to_use': how_to_use,
        'side_effects': side_effects,
        'warnings': warnings,
        'contraindications': contraindications,
        'consult_doctor_before_use': _section_bullets(
            result,
            'ask_doctor',
            'ask_doctor_or_pharmacist',
            'pregnancy_or_breast_feeding',
        ),
        'storage': _section_bullets(result, 'storage_and_handling', 'keep_out_of_reach_of_children'),
        'age_guidance': _extract_age_guidance(result),
        'patient_guidance': _section_bullets(result, 'patient_information', 'spl_medguide', limit=5),
        'source': {
            'provider': 'FDA openFDA label data',
            'published_date': _format_date(result.get('effective_time')),
            'set_id': result.get('set_id'),
            'official_label_url': DAILYMED_INFO_URL.format(set_id=result.get('set_id')) if result.get('set_id') else '',
        },
        'safety_notice': (
            'Use this as official label guidance support only. Final prescribing and dosing decisions '
            'should be made by a licensed clinician or pharmacist.'
        ),
    }


def lookup_medicine_label(medicine_name=None, ocr_text=None):
    candidates = _resolve_query_candidates(medicine_name=medicine_name, ocr_text=ocr_text)
    if not candidates:
        raise ValueError('Please provide a medicine name or a readable medicine image.')

    best_match = None
    best_score = -1
    matched_query = ''

    for candidate in candidates:
        results = _search_openfda(candidate, limit=2)
        for result in results:
            score = _score_result(result, candidate)
            if score > best_score:
                best_score = score
                best_match = result
                matched_query = candidate

        if best_score >= 100:
            break

    if not best_match:
        return None, candidates

    return _build_medicine_payload(
        best_match,
        matched_query=matched_query,
        input_mode='image' if not medicine_name and ocr_text else 'name',
    ), candidates


@medicines_bp.route('/lookup', methods=['POST'])
@jwt_required()
def lookup_medicine():
    try:
        data = request.get_json() or {}
        medicine_name = data.get('medicine_name')
        ocr_text = data.get('ocr_text')

        payload, candidates = lookup_medicine_label(medicine_name=medicine_name, ocr_text=ocr_text)

        if not payload:
            return jsonify({
                'error': 'Medicine not found in the official label database.',
                'candidates': candidates[:5],
                'message': 'Try a clearer image, a brand name, or the generic medicine name.',
            }), 404

        payload['candidates_considered'] = candidates[:5]
        return jsonify(payload), 200

    except ValueError as error:
        return jsonify({'error': str(error)}), 400
    except RuntimeError as error:
        return jsonify({'error': str(error)}), 503
    except Exception as error:
        return jsonify({'error': str(error)}), 500
