import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { commandConfigDefinition } from './models/command.model';
import { CommandConfigService } from './services/command-config.service';

@Module({
  imports: [MongooseModule.forFeature([commandConfigDefinition])],
  providers: [CommandConfigService],
  exports: [CommandConfigService],
})
export class CommandConfigModule {}
