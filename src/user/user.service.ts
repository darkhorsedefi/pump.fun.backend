import { Injectable } from '@nestjs/common';
import {DataSource, EntityManager} from "typeorm";
import {Token, UserAccount} from "../entities";
import {AddUserDto, GetUsersDto} from "../dto/user.dto";

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource,) {
  }

  async addNewUser(dto: AddUserDto, entityManager?: EntityManager) {
    const { address } = dto

    const data = await (entityManager || this.dataSource.manager).insert(UserAccount, {
      address: address.toLowerCase(),
      username: address.replaceAll('0x', '').slice(0, 6)
    })
    return data.identifiers[0].id
  }

  async getUserByAddress(address: string, entityManager?: EntityManager) {
    return await (entityManager || this.dataSource.manager).findOne(UserAccount, {
      where: {
        address: address.toLowerCase(),
      },
    })
  }

  async getTokensCreated(userAddress: string) {
    return await this.dataSource.manager.find(Token, {
      relations: ['user'],
      where: {
        user: {
          address: userAddress.toLowerCase()
        }
      },
      order: {
        createdAt: 'desc'
      }
    })
  }
}
