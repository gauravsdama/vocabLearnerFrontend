export const POLICY_VERSION = "2026-09-15";

export type PolicyAcceptance = {
  minimum_age_confirmed: true;
  terms_version: typeof POLICY_VERSION;
  privacy_version: typeof POLICY_VERSION;
};

export function currentPolicyAcceptance(): PolicyAcceptance {
  return {
    minimum_age_confirmed: true,
    terms_version: POLICY_VERSION,
    privacy_version: POLICY_VERSION,
  };
}
