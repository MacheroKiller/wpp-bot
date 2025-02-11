import { InfoHandlerService } from './event-handlers/game-handlers/info.handler/info.handler.service';
import { Module } from '@nestjs/common';
import { KissHandlerService } from './event-handlers/kiss.handler/kiss.handler.service';
import { HelpHandlerService } from './event-handlers/help.handler/help.handler.service';
import { GroupModule } from 'src/group/group.module';
import { AccountHandlerService } from './event-handlers/game-handlers/account.handler/account.handler.service';
import { BalanceHandlerService } from './event-handlers/game-handlers/balance.handler/balance.handler.service';
import { CoinFlipHandlerService } from './event-handlers/game-handlers/coin-flip.handler/coin-flip.handler.service';
import { MineHandlerService } from './event-handlers/game-handlers/mine.handler/mine.handler.service';
import { StoreHandlerService } from './event-handlers/game-handlers/store.handler/store.handler.service';
import { BuyHandlerService } from './event-handlers/game-handlers/buy.handler/buy.handler.service';

@Module({
  providers: [
    KissHandlerService,
    CoinFlipHandlerService,
    HelpHandlerService,
    BalanceHandlerService,
    AccountHandlerService,
    MineHandlerService,
    StoreHandlerService,
    BuyHandlerService,
    InfoHandlerService,
  ],
  imports: [GroupModule],
})
export class CommandModule {}
