import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';

@Injectable()
export class StoreHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
  ) {}

  @OnEvent(Commands.STORE)
  private async handleStore(payload: CommandPayload) {
    const { senderJid, WaMessage, client } = payload;

    await client._wppSocket.sendMessage(
      senderJid,
      {
        text: `🐽 *Welcome to the great piggy Nin!* 🐽
-  ID   -  Pickaxe   -   Price
- (WP) Wooden Pickaxe: *$1'000 MP*
- (SP) Stone Pickaxe: *$10'000 MP*
- (GP) Gold Pickaxe: *$5'000 MP*
- (IP) Iron Pickaxe: *$100'000 MP*
- (DP) Diamond Pickaxe: *$1M MP*
- (NP) Netherite Pickaxe: *$10M MP*
- Use *!buy <id pickaxe>* to buy a pickaxe
- Use *!info <id pickaxe>* to see the pickaxe info`,
      },
      { quoted: WaMessage },
    );
  }
}
