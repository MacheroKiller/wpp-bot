import { Module } from '@nestjs/common';
import { KissHandlerService } from './event-handlers/kiss.handler/kiss.handler.service';
import { CoinFlipHandlerService } from './event-handlers/coin-flip.handler/coin-flip.handler.service';

@Module({
  providers: [KissHandlerService, CoinFlipHandlerService],
})
export class CommandModule {}
