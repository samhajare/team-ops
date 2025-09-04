import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController (integration)', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test' }),
      login: jest.fn().mockResolvedValue({ access_token: 'token' }),
      findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test' }),
    };
    const mockJwtService = { sign: jest.fn(), verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CustomersService, useValue: mockService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should create a customer', async () => {
    const dto = { email: 'test@test.com', password: 'pass', name: 'Test' };
    const result = await controller.create(dto as any);
    expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should login a customer', async () => {
    const dto = { email: 'test@test.com', password: 'pass' };
    const result = await controller.login(dto as any);
    expect(result).toEqual({ access_token: 'token' });
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('should find one customer', async () => {
    const result = await controller.findOne(1 as any);
    expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });
});
