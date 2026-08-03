import { Test, TestingModule } from '@nestjs/testing';
import { MetaService } from './meta.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  campaign: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

function mockMetaResponse(data: unknown[]) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data }),
  }) as unknown as typeof fetch;
}

describe('MetaService', () => {
  let service: MetaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.META_ACCESS_TOKEN = 'test-token';
    process.env.META_AD_ACCOUNT_ID = 'act_123';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MetaService>(MetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new local campaign for a Meta campaign not seen before', async () => {
    mockMetaResponse([
      {
        id: 'meta-1',
        name: 'Campagna da Meta',
        status: 'ACTIVE',
        lifetime_budget: '50000', // 500.00 nella valuta dell'account
        insights: { data: [{ spend: '120.50', ctr: '3.4' }] },
      },
    ]);
    mockPrismaService.campaign.findUnique.mockResolvedValue(null);
    mockPrismaService.campaign.create.mockResolvedValue({});

    const result = await service.syncCampaigns();

    expect(mockPrismaService.campaign.create).toHaveBeenCalledWith({
      data: {
        name: 'Campagna da Meta',
        status: 'ACTIVE',
        budget: 500,
        spend: 120.5,
        ctr: 3.4,
        externalId: 'meta-1',
      },
    });
    expect(result).toEqual({ fetched: 1, created: 1, updated: 0 });
  });

  it('should update an existing local campaign matched by externalId', async () => {
    mockMetaResponse([
      { id: 'meta-2', name: 'Esistente', status: 'PAUSED', daily_budget: '1000' },
    ]);
    mockPrismaService.campaign.findUnique.mockResolvedValue({ id: 9 });
    mockPrismaService.campaign.update.mockResolvedValue({});

    const result = await service.syncCampaigns();

    expect(mockPrismaService.campaign.update).toHaveBeenCalledWith({
      where: { externalId: 'meta-2' },
      data: {
        name: 'Esistente',
        status: 'PAUSED',
        budget: 10,
        spend: 0,
        ctr: 0,
        externalId: 'meta-2',
      },
    });
    expect(result).toEqual({ fetched: 1, created: 0, updated: 1 });
  });

  it('should map unknown Meta statuses to PAUSED', async () => {
    mockMetaResponse([
      { id: 'meta-3', name: 'In review', status: 'WITH_ISSUES' },
    ]);
    mockPrismaService.campaign.findUnique.mockResolvedValue(null);
    mockPrismaService.campaign.create.mockResolvedValue({});

    await service.syncCampaigns();

    expect(mockPrismaService.campaign.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'PAUSED' }) }),
    );
  });
});
