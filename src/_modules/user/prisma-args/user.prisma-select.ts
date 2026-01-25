import {  Prisma, User } from '@prisma/client';
import { grouped } from '../helpers/auth.groupBy.helper';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { FilterUserCouponDTO } from '../dto/filter.user.coupon.dto';

export type FlattenedUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  active: boolean;
  image: string;
  createdAt: Date;
  deletedAt: Date | null;
 
  Role?: {
    id: number;
    name: string;
  };
  Permissions?: {
    name: string;
    prefix: string;
    method: string[];
  }[];
};

export const transformFlattenUser = (data: any | any[]): any => {
  const transform = (
    user: User & {
      Details: {
        wallet: number;
        points: number;
        male: boolean;
      };
      Role?: {
        id: number;
        name: string;
        RolePermission?: {
          id: number;
          Permission: {
            id: number;
            name: string;
            method: string;
            prefix: string;
          };
        }[];
      };
    },
  ): FlattenedUser => {
    const flatUser: FlattenedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
      active: user.active,
    
      image: user.image,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    };

    if (user?.Role) {
      flatUser.Role = {
        id: user?.Role?.id,
        name: user.Role.name,
      };

      if (user?.Role?.RolePermission) {
        flatUser.Permissions = grouped(
          user?.Role?.RolePermission.map((rp: any) => ({
            id: rp.Permission.id,
            name: rp.Permission.name,
            prefix: rp.Permission.prefix,
            method: rp.Permission.method,
          })),
        ) as { name: string; prefix: string; method: string[] }[];
      }
    }

    return flatUser;
  };

  if (Array.isArray(data)) {
    return data.map(transform);
  }

  return transform(data);
};
export const selectUserOBJ = () => {
  const selectArgs: Prisma.UserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    verified: true,
    roleKey: true,
    active: true,
    image: true,
 
    createdAt: true,
    deletedAt: true,
  };
  return selectArgs;
};

export const selectUserWithRoleOBJ = () => {
  const selectArgs: Prisma.UserSelect = {
    ...(selectUserOBJ() as Prisma.UserSelect),
    Role: {
      select: {
        id: true,
        roleKey: true,
        name: true,
      },
    },
  };
  return selectArgs;
};
export const selectUserWithRoleAndPermissionsOBJ = () => {
  const selectArgs: Prisma.UserSelect = {
    ...(selectUserWithRoleOBJ() as Prisma.UserSelect),
    Role: {
      select: {
        id: true,
        name: true,
        RolePermission: {
          select: {
            id: true,
            Permission: {
              select: {
                id: true,
                name: true,
                method: true,
                prefix: true,
              },
            },
          },
        },
      },
    },
  };
  return selectArgs;
};
export const selectFlattenedUserOBJ = () => {
  const selectArgs: FlattenedUser = {
    ...(selectUserWithRoleOBJ() as any),
    unReadNotifications: 'number',
    Permissions: [
      {
        name: 'string',
        prefix: 'string',
        method: [],
      },
    ] as FlattenedUser['Permissions'],
  };
  return selectArgs;
};
