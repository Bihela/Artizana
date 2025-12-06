// tests/unit/NGOApplyScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NGOApplyScreen from '../../src/screens/NGOApplyScreen';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { Alert } from 'react-native';

jest.mock('axios');
jest.mock('expo-document-picker');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: jest.fn(),
  }),
}));

const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('NGOApplyScreen - Unit Tests', () => {
  const mockNavigation = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{
        uri: 'file://mock.pdf',
        name: 'certificate.pdf',
        mimeType: 'application/pdf',
        size: 1024 * 1024,
      }],
    });
  });

  it('renders all inputs and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<NGOApplyScreen navigation={mockNavigation} />);
    expect(getByPlaceholderText('e.g. Hope Foundation')).toBeTruthy();
    expect(getByText('Upload Registration Certificate *')).toBeTruthy();
    expect(getByText('Submit Application')).toBeTruthy();
  });

  it('uploads logo and shows preview', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://logo.png', name: 'logo.png', mimeType: 'image/png', size: 500000 }],
    });

    const { getByTestId, getByTestId: getByTestIdAgain } = render(<NGOApplyScreen navigation={mockNavigation} />);
    const logoButton = getByTestId('logo-upload-button');
    fireEvent.press(logoButton);

    await waitFor(() => {
      const image = getByTestIdAgain('logo-upload-button').findByType('Image');
      expect(image.props.source.uri).toBe('file://logo.png');
    });
  });

  it('rejects file larger than 5MB', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://big.pdf', name: 'big.pdf', size: 6 * 1024 * 1024 + 1 }],
    });

    const { getByText } = render(<NGOApplyScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Upload Registration Certificate *'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('File too large', 'Please select a file under 5MB');
    });
  });

  it('submits form successfully', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    const { getByPlaceholderText, getByText } = render(<NGOApplyScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('e.g. Hope Foundation'), 'Hope NGO');
    fireEvent.changeText(getByPlaceholderText('NGO-DARPAN ID or Certificate No.'), 'REG123');
    fireEvent.changeText(getByPlaceholderText('John Doe'), 'Priya');
    fireEvent.changeText(getByPlaceholderText('contact@ngo.org'), 'priya@hope.org');
    fireEvent.changeText(getByPlaceholderText('+91 98765 43210'), '+919876543210');
    fireEvent.changeText(getByPlaceholderText('Full address'), 'Delhi');
    fireEvent.changeText(getByPlaceholderText('Tell us about your mission...'), 'We help artisans. '.repeat(10));

    fireEvent.press(getByText('Upload Registration Certificate *'));
    fireEvent.press(getByText('Upload Additional Proof (80G, 12A, etc.) *'));

    await waitFor(() => expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledTimes(2));

    fireEvent.press(getByText('Submit Application'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith('Success!', 'Application submitted successfully!');
      expect(mockNavigation.replace).toHaveBeenCalledWith('NGOApplicationSuccess');
    });
  });
});