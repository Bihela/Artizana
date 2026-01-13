// tests/integration/NGOApplyScreen.integration.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NGOApplyScreen from '../../src/screens/NGOApplyScreen';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

// Mock navigation prop directly
const mockReplace = jest.fn();

jest.mock('axios');
jest.mock('expo-document-picker');

describe('NGOApplyScreen - Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://doc.pdf', name: 'doc.pdf', size: 1024 * 1024 }],
    });
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
  });

  it('completes full flow and navigates on success', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NGOApplyScreen navigation={{ replace: mockReplace }} />
    );

    fireEvent.changeText(getByPlaceholderText('e.g. Hope Foundation'), 'Light of Hope');
    fireEvent.changeText(getByPlaceholderText('NGO-DARPAN ID or Certificate No.'), 'NGO999');
    fireEvent.changeText(getByPlaceholderText('John Doe'), 'Anita');
    fireEvent.changeText(getByPlaceholderText('contact@ngo.org'), 'anita@ngo.org');
    fireEvent.changeText(getByPlaceholderText('+91 98765 43210'), '+919900000000');
    fireEvent.changeText(getByPlaceholderText('Full address'), 'Mumbai');
    fireEvent.changeText(getByPlaceholderText('Tell us about your mission...'), 'We empower artisans. '.repeat(10));

    fireEvent.press(getByText('Upload Registration Certificate *'));
    fireEvent.press(getByText('Upload Additional Proof (80G, 12A, etc.) *'));

    await waitFor(() => expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledTimes(2));

    fireEvent.press(getByText('Submit Application'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('NGOApplicationSuccess');
    });
  }, 15000);
});