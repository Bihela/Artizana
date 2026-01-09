// src/__tests__/integration/LoginIntegration.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../App";

test("navigates to /login and shows login form", () => {
  // Pretend the user typed /login in the browser
  window.history.pushState({}, "Login page", "/login");

  // App already has <BrowserRouter> inside, so just render it
  render(<App />);

  // Assert that the login screen is visible
  expect(screen.getByRole('heading', { name: /Artizana Login/i })).toBeInTheDocument();
});
