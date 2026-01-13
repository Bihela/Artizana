// tests/unit/ngoApplication.unit.test.ts
import { applyNGOHandler } from '../../src/routes/ngoApplication';
import { uploadFileToFirebase } from '../../src/utils/uploadToFirebase';
// @ts-ignore
import NGOApplication from '../../src/models/NGOApplication';

jest.mock('../../src/utils/uploadToFirebase');
jest.mock('../../src/models/NGOApplication');

describe('NGO Application Handler - Unit Tests', () => {
  let req, res;

  const mockFiles = {
    certificate: [{ buffer: Buffer.from('fake'), originalname: 'cert.pdf', size: 1024 }],
    proof: [{ buffer: Buffer.from('fake'), originalname: 'proof.jpg', size: 1024 }],
    logo: [{ buffer: Buffer.from('fake'), originalname: 'logo.png', size: 1024 }],
  };

  beforeEach(() => {
    req = {
      body: {
        organizationName: 'Hope Foundation',
        registrationNumber: 'REG123456',
        contactName: 'John Doe',
        contactEmail: 'john@hope.org',
        contactPhone: '+1234567890',
        address: '123 Charity St',
        mission: 'We help artisans in rural areas by providing training and market access. '.repeat(5),
      },
      files: mockFiles,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    (uploadFileToFirebase as jest.Mock).mockResolvedValue('https://firebase.mock/url/file.pdf');

    // Critical Fix: save() must return the full document with _id
    const mockSave = jest.fn().mockResolvedValue({
      _id: 'app123',
      organizationName: 'Hope Foundation',
      // ... other fields if needed
    });

    (NGOApplication as any).mockImplementation(() => ({
      save: mockSave,
      _id: 'app123', // also set directly in case accessed before save
    }));
  });

  afterEach(() => jest.clearAllMocks());

  test('should submit application successfully', async () => {
    (uploadFileToFirebase as jest.Mock).mockResolvedValue('https://firebase.mock/url/file.pdf');
    // Mock NGOApplication constructor and save method
    (NGOApplication as any).mockImplementation((data: any) => ({
      ...data,
      _id: 'mockId', // Add _id to instance so application._id works
      save: jest.fn().mockResolvedValue({
        _id: 'mockId',
        status: 'Pending',
        ...data
      })
    }));

    await applyNGOHandler(req as any, res as any);

    expect(uploadFileToFirebase).toHaveBeenCalled();
    expect(NGOApplication).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: 'mockId'
    }));
  });

  test('should reject if required fields are missing', async () => {
    delete req.body.organizationName;
    await applyNGOHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'All fields and certificate/proof files are required',
    });
  });

  test('should reject if file size exceeds 5MB', async () => {
    req.files.certificate[0].size = 6 * 1024 * 1024 + 1;
    await applyNGOHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Each file must be under 5MB',
    });
  });
});