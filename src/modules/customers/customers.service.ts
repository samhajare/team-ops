import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateCustomerDto,
  LoginCustomerDto,
  UserCreatedDTO,
} from './dto/create-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<UserCreatedDTO> {
    try {
      createCustomerDto.password = await bcrypt.hash(
        createCustomerDto.password,
        12,
      );
      const customer = await this.customerRepository.save(createCustomerDto);
      // Remove password from returned object
      const { password, ...customerWithoutPassword } = customer;
      void password;
      return customerWithoutPassword;
    } catch (error: any) {
      throw new BadRequestException('Failed to create customer', {
        cause: error,
      });
    }
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async login(
    loginCustomerDto: LoginCustomerDto,
  ): Promise<{ access_token: string }> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { email: loginCustomerDto.email },
        select: { id: true, email: true, password: true },
      });
      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
      if (
        !(await this.validatePassword(
          loginCustomerDto.password,
          customer.password,
        ))
      ) {
        throw new BadRequestException('Invalid password');
      }
      // Remove password from returned object
      const { password, ...customerWithoutPassword } = customer;
      void password;
      const payload = { ...customerWithoutPassword };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error: any) {
      throw new BadRequestException('Failed to login customer', {
        cause: error,
      });
    }
  }

  async findAll() {
    return await this.customerRepository.find();
  }

  async findOne(id: number) {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return await this.customerRepository.update(id, updateCustomerDto);
  }

  async remove(id: number) {
    return await this.customerRepository.delete(id);
  }
}
