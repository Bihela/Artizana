import request from 'supertest';
import express from 'express';
// @ts-ignore
import router from '../../src/routes/ngoApplication';
// @ts-ignore
import NGOApplication from '../../src/models/NGOApplication';
import { uploadFileToFirebase } from '../../src/utils/uploadToFirebase';

jest.mock('../../src/utils/uploadToFirebase');
jest.mock('../../src/models/NGOApplication');

(uploadFileToFirebase as jest.Mock).mockResolvedValue('https://mock.firebase/url.pdf');

const mockSave = jest.fn().mockResolvedValue({ _id: 'app456' });
(NGOApplication as any).mockImplementation(() => ({
  save: mockSave,
  _id: 'app456',
}));

const app = express();
app.use(express.json());
app.use('/api/ngo', router);

describe('NGO Application - Integration Tests', () => {
  const validPayload = {
    organizationName: 'Light of Hope',
    registrationNumber: 'NGO987654',
    contactName: 'Jane Smith',
    contactEmail: 'jane@lightofhope.org',
    contactPhone: '+1987654321',
    address: '456 Hope Avenue',
    mission: 'We empower rural women artisans through education, fair trade, and market access. '.repeat(3),
  };

  const createRequest = () =>
    request(app)
      .post('/api/ngo/apply')
      .attach('certificate', Buffer.from('fake pdf content'), 'certificate.pdf')
      .attach('proof', Buffer.from('fake proof'), 'proof.jpg')
      .attach('logo', Buffer.from('fake logo'), 'logo.png')
      .field(validPayload);

  test('POST /api/ngo/apply - success with all files', async () => {
    const res = await createRequest();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.applicationId).toBe('app456');
    expect(mockSave).toHaveBeenCalled();
  });

  test('POST /api/ngo/apply - fails without certificate', async () => {
    const res = await request(app)
      .post('/api/ngo/apply')
      .attach('proof', Buffer.from('fake'), 'proof.jpg')
      .field(validPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  test('POST /api/ngo/apply - fails with short mission', async () => {
    const res = await createRequest().field('mission', 'too short');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Mission must be at least 50 characters');
  });
});