interface ApiConfig {
  baseUrl: string;
  endpoints: {
    users: string;
    usersSignup: string;
    usersCheckExists: string;
    usersLogin: string;
    usersLogout: string;
    usersResetPassword: string;
    usersForgetPassword: string;
    usersRecommendations: string;
    usersUpdate: string;
    usersVerifyPassword: string;
    usersBibleStudy: string;
    usersCountSaved: string;
    usersSearch: string;
    usersAdvanceYears: string;
    webauthnGenerateRegister: string;
    webauthnVerifyRegister: string;
    webauthnGenerateAuthenticate: string;
    webauthnVerifyAuthenticate: string;
    superAdmin: string;
    admissionAdmin: string;
    admissionAdminAdmitUser: string;
    admissionAdminGetUsers: string;
    admissionAdminResetPassword: string;
    admissionAdminUpdateUser: string;
    admissionAdminGetFamilies: string;
    admissionAdminGetFamily: string;
    admissionAdminLinkFamily: string;
    admissionAdminUnlinkFamily: string;
    authGoogle: string;
    attendanceSession: string;
    attendanceSessionStatus: string;
    attendanceSessionOpen: string;
    attendanceSessionClose: string;
    attendanceSessionForceClose: string;
    attendanceSessionReset: string;
    attendanceSessionDelete: string;
    attendanceSessionReopen: string;
    attendanceSessionExtend: string;
    attendanceSign: string;
    attendanceSignAnonymous: string;
    attendanceSessions: string;
    attendanceStartSession: string;
    attendanceEndSession: string;
    attendanceRecords: string;
    messages: string;
    chatMessages: string;
    chatUpload: string;
    chatOnlineUsers: string;
    compassionHelp: string;
    compassionDonation: string;
    compassionRequests: string;
    compassionHelpAdmin: string;
    compassionDonationAdmin: string;
    compassionHelpUpdate: string;
    compassionDonationUpdate: string;
    compassionStats: string;
    compassionSettings: string;
    compassionAdminSettings: string;
    compassionUpdatePaymentMethods: string;
    compassionUpdateContactInfo: string;
    compassionAddPaymentMethod: string;
    compassionAddContactInfo: string;
    commitmentFormUserDetails: string;
    commitmentFormSubmit: string;
    commitmentFormMinistry: string;
    commitmentFormApprove: string;
    commitmentFormRevoke: string;
    commitmentFormByRole: string;
    worshipCoordinatorCommitments: string;
    myDocuments: string;
    uploadDocument: string;
    downloadDocument: string;
    viewDocument: string;
    deleteDocument: string;
    getUserDocumentsAdmin: string;
    getAllDocumentsAdmin: string;
    uploadDocumentAdmin: string;
    createDocumentCategory: string;
    getDocumentCategories: string;
    getDocumentsDashboard: string;
    updateDocumentStatus: string;
    archiveDocument: string;
    minutes: string;
    minutesPinStatus: string;
    minutesPinSetup: string;
    minutesPinVerify: string;
    overseerLogin: string;
    patronLogin: string;
    patronLogout: string;
    patronVerify: string;
    patronUsers: string;
    patronMessages: string;
    patronMedia: string;
    patronFamilies: string;
    patronChangePassword: string;
  };
}

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const developmentConfig: ApiConfig = {
  baseUrl: '',  // Use relative paths to leverage Vite proxy and avoid CORS issues
  endpoints: {
    users: '/users/data',
    usersSignup: '/users/signup',
    usersCheckExists: '/users/check-exists',
    usersLogin: '/users/login',
    usersLogout: '/users/logout',
    usersResetPassword: '/users/reset-password',
    usersForgetPassword: '/users/forget-password',
    usersRecommendations: '/users/recomendations',
    usersUpdate: '/users/update',
    usersVerifyPassword: '/users/verify-password',
    usersBibleStudy: '/users/bibleStudy',
    usersCountSaved: '/users/countSaved',
    usersSearch: '/users/search',
    usersAdvanceYears: '/users/advance-years',
    webauthnGenerateRegister: '/users/webauthn/register/generate',
    webauthnVerifyRegister: '/users/webauthn/register/verify',
    webauthnGenerateAuthenticate: '/users/webauthn/authenticate/generate',
    webauthnVerifyAuthenticate: '/users/webauthn/authenticate/verify',
    superAdmin: '/sadmin/login',
    admissionAdmin: '/admissionadmin/login',
    admissionAdminAdmitUser: '/admissionadmin/admit-user',
    admissionAdminGetUsers: '/admissionadmin/users',
    admissionAdminResetPassword: '/admissionadmin/reset-password',
    admissionAdminUpdateUser: '/admissionadmin/update-user/:userId',
    admissionAdminGetFamilies: '/admissionadmin/families',
    admissionAdminGetFamily: '/admissionadmin/families/:familyId',
    admissionAdminLinkFamily: '/admissionadmin/families/link',
    admissionAdminUnlinkFamily: '/admissionadmin/families/unlink',
    authGoogle: '/auth/google',
    attendanceSession: '/attendance/session',
    attendanceSessionStatus: '/attendance/session/status',
    attendanceSessionOpen: '/attendance/session/open',
    attendanceSessionClose: '/attendance/session/close',
    attendanceSessionForceClose: '/attendance/session/force-close',
    attendanceSessionReset: '/attendance/session/reset',
    attendanceSessionDelete: '/attendance/session/delete',
    attendanceSessionReopen: '/attendance/session/reopen',
    attendanceSessionExtend: '/attendance/session/extend',
    attendanceSign: '/attendance/sign',
    attendanceSignAnonymous: '/attendance/sign-anonymous',
    attendanceSessions: '/attendance/sessions',
    attendanceStartSession: '/attendance/start-session',
    attendanceEndSession: '/attendance/end-session',
    attendanceRecords: '/attendance/records',
    messages: '/messages',
    chatMessages: '/chat/messages',
    chatUpload: '/chat/upload',
    chatOnlineUsers: '/chat/online-users',
    compassionHelp: '/api/compassion/help-request',
    compassionDonation: '/api/compassion/donation',
    compassionRequests: '/api/compassion/user-requests',
    compassionHelpAdmin: '/api/compassion/admin/help-requests',
    compassionDonationAdmin: '/api/compassion/admin/donations',
    compassionHelpUpdate: '/api/compassion/admin/help-request',
    compassionDonationUpdate: '/api/compassion/admin/donation',
    compassionStats: '/api/compassion/admin/stats',
    compassionSettings: '/api/compassion/settings',
    compassionAdminSettings: '/api/compassion/admin/settings',
    compassionUpdatePaymentMethods: '/api/compassion/admin/settings/payment-methods',
    compassionUpdateContactInfo: '/api/compassion/admin/settings/contact-info',
    compassionAddPaymentMethod: '/api/compassion/admin/settings/payment-method',
    compassionAddContactInfo: '/api/compassion/admin/settings/contact-info',
    commitmentFormUserDetails: '/commitmentForm/user-details',
    commitmentFormSubmit: '/commitmentForm/submit-commitment',
    commitmentFormMinistry: '/commitmentForm/ministry',
    commitmentFormApprove: '/commitmentForm/approve',
    commitmentFormRevoke: '/commitmentForm/revoke',
    commitmentFormByRole: '/commitmentForm/by-role',
    worshipCoordinatorCommitments: '/commitmentForm/worship-coordinator',
    myDocuments: '/documents/my-docs',
    uploadDocument: '/documents/upload',
    downloadDocument: '/documents/download/:documentId',
    viewDocument: '/documents/view/:documentId',
    deleteDocument: '/documents/:documentId',
    getUserDocumentsAdmin: '/documents/admin/user/:userId',
    getAllDocumentsAdmin: '/documents/admin/all',
    uploadDocumentAdmin: '/documents/admin/upload',
    createDocumentCategory: '/documents/admin/category',
    getDocumentCategories: '/documents/admin/categories',
    getDocumentsDashboard: '/documents/admin/dashboard',
    updateDocumentStatus: '/documents/admin/:documentId/status',
    archiveDocument: '/documents/admin/:documentId/archive',
    minutes: '/minutes',
    minutesPinStatus: '/minutes/pin/status',
    minutesPinSetup: '/minutes/pin/setup',
    minutesPinVerify: '/minutes/pin/verify',
    overseerLogin: '/overseer/login',
    patronLogin: '/patron/login',
    patronLogout: '/patron/logout',
    patronVerify: '/patron/verify',
    patronUsers: '/patron/users',
    patronMessages: '/patron/messages',
    patronMedia: '/patron/media',
    patronFamilies: '/patron/families',
    patronChangePassword: '/patron/change-password',
  }
};

const productionConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://pentecostal-church-backend.onrender.com',
  endpoints: {
    users: '/users/data',
    usersSignup: '/users/signup',
    usersCheckExists: '/users/check-exists',
    usersLogin: '/users/login',
    usersLogout: '/users/logout',
    usersResetPassword: '/users/reset-password',
    usersForgetPassword: '/users/forget-password',
    usersRecommendations: '/users/recomendations',
    usersUpdate: '/users/update',
    usersVerifyPassword: '/users/verify-password',
    usersBibleStudy: '/users/bibleStudy',
    usersCountSaved: '/users/countSaved',
    usersSearch: '/users/search',
    usersAdvanceYears: '/users/advance-years',
    webauthnGenerateRegister: '/users/webauthn/register/generate',
    webauthnVerifyRegister: '/users/webauthn/register/verify',
    webauthnGenerateAuthenticate: '/users/webauthn/authenticate/generate',
    webauthnVerifyAuthenticate: '/users/webauthn/authenticate/verify',
    superAdmin: '/sadmin/login',
    admissionAdmin: '/admissionadmin/login',
    admissionAdminAdmitUser: '/admissionadmin/admit-user',
    admissionAdminGetUsers: '/admissionadmin/users',
    admissionAdminResetPassword: '/admissionadmin/reset-password',
    admissionAdminUpdateUser: '/admissionadmin/update-user/:userId',
    admissionAdminGetFamilies: '/admissionadmin/families',
    admissionAdminGetFamily: '/admissionadmin/families/:familyId',
    admissionAdminLinkFamily: '/admissionadmin/families/link',
    admissionAdminUnlinkFamily: '/admissionadmin/families/unlink',
    authGoogle: '/auth/google',
    attendanceSession: '/attendance/session',
    attendanceSessionStatus: '/attendance/session/status',
    attendanceSessionOpen: '/attendance/session/open',
    attendanceSessionClose: '/attendance/session/close',
    attendanceSessionForceClose: '/attendance/session/force-close',
    attendanceSessionReset: '/attendance/session/reset',
    attendanceSessionDelete: '/attendance/session/delete',
    attendanceSessionReopen: '/attendance/session/reopen',
    attendanceSessionExtend: '/attendance/session/extend',
    attendanceSign: '/attendance/sign',
    attendanceSignAnonymous: '/attendance/sign-anonymous',
    attendanceSessions: '/attendance/sessions',
    attendanceStartSession: '/attendance/start-session',
    attendanceEndSession: '/attendance/end-session',
    attendanceRecords: '/attendance/records',
    messages: '/messages',
    chatMessages: '/chat/messages',
    chatUpload: '/chat/upload',
    chatOnlineUsers: '/chat/online-users',
    compassionHelp: '/api/compassion/help-request',
    compassionDonation: '/api/compassion/donation',
    compassionRequests: '/api/compassion/user-requests',
    compassionHelpAdmin: '/api/compassion/admin/help-requests',
    compassionDonationAdmin: '/api/compassion/admin/donations',
    compassionHelpUpdate: '/api/compassion/admin/help-request',
    compassionDonationUpdate: '/api/compassion/admin/donation',
    compassionStats: '/api/compassion/admin/stats',
    compassionSettings: '/api/compassion/settings',
    compassionAdminSettings: '/api/compassion/admin/settings',
    compassionUpdatePaymentMethods: '/api/compassion/admin/settings/payment-methods',
    compassionUpdateContactInfo: '/api/compassion/admin/settings/contact-info',
    compassionAddPaymentMethod: '/api/compassion/admin/settings/payment-method',
    compassionAddContactInfo: '/api/compassion/admin/settings/contact-info',
    commitmentFormUserDetails: '/commitmentForm/user-details',
    commitmentFormSubmit: '/commitmentForm/submit-commitment',
    commitmentFormMinistry: '/commitmentForm/ministry',
    commitmentFormApprove: '/commitmentForm/approve',
    commitmentFormRevoke: '/commitmentForm/revoke',
    commitmentFormByRole: '/commitmentForm/by-role',
    worshipCoordinatorCommitments: '/commitmentForm/worship-coordinator',
    myDocuments: '/documents/my-docs',
    uploadDocument: '/documents/upload',
    downloadDocument: '/documents/download/:documentId',
    viewDocument: '/documents/view/:documentId',
    deleteDocument: '/documents/:documentId',
    getUserDocumentsAdmin: '/documents/admin/user/:userId',
    getAllDocumentsAdmin: '/documents/admin/all',
    uploadDocumentAdmin: '/documents/admin/upload',
    createDocumentCategory: '/documents/admin/category',
    getDocumentCategories: '/documents/admin/categories',
    getDocumentsDashboard: '/documents/admin/dashboard',
    updateDocumentStatus: '/documents/admin/:documentId/status',
    archiveDocument: '/documents/admin/:documentId/archive',
    minutes: '/minutes',
    minutesPinStatus: '/minutes/pin/status',
    minutesPinSetup: '/minutes/pin/setup',
    minutesPinVerify: '/minutes/pin/verify',
    overseerLogin: '/overseer/login',
    patronLogin: '/patron/login',
    patronLogout: '/patron/logout',
    patronVerify: '/patron/verify',
    patronUsers: '/patron/users',
    patronMessages: '/patron/messages',
    patronMedia: '/patron/media',
    patronFamilies: '/patron/families',
    patronChangePassword: '/patron/change-password',
  }
};

export const config = isProd ? productionConfig : developmentConfig;

export const getApiUrl = (endpoint: keyof ApiConfig['endpoints'] | string, queryParams?: string): string => {
  // Handle both predefined endpoints and custom paths
  const path = (endpoint in config.endpoints)
    ? config.endpoints[endpoint as keyof ApiConfig['endpoints']]
    : `/${endpoint}`;
  const url = `${config.baseUrl}${path}`;
  return queryParams ? `${url}?${queryParams}` : url;
};

export const getBaseUrl = (): string => {
  return config.baseUrl;
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;

  let url: string;
  // If it starts with /, treat as relative to base URL
  if (imagePath.startsWith('/')) {
    url = `${config.baseUrl}${imagePath}`;
  } else {
    // Otherwise, prepend uploads path
    url = `${config.baseUrl}/uploads/${imagePath}`;
  }

  // Add cache version to bust CDN cached 404s
  // If the path already has a query, don't double up
  if (imagePath.includes('?')) return url;
  
  return `${url}?v=${Date.now()}`;
};

export const isDevMode = (): boolean => isDev || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';