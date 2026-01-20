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

    const existingCustomer = await this.prisma.user.findFirst({
      where: {
       phone:rest.phone,
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
    if(existingCustomer && existingCustomer.email !== rest.email){
      await this.prisma.user.update({
        where: { id: existingCustomer.id },
        data: { email: rest.email, name: rest.name },
      });
      return existingCustomer;
    }
    const response =
      existingCustomer && !existingCustomer.verified
        ? existingCustomer
        : await this.prisma.user.create({
            data: {
              ...rest,
              roleKey: RolesKeys.CUSTOMER,
             
            },
            select: { email: true, phone: true, id: true, name: true },
          });

    if (existingCustomer?.verified) delete existingCustomer.verified;
    return response;
  }
}
