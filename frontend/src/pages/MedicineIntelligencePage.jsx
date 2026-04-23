import React, { useEffect, useMemo, useState } from 'react';
import Tesseract from 'tesseract.js';
import {
  AlertTriangle,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pill,
  ScanLine,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Syringe,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { medicineAPI } from '../services/api';

const SectionBlock = ({ title, description, children }) => (
  <div className="medicine-section">
    <div className="medicine-section__header">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </div>
    <div className="medicine-section__body">{children}</div>
  </div>
);

const BulletList = ({ items, emptyText = 'No information available in the current label.' }) => {
  if (!items || items.length === 0) {
    return <p className="medicine-empty-copy">{emptyText}</p>;
  }

  return (
    <ul className="medicine-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const PillGroup = ({ title, values }) => {
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="medicine-meta-card">
      <span>{title}</span>
      <div className="medicine-chip-row">
        {values.map((value) => (
          <span className="medicine-chip" key={`${title}-${value}`}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

const MedicineIntelligencePage = () => {
  const [medicineName, setMedicineName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageFile]);

  const canLookupByName = medicineName.trim().length > 1 && !loading && !extracting;
  const canLookupByImage = !!imageFile && !loading && !extracting;

  const summaryCards = useMemo(() => ([
    {
      label: 'Official source',
      value: 'FDA label sections',
      note: 'Indications, dosage, adverse reactions, and population guidance.',
      icon: Stethoscope,
    },
    {
      label: 'Image workflow',
      value: 'OCR enabled',
      note: 'Extract text from pack or strip photos before matching the medicine.',
      icon: ScanLine,
    },
    {
      label: 'Safety guardrail',
      value: 'Clinician review',
      note: 'Use this to support care decisions, not replace prescribing judgment.',
      icon: ShieldAlert,
    },
  ]), []);

  const runLookup = async (payload, successMessage) => {
    setLoading(true);

    try {
      const response = await medicineAPI.lookup(payload);
      setResult(response.data);
      toast.success(successMessage);
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to fetch medicine details right now.';
      setResult(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNameLookup = async (event) => {
    event.preventDefault();
    if (!medicineName.trim()) {
      toast.error('Enter a medicine name first.');
      return;
    }

    await runLookup(
      { medicine_name: medicineName.trim() },
      'Medicine label information loaded.',
    );
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    setOcrText('');
    toast.success('Medicine image added. You can scan it now.');
  };

  const handleImageLookup = async () => {
    if (!imageFile) {
      toast.error('Upload a medicine photo first.');
      return;
    }

    setExtracting(true);
    setOcrProgress(0);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (message) => {
          if (message.status === 'recognizing text' && typeof message.progress === 'number') {
            setOcrProgress(Math.round(message.progress * 100));
          }
        },
      });

      const cleanedText = text.trim();
      setOcrText(cleanedText);

      if (!cleanedText) {
        toast.error('No readable medicine text was found in the image.');
        return;
      }

      await runLookup(
        { ocr_text: cleanedText },
        'Medicine information extracted from image.',
      );
    } catch (error) {
      console.error('OCR error:', error);
      toast.error('Could not read that medicine image. Try a clearer label photo.');
    } finally {
      setExtracting(false);
      setOcrProgress(0);
    }
  };

  return (
    <div className="page-stack">
      <section className="operations-hero">
        <div className="operations-hero__copy">
          <div className="shell-chip shell-chip--soft">Medicine intelligence</div>
          <h2 className="operations-hero__title">
            Look up a medicine by name or label image and pull the important safety sections fast.
          </h2>
          <p className="operations-hero__subtitle">
            This feature reads official drug-label data and organizes it into how to use it, side effects,
            who should be cautious, and age-related guidance so staff can review it faster.
          </p>

          <div className="operations-hero__actions">
            <button className="primary-button" onClick={handleImageLookup} type="button" disabled={!canLookupByImage}>
              <ScanLine size={16} />
              Scan medicine image
            </button>
            <button className="outline-button" onClick={() => setResult(null)} type="button">
              Clear current result
            </button>
          </div>
        </div>

        <div className="operations-hero__panel">
          <div className="mini-stat">
            <div className="mini-stat__label">
              <Pill size={15} />
              What this checks
            </div>
            <div className="mini-stat__value">7 key sections</div>
            <p className="mini-stat__copy">Usage, dosage, side effects, warnings, contraindications, storage, and age guidance.</p>
          </div>

          <div className="mini-stat-grid">
            {summaryCards.slice(0, 2).map((card) => {
              const Icon = card.icon;
              return (
                <div className="mini-stat mini-stat--compact" key={card.label}>
                  <div className="mini-stat__label">
                    <Icon size={14} />
                    {card.label}
                  </div>
                  <div className="mini-stat__value">{card.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="medicine-input-grid">
        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Name lookup</div>
              <h3 className="section-heading__title">Search by medicine name</h3>
            </div>
            <div className="shell-chip shell-chip--soft">
              <Search size={14} />
              <span>Brand or generic</span>
            </div>
          </div>

          <form className="medicine-form" onSubmit={handleNameLookup}>
            <label className="medicine-field">
              <span>Medicine name</span>
              <div className="medicine-field__control">
                <Pill size={18} />
                <input
                  type="text"
                  value={medicineName}
                  onChange={(event) => setMedicineName(event.target.value)}
                  placeholder="Example: ibuprofen, amoxicillin, acetaminophen"
                />
              </div>
            </label>

            <button className="primary-button" disabled={!canLookupByName} type="submit">
              {loading ? <Loader2 className="spin-icon" size={16} /> : <Search size={16} />}
              <span>{loading ? 'Loading official label...' : 'Find medicine info'}</span>
            </button>
          </form>
        </article>

        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Image scan</div>
              <h3 className="section-heading__title">Read a medicine label photo</h3>
            </div>
            <div className="shell-chip shell-chip--soft">
              <ImagePlus size={14} />
              <span>OCR enabled</span>
            </div>
          </div>

          <div className="medicine-uploader">
            <label className={`medicine-dropzone ${imagePreview ? 'is-filled' : ''}`}>
              <input accept="image/*" onChange={handleImageSelect} type="file" />
              {imagePreview ? (
                <img alt="Medicine preview" className="medicine-preview" src={imagePreview} />
              ) : (
                <div className="medicine-dropzone__empty">
                  <Upload size={20} />
                  <span>Upload a clear photo of the medicine pack, strip, or bottle label.</span>
                </div>
              )}
            </label>

            <button className="primary-button" disabled={!canLookupByImage} onClick={handleImageLookup} type="button">
              {extracting ? <Loader2 className="spin-icon" size={16} /> : <ScanLine size={16} />}
              <span>{extracting ? `Reading image... ${ocrProgress}%` : 'Extract and search'}</span>
            </button>

            {ocrText ? (
              <div className="medicine-ocr-box">
                <strong>Extracted text preview</strong>
                <p>{ocrText.slice(0, 280)}{ocrText.length > 280 ? '...' : ''}</p>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="medicine-results-layout">
        <article className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-heading__eyebrow">Structured result</div>
              <h3 className="section-heading__title">Medicine information</h3>
            </div>
            {result?.source?.official_label_url ? (
              <a
                className="shell-chip shell-chip--soft"
                href={result.source.official_label_url}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={14} />
                <span>Open official label</span>
              </a>
            ) : null}
          </div>

          {!result && !loading ? (
            <div className="medicine-placeholder">
              <Sparkles size={24} />
              <div>
                <strong>Search a medicine to see structured guidance.</strong>
                <p>The results will organize official label data into the parts clinicians and patients usually ask for first.</p>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="medicine-placeholder">
              <Loader2 className="spin-icon" size={24} />
              <div>
                <strong>Loading official medicine information...</strong>
                <p>This can take a moment while the FDA label data is normalized.</p>
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="medicine-result-stack">
              <div className="medicine-result-header">
                <div>
                  <h2>{result.display_name}</h2>
                  <p>
                    Matched using <strong>{result.matched_query}</strong> from the {result.input_mode === 'image' ? 'image scan' : 'typed name'} workflow.
                  </p>
                </div>
                {result.source?.published_date ? (
                  <span className="medicine-date-badge">Label date: {result.source.published_date}</span>
                ) : null}
              </div>

              <div className="medicine-meta-grid">
                <PillGroup title="Generic names" values={result.generic_names} />
                <PillGroup title="Brand names" values={result.brand_names} />
                <PillGroup title="Manufacturer" values={result.manufacturer_names} />
                <PillGroup title="Dosage form" values={result.dosage_form} />
                <PillGroup title="Route" values={result.route} />
              </div>

              <SectionBlock title="What it is used for" description="Official indications or intended use section">
                <p>{result.use_summary || 'No official indication text was available in the current label record.'}</p>
              </SectionBlock>

              <SectionBlock title="How to use it" description="Dosage and administration guidance from the label">
                <p>{result.how_to_use || 'No dosage or administration section was available in the current label record.'}</p>
              </SectionBlock>

              <SectionBlock title="Possible side effects" description="Adverse reactions or stop-use guidance">
                <p>{result.side_effects || 'No side-effect section was available in the current label record.'}</p>
              </SectionBlock>

              <SectionBlock title="Warnings and precautions" description="Important caution sections to review before use">
                <p>{result.warnings || 'No warnings section was available in the current label record.'}</p>
              </SectionBlock>

              <div className="medicine-section-grid">
                <SectionBlock title="Who should not use it" description="Contraindications or do-not-use guidance">
                  <p>{result.contraindications || 'No contraindication section was available in the current label record.'}</p>
                </SectionBlock>

                <SectionBlock title="Talk to a doctor before use" description="Doctor or pharmacist consult prompts from the label">
                  <BulletList items={result.consult_doctor_before_use} />
                </SectionBlock>
              </div>

              <SectionBlock title="Age and population guidance" description="Pediatric, geriatric, or age-related instructions">
                {result.age_guidance?.length ? (
                  <div className="medicine-guidance-list">
                    {result.age_guidance.map((item) => (
                      <div className="medicine-guidance-card" key={`${item.group}-${item.details}`}>
                        <strong>{item.group}</strong>
                        <p>{item.details}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="medicine-empty-copy">No explicit age-limit or age-population details were available in the current label record.</p>
                )}
              </SectionBlock>

              <div className="medicine-section-grid">
                <SectionBlock title="Patient guidance" description="Patient counseling or medication guide snippets">
                  <BulletList items={result.patient_guidance} />
                </SectionBlock>

                <SectionBlock title="Storage and handling" description="Storage or child-safety instructions when available">
                  <BulletList items={result.storage} />
                </SectionBlock>
              </div>
            </div>
          ) : null}
        </article>

        <div className="stacked-cards">
          <article className="section-card">
            <div className="section-heading">
              <div>
                <div className="section-heading__eyebrow">Safety note</div>
                <h3 className="section-heading__title">Clinical guardrails</h3>
              </div>
            </div>

            <div className="medicine-panel-note medicine-panel-note--warning">
              <AlertTriangle size={18} />
              <p>
                {result?.safety_notice || 'Medicine lookup supports decision-making, but prescribing, substitutions, and dose decisions should still be reviewed by a licensed clinician or pharmacist.'}
              </p>
            </div>

            {result?.candidates_considered?.length ? (
              <div className="medicine-panel-note">
                <Syringe size={18} />
                <div>
                  <strong>Candidates checked</strong>
                  <p>{result.candidates_considered.join(', ')}</p>
                </div>
              </div>
            ) : null}
          </article>

          <article className="section-card">
            <div className="section-heading">
              <div>
                <div className="section-heading__eyebrow">Source</div>
                <h3 className="section-heading__title">Where this data comes from</h3>
              </div>
            </div>

            <div className="medicine-source-card">
              <strong>{result?.source?.provider || 'FDA/openFDA official drug label data'}</strong>
              <p>
                This page organizes official public label sections such as approved use, dosage, side effects,
                warnings, and pediatric or geriatric guidance.
              </p>
              {result?.source?.official_label_url ? (
                <a href={result.source.official_label_url} rel="noreferrer" target="_blank">
                  Open the full official label
                  <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default MedicineIntelligencePage;
