import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseProviders } from 'src/common/database.provider';

@Module({
  imports: [MongooseModule.forFeature([...DatabaseProviders])],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
