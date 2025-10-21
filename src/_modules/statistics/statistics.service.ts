import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';


import { LanguagesService } from '../languages/languages.service';
import { RolesKeys } from '../authorization/providers/roles';
import { FilterStatisticsDTO } from './dto/statistics.dto';
import { FilterByFromToDate } from './prisma-args/statistics.prisma.args';
@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, 
  ) {}

  async getStatistics(filters: FilterStatisticsDTO) {
    const { fromDate, toDate } = filters;
  const totalCustomers=await this.prisma.user.count({
    where:{
      roleKey:RolesKeys.CUSTOMER,
...FilterByFromToDate(fromDate,toDate,'createdAt')
    }
  })  
    const totalStores=await this.prisma.user.count({
    where:{
      roleKey:RolesKeys.STORE,
...FilterByFromToDate(fromDate,toDate,'createdAt')

    }
  })  
  const totalOrders=await this.prisma.order.count({
    where:{
 ...FilterByFromToDate(fromDate,toDate,'date')

    }
  })
  const totalCoupons=await this.prisma.coupon.count({
    where:{
...FilterByFromToDate(fromDate,toDate,'createdAt')
    }
  })
const groupByCustomers = await this.prisma.user.groupBy({
  by: ['createdAt'],
  where: {
    roleKey: RolesKeys.CUSTOMER,
    ...FilterByFromToDate(fromDate, toDate, 'createdAt'),
  },
  _count: {
    _all: true,
  },
  orderBy: {
    createdAt: 'asc',
  },
});
const groupByStores = await this.prisma.user.groupBy({
  by: ['createdAt'],
  where: {
    roleKey: RolesKeys.STORE,
    ...FilterByFromToDate(fromDate, toDate, 'createdAt'),
  },
  _count: {
    _all: true,
  },
  orderBy: {
    createdAt: 'asc',
  },
});
const groupByOrders = await this.prisma.order.groupBy({
  by: ['date'],
  where: {
    ...FilterByFromToDate(fromDate, toDate, 'date'),
  },
  _count: {
    _all: true,
  },
  orderBy: {
    date: 'asc',
  },
});
return {
  totalCustomers,
  totalStores,
  totalOrders,
  totalCoupons,
  groupByCustomers,
  groupByStores,
  groupByOrders,
}
}
}
