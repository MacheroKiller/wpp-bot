import { StoreHandlerService } from './event-handlers/store.handler/store.handler.service';
import { Module } from '@nestjs/common';
import { KissHandlerService } from './event-handlers/kiss.handler/kiss.handler.service';
import { CoinFlipHandlerService } from './event-handlers/coin-flip.handler/coin-flip.handler.service';
import { HelpHandlerService } from './event-handlers/help.handler/help.handler.service';
import { BalanceHandlerService } from './event-handlers/balance.handler/balance.handler.service';
import { GroupModule } from 'src/group/group.module';
import { AccountHandlerService } from './event-handlers/account.handler/account.handler.service';
import { MineHandlerService } from './event-handlers/mine.handler/mine.handler.service';

@Module({
  providers: [
    KissHandlerService,
    CoinFlipHandlerService,
    HelpHandlerService,
    BalanceHandlerService,
    AccountHandlerService,
    MineHandlerService,
    StoreHandlerService,
  ],
  imports: [GroupModule],
})
export class CommandModule {}
