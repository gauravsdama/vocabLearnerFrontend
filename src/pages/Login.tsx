import AppShell from "../components/AppShell";
import AuthPanel from "../components/AuthPanel";
import Card from "../components/Card";

export default function Login() {
  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <AuthPanel initialMode="login" />
      </Card>
    </AppShell>
  );
}
