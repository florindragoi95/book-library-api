import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@generated/client";


@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    async onModuleInit(): Promise<any> {
        await this.$connect()
    }

}
