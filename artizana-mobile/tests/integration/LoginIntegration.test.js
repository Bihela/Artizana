// tests/integration/LoginIntegration.test.js
import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
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

describe("Login Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in successfully with API", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { role: "Buyer", name: "John Doe" },
      },
    });

    render(<Login />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Email"),
      "buyer@example.com"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Password"),
      "password123"
    );

    fireEvent.press(screen.getByTestId("loginButton"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/login",
        {
          email: "buyer@example.com",
          password: "password123",
        }
      );
    });

    // you can keep this if it behaves
    // expect(mockNavigate).toHaveBeenCalledWith("BuyerDashboard");
  });

  it("bypasses API with test credentials", () => {
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

    expect(mockReplace).toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
