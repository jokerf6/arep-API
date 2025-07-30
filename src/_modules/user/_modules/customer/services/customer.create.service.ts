import { ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from 'src/globals/helpers/password.helpers';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateCustomerDTO } from '../dto/create.customer.dto';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';

@Injectable()
export class CustomerCreateService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDTO) {
    const { male, ...rest } = data;

    const existingCustomer = await this.prisma.user.findUnique({
      where: {
        phone_roleKey: {
          phone: rest.phone,
          roleKey: RolesKeys.CUSTOMER,
        },
      },
      select: {
        email: true,
        phone: true,
        id: true,
        name: true,
        verified: true,
      },

      __includeDeleted: true as never,
    });
    if (existingCustomer && existingCustomer.verified)
      throw new ConflictException('customer already exists');

    const hashedPassword = hashPassword(rest.password);
    rest.password = hashedPassword;

    const response =
      existingCustomer && !existingCustomer.verified
        ? existingCustomer
        : await this.prisma.user.create({
            data: {
              ...rest,
              roleKey: RolesKeys.CUSTOMER,
              Details: {
                create: {
                  male,
                  points: 0,
                  wallet: 0.0,
                },
              },
            },
            select: { email: true, phone: true, id: true, name: true },
          });

    if (existingCustomer?.verified) delete existingCustomer.verified;
    return response;
  }
}
