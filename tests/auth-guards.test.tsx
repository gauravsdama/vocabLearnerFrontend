import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GuestOnly from "../src/auth/GuestOnly";
import RequireAuth from "../src/auth/RequireAuth";
import RequireVerifiedAuth from "../src/auth/RequireVerifiedAuth";

type AuthState = {
  token: string | null;
  user: { email_verified?: boolean } | null;
  loading: boolean;
};

let authState: AuthState = {
  token: null,
  user: null,
  loading: false,
};

vi.mock("../src/auth/AuthContext", () => ({
  useAuth: () => authState,
}));

function renderGuard(initialPath: string, element: ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
        <Route path="/check-email" element={<div>Check email page</div>} />
        <Route path="/protected" element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("route guards", () => {
  beforeEach(() => {
    authState = { token: null, user: null, loading: false };
  });

  it("shows loading UI while auth state is hydrating", () => {
    authState = { token: null, user: null, loading: true };

    renderGuard("/protected", <RequireAuth><div>Secret</div></RequireAuth>);

    expect(screen.getByText("Preparing your page.")).toBeInTheDocument();
  });

  it("redirects guests away from protected routes", () => {
    renderGuard("/protected", <RequireAuth><div>Secret</div></RequireAuth>);

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects unverified users away from verified-only routes", () => {
    authState = { token: "token", user: { email_verified: false }, loading: false };

    renderGuard("/protected", <RequireVerifiedAuth><div>Secret</div></RequireVerifiedAuth>);

    expect(screen.getByText("Check email page")).toBeInTheDocument();
  });

  it("redirects signed-in guests to the dashboard", () => {
    authState = { token: "token", user: { email_verified: true }, loading: false };

    renderGuard("/protected", <GuestOnly><div>Guest page</div></GuestOnly>);

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});
