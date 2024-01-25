import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseProviders } from 'src/common/database.provider';
import { AdminService } from '../admin/admin.service';

@Module({
  exports: [ClientService],
  providers: [ClientService, AdminService],
  controllers: [ClientController],
  imports: [MongooseModule.forFeature([...DatabaseProviders])],
})
export class ClientModule {}
