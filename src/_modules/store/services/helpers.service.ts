import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateStoreUserDTO } from '../dto/store.dto';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
import { hashPassword } from 'src/globals/helpers/password.helpers';
import { Prisma } from '@prisma/client';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}
  async isUserExist(data:CreateStoreUserDTO){

    const user = await this.prisma.user.findUnique({
      where: {
        phone_roleKey: {
          phone: data.phone,
          roleKey: RolesKeys.STORE,
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
    
    if (user)
      throw new ConflictException('user already exists');
    return user
  }
  async createUser(data:CreateStoreUserDTO,existingUser:Prisma.UserGetPayload<{
    select:{
      email:true,
      phone:true,
      id:true,
      name:true,
      verified:true
    }
  }>,tx:Prisma.TransactionClient){
        const hashedPassword = hashPassword(data.password);
        data.password = hashedPassword;
        if(existingUser && existingUser.email !== data.email){
          await tx.user.update({
            where: { id: existingUser.id },
            data: { email: data.email, name: data.name },
          });
          return existingUser;
        }
        const response =
          existingUser && !existingUser.verified
            ? existingUser
            : await tx.user.create({
                data: {
                  ...data,
                  roleKey: RolesKeys.STORE,
           verified:true
                },
                select: { email: true, phone: true, id: true, name: true },
              });
    
        if (existingUser?.verified) delete existingUser.verified;
        return response;
  }
}
