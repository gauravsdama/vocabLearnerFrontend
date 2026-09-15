import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AuthPanel from "../src/components/AuthPanel";

const register = vi.fn(async () => {});

vi.mock("../src/auth/AuthContext", () => ({
  useAuth: () => ({
    authenticateWithGoogle: vi.fn(async () => {}),
    login: vi.fn(async () => {}),
    register,
  }),
}));

describe("registration consent", () => {
  it("requires both acknowledgements and sends the approved policy version", async () => {
    render(
      <MemoryRouter>
        <AuthPanel initialMode="register" />
      </MemoryRouter>,
    );

    const submit = screen.getByRole("button", { name: "Create account" });
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "learner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "strong-password" } });
    fireEvent.click(screen.getByLabelText("I confirm that I am at least 13 years old."));
    fireEvent.click(screen.getByLabelText(/I agree to the/));
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith(
        expect.objectContaining({
          minimum_age_confirmed: true,
          terms_version: "2026-09-15",
          privacy_version: "2026-09-15",
        }),
      ),
    );
  });
});
