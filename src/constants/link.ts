export const LINK_HEARTBEAT = 'linkHeartbeat';
export const LINK_HEARTBEAT_ACK = 'linkHeartbeatAck';

export const LINK_LOGIN = 'linkLogin';
export const LINK_LOGIN_ACK = 'linkLoginAck';

export const LINK_CREATE_ACCOUNT = 'linkCreateAccount';
export const LINK_CREATE_ACCOUNT_ACK = 'linkCreateAccountAck';

export const LINK_LOGOUT = 'linkLogout';
export const LINK_LOGOUT_ACK = 'linkLogoutAck';

export const LINK_NEW_INSTITUTION = 'linkNewInstitution';
export const LINK_NEW_INSTITUTION_ACK = 'linkNewInstitutionAck';

export const LINK_UPDATE_INSTITUTION = 'linkUpdateInstitution';
export const LINK_UPDATE_INSTITUTION_ACK = 'linkUpdateInstitutionAck';

export const LINK_UNLINK_INSTITUTION = 'linkUnlinkInstitution';
export const LINK_UNLINK_INSTITUTION_ACK = 'linkUnlinkInstitutionAck';

export const LINK_NEW_INSTITUTION_TOKEN = 'linkNewInstitutionToken';
export const LINK_NEW_INSTITUTION_TOKEN_ACK = 'linkNewInstitutionTokenAck';

export const LINK_UPDATE_INSTITUTION_TOKEN = 'linkUpdateInstitutionToken';
export const LINK_UPDATE_INSTITUTION_TOKEN_ACK = 'linkUpdateInstitutionTokenAck';

export const LINK_SUMMARY = 'linkSummary';
export const LINK_SUMMARY_ACK = 'linkSummaryAck';

export const LINK_SYNC = 'linkSync';

export const LINK_COOKIE = 'linkCookie';

export enum ApiEndpoints {
  HEARTBEAT = '/heartbeat',
  USER_LOGIN = '/login',
  USER_CREATE_ACCOUNT = '/create-account',
  USER_LOGOUT = '/logout',
  SUMMARY = '/api/v1/summary',
  SYNC = '/api/v1/sync',
  NEW_INSTITUTION = '/api/v1/institutions/create',
  UPDATE_INSTITUTION = '/api/v1/institutions/update',
  UNLINK_INSTITUTION = '/api/v1/institutions/unlink',
  NEW_INSTITUTION_TOKEN = '/api/v1/institutions/new-token',
  UPDATE_INSTITUTION_TOKEN = '/api/v1/institutions/update-token',
}
