import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { FilterStoreDTO } from '../dto/store.dto';
import { FilterDataDTO } from 'src/_modules/filter/dto/filter.dto';
@Injectable()
export class StoreNearestService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserAddress(userId: number) {
    const address = await this.prisma.address.findFirst({
      where: { userId, default: true },
      select: { lat: true, lng: true },
    });

    if (!address) {
      throw new BadRequestException('User has no default address');
    }
    return address;
  }

  private buildWhere(filter: FilterStoreDTO ) {
    const whereParts: string[] = [];
    const params: any[] = [];

    if (filter?.address) {
      whereParts.push(`s.address LIKE ?`);
      params.push(`%${filter.address}%`);
    }
    if (filter?.rating) {
      whereParts.push(`s.rating = ?`);
      params.push(filter.rating);
    }
    if (filter?.moduleId) {
      whereParts.push(`s.module_id = ?`);
      params.push(filter.moduleId);
    }
    if (filter?.closed) {
      whereParts.push(`s.closed = ?`);
      params.push(filter.closed);
    }
    if (filter?.temporarilyClosed) {
      whereParts.push(`s.temporarily_closed = ?`);
      params.push(filter.temporarilyClosed);
    }
    if (filter?.status) {
      whereParts.push(`s.status = ?`);
      params.push(filter.status);
    }
    if (filter?.favouriteCustomerId) {
      whereParts.push(`EXISTS (
      SELECT 1 FROM favorite_store f 
      WHERE f.store_id = s.id AND f.customer_id = ?
    )`);
      params.push(filter.favouriteCustomerId);
    }

    return {
      sql: whereParts.length ? `AND ${whereParts.join(' AND ')}` : '',
      params,
    };
  }

  async getNearestStores(radiusKm = 50, limit = 10, filter?: FilterStoreDTO ) {
    const address = filter?.customerId
      ? await this.getUserAddress(filter?.customerId)
      : undefined;
    const { lat: userLat, lng: userLng } = address || {
      lat: filter?.lat,
      lng: filter?.lng,
    };

    const earthRadius = 6371;
    const latDelta = (radiusKm / earthRadius) * (180 / Math.PI);
    const lngDelta =
      (radiusKm / (earthRadius * Math.cos((Math.PI * userLat) / 180))) *
      (180 / Math.PI);

    const minLat = userLat - latDelta;
    const maxLat = userLat + latDelta;
    const minLng = userLng - lngDelta;
    const maxLng = userLng + lngDelta;

    const { sql: whereSql, params: whereParams } = this.buildWhere(filter);

    const result = await this.prisma.$queryRawUnsafe<any>(
      `
    SELECT 
      s.id,
      s.name,
      s.lat,
      s.lng,
      (
        6371 * acos(
          cos(radians(?)) * 
          cos(radians(s.lat)) * 
          cos(radians(s.lng) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(s.lat))
        )
      ) AS distance
    FROM stores s
    WHERE 
      s.lat BETWEEN ? AND ?
      AND s.lng BETWEEN ? AND ?
      ${whereSql}
    ORDER BY distance ASC
    LIMIT ?;
  `,
      userLat,
      userLng,
      userLat,
      minLat,
      maxLat,
      minLng,
      maxLng,
      ...whereParams,
      limit,
    );

    return result;
  }
}
