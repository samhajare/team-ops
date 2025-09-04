import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: Repository<Customer>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password and create customer', async () => {
    const dto = { email: 'test@test.com', password: 'pass', name: 'Test' };
    const savedCustomer = { id: 1, ...dto, password: 'hashed' };
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (repo.save as jest.Mock).mockResolvedValue(savedCustomer);

    const result = await service.create(dto as any);
    expect(result).toMatchObject({ id: 1, email: 'test@test.com', name: 'Test' });
    expect(result).not.toHaveProperty('password');
  });

  it('should validate password correctly', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    expect(await service.validatePassword('plain', 'hashed')).toBe(true);
  });

  it('should login customer and return access token', async () => {
    const dto = { email: 'test@test.com', password: 'pass' };
    const customer = { id: 1, email: dto.email, password: 'hashed' };
    (repo.findOne as jest.Mock).mockResolvedValue(customer);
    jest.spyOn(service, 'validatePassword').mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await service.login(dto as any);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should throw error if customer not found on login', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.login({ email: 'x', password: 'y' } as any)).rejects.toThrow('Failed to login customer');
  });

  it('should throw error if password is invalid on login', async () => {
    const customer = { id: 1, email: 'test@test.com', password: 'hashed' };
    (repo.findOne as jest.Mock).mockResolvedValue(customer);
    jest.spyOn(service, 'validatePassword').mockResolvedValue(false);

    await expect(service.login({ email: 'test@test.com', password: 'wrong' } as any)).rejects.toThrow('Failed to login customer');
  });

  it('should find one customer', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    expect(await service.findOne(1)).toEqual({ id: 1 });
  });

  it('should update a customer', async () => {
    (repo.update as jest.Mock).mockResolvedValue({ affected: 1 });
    expect(await service.update(1, { name: 'New' })).toEqual({ affected: 1 });
  });

  it('should remove a customer', async () => {
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    expect(await service.remove(1)).toEqual({ affected: 1 });
  });
});
