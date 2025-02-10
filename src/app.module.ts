import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappClientModule } from './whatsapp-client/whatsapp-client.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommandModule } from './command/command.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(mongoConfig.mongoUri!),
    WhatsappClientModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
