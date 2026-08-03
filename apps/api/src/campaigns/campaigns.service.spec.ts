import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { PrismaService } from '../prisma/prisma.service';

const mockCampaign = {
  id: 1,
  name: 'Estate 2026',
  status: 'ACTIVE',
  budget: 500,
  spend: 210,
  ctr: 4.2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock minimale di PrismaService: espone solo i metodi di prisma.campaign
// usati dal service, così i test non toccano un database reale.
const mockPrismaService = {
  campaign: {
    findMany: jest.fn().mockResolvedValue([mockCampaign]),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CampaignsService', () => {
  let service: CampaignsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the list of campaigns', async () => {
    await expect(service.findAll()).resolves.toEqual([mockCampaign]);
  });

  it('should return a campaign by id', async () => {
    mockPrismaService.campaign.findUnique.mockResolvedValue(mockCampaign);
    await expect(service.findOne(1)).resolves.toEqual(mockCampaign);
  });

  it('should throw NotFoundException when the campaign does not exist', async () => {
    mockPrismaService.campaign.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a new campaign', async () => {
    const dto = { name: 'Natale 2026', budget: 200 };
    mockPrismaService.campaign.create.mockResolvedValue({
      ...mockCampaign,
      id: 4,
      ...dto,
    });
    const result = await service.create(dto as any);
    expect(mockPrismaService.campaign.create).toHaveBeenCalledWith({
      data: dto,
    });
    expect(result.name).toBe('Natale 2026');
  });

  it('should update an existing campaign', async () => {
    mockPrismaService.campaign.update.mockResolvedValue({
      ...mockCampaign,
      budget: 999,
    });
    const result = await service.update(1, { budget: 999 });
    expect(result.budget).toBe(999);
  });

  it('should remove an existing campaign', async () => {
    mockPrismaService.campaign.delete.mockResolvedValue(mockCampaign);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockPrismaService.campaign.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
