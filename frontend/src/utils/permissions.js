export const ROLE_LABELS = {
  Admin: 'Administrator',
  Doctor: 'Doctor',
  Nurse: 'Staff User',
  Receptionist: 'Staff User',
  Pharmacist: 'Staff User',
  'Lab Technician': 'Staff User',
};

export const PORTALS = {
  admin: {
    id: 'admin',
    label: 'Admin Portal',
    description: 'Full hospital operations, analytics, users, and system controls.',
    roles: ['Admin'],
    accent: 'portal-card--admin',
    demo: {
      username: 'admin',
      password: 'admin123',
    },
  },
  doctor: {
    id: 'doctor',
    label: 'Doctor Portal',
    description: 'Clinical workspace for appointments, records, patients, and predictions.',
    roles: ['Doctor'],
    accent: 'portal-card--doctor',
    demo: {
      username: 'dr.smith',
      password: 'doctor123',
    },
  },
  user: {
    id: 'user',
    label: 'User Portal',
    description: 'Front-desk and staff workspace for daily patient and appointment operations.',
    roles: ['Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
    accent: 'portal-card--user',
    demo: {
      username: 'receptionist',
      password: 'reception123',
    },
  },
};

export const ROUTE_ACCESS = {
  '/': ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  '/patients': ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  '/doctors': ['Admin', 'Doctor', 'Nurse', 'Receptionist'],
  '/appointments': ['Admin', 'Doctor', 'Nurse', 'Receptionist'],
  '/departments': ['Admin', 'Nurse', 'Receptionist', 'Lab Technician'],
  '/records': ['Admin', 'Doctor', 'Nurse'],
  '/analytics': ['Admin'],
  '/ml-predictions': ['Admin', 'Doctor'],
  '/medicines': ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  '/users': ['Admin'],
  '/reports': ['Admin'],
  '/settings': ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
};

export const DASHBOARD_ACTION_ACCESS = {
  'patient-intake': ['Admin', 'Nurse', 'Receptionist'],
  'doctor-roster': ['Admin', 'Doctor', 'Receptionist'],
  schedule: ['Admin', 'Doctor', 'Nurse', 'Receptionist'],
  records: ['Admin', 'Doctor', 'Nurse'],
  departments: ['Admin', 'Nurse', 'Receptionist', 'Lab Technician'],
  patients: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  predictions: ['Admin', 'Doctor'],
  medicines: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  reports: ['Admin'],
};

export const SETTINGS_TAB_ACCESS = {
  profile: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  security: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  notifications: ['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician'],
  system: ['Admin'],
};

export const canAccessRoute = (role, path) => {
  if (!role) {
    return false;
  }

  const allowedRoles = ROUTE_ACCESS[path];
  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
};

export const canAccessAction = (role, actionId) => {
  if (!role) {
    return false;
  }

  const allowedRoles = DASHBOARD_ACTION_ACCESS[actionId];
  return !!allowedRoles?.includes(role);
};

export const canAccessSettingsTab = (role, tabId) => {
  if (!role) {
    return false;
  }

  const allowedRoles = SETTINGS_TAB_ACCESS[tabId];
  return !!allowedRoles?.includes(role);
};

export const getPortalForRole = (role) => {
  return Object.values(PORTALS).find((portal) => portal.roles.includes(role)) || PORTALS.user;
};

export const getPortalLabelForRole = (role) => {
  return getPortalForRole(role).label;
};

export const isRoleAllowedForPortal = (role, portalId) => {
  if (!role || !portalId || !PORTALS[portalId]) {
    return false;
  }

  return PORTALS[portalId].roles.includes(role);
};

export const getDefaultRouteForRole = (role) => {
  const priority = ['/', '/appointments', '/patients', '/records', '/medicines', '/settings'];
  return priority.find((path) => canAccessRoute(role, path)) || '/';
};
