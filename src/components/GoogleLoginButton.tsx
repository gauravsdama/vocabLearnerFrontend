import { useMemo, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

type GoogleLoginButtonProps = {
  onCredential: (credential: string) => Promise<void> | void;
  disabled?: boolean;
};

export default function GoogleLoginButton({
  onCredential,
  disabled = false,
}: GoogleLoginButtonProps) {
  const clientId = useMemo(
    () =>
      import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ||
      import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID?.trim() ||
      "",
    [],
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  if (!clientId) {
    return <p className="helper">Google login is not configured.</p>;
  }

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential || disabled) {
      return;
    }
    setLoadError(null);
    await onCredential(response.credential);
  };

  return (
    <div className={disabled ? "google-button-shell google-button-disabled" : "google-button-shell"}>
      <div>
        <GoogleLogin
          onSuccess={(response) => {
            void handleSuccess(response);
          }}
          onError={() => setLoadError("Google login failed. Please try again.")}
          theme="outline"
          size="large"
          text="continue_with"
          shape="pill"
          width={360}
        />
        {loadError ? <p className="helper">{loadError}</p> : null}
      </div>
    </div>
  );
}
