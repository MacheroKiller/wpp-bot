import { InfoHandlerService } from './event-handlers/game-handlers/info.handler/info.handler.service';
import { Module } from '@nestjs/common';
import { HelpHandlerService } from './event-handlers/actions-handlers/help.handler/help.handler.service';
import { GroupModule } from 'src/group/group.module';
import { AccountHandlerService } from './event-handlers/game-handlers/account.handler/account.handler.service';
import { BalanceHandlerService } from './event-handlers/game-handlers/balance.handler/balance.handler.service';
import { CoinFlipHandlerService } from './event-handlers/game-handlers/coin-flip.handler/coin-flip.handler.service';
import { MineHandlerService } from './event-handlers/game-handlers/mine.handler/mine.handler.service';
import { StoreHandlerService } from './event-handlers/game-handlers/store.handler/store.handler.service';
import { BuyHandlerService } from './event-handlers/game-handlers/buy.handler/buy.handler.service';
import { AttackHandlerService } from './event-handlers/game-handlers/attack.handler/attack.handler.service';
import { MessageSenderService } from './event-handlers/actions-handlers/message.sender/message.sender.service';
import { CommandConfigModule } from 'src/command-config/command-config.module';
import { KissHandlerService } from './event-handlers/actions-handlers/kiss.handler/kiss.handler.service';
import { StealHandlerService } from './event-handlers/game-handlers/steal.handler/steal.handler.service';
import { PunchHandlerService } from './event-handlers/actions-handlers/punch.handler/punch.handler.service';
import { KillHandlerService } from './event-handlers/actions-handlers/kill.handler/kill.handler.service';
import { CreateAccountHandlerService } from './event-handlers/game-handlers/create-account.handler/create-account.handler.service';
import { RouletteHandlerService } from './event-handlers/game-handlers/roulette.handler/roulette.handler.service';
import { MusicHandlerService } from './event-handlers/multimedia/music-handler/music-handler.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [
    KissHandlerService,
    PunchHandlerService,
    KillHandlerService,
    CoinFlipHandlerService,
    HelpHandlerService,
    BalanceHandlerService,
    CreateAccountHandlerService,
    AccountHandlerService,
    MineHandlerService,
    StoreHandlerService,
    BuyHandlerService,
    InfoHandlerService,
    AttackHandlerService,
    MessageSenderService,
    StealHandlerService,
    RouletteHandlerService,
    MusicHandlerService,
  ],
  imports: [GroupModule, CommandConfigModule, HttpModule],
})
export class CommandModule {}
