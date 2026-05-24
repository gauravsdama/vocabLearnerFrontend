import AppShell from "../components/AppShell";
import AuthPanel from "../components/AuthPanel";
import Card from "../components/Card";

export default function Register() {
  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <AuthPanel initialMode="register" />
      </Card>
    </AppShell>
  );
}
