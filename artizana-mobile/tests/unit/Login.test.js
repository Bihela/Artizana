// tests/unit/Login.test.js
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Login from "../../src/screens/Login";
import axios from "axios";

// mock axios
jest.mock("axios");

// mock async storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

// mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders fields correctly", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByTestId("loginButton")).toBeTruthy();
  });

  test("shows validation error for empty fields", () => {
    render(<Login />);

    fireEvent.press(screen.getByTestId("loginButton"));

    expect(
      screen.getByText("Email and password are required")
    ).toBeTruthy();
  });

  test("test credentials navigate without API", () => {
    render(<Login />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "test@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123"
    );

    fireEvent.press(screen.getByTestId("loginButton"));

    // just check that some navigation happened
    expect(mockReplace).toHaveBeenCalled();
    // the important part for the assignment
    expect(axios.post).not.toHaveBeenCalled();
  });
});
