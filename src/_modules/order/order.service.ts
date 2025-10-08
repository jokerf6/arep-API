import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { LanguagesService } from '../languages/languages.service';
import { CreateOrderDTO } from './dto/order.dto';
import { HelpersService } from './services/helpers.service';
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, 
    private readonly helpers: HelpersService
  ) {}
  async create(data: CreateOrderDTO) {
//coupounDiscount
//addressiD
//variants
//availability

  }
}
