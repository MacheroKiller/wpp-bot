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
  private async handleMine(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*Welcome to the great piggy Nin!*
-  ID   -  Pickaxe   -   Price
- (WP) Wooden Pickaxe: *$1.000 MP*
- (SP) Stone Pickaxe: *$10.000 MP*
- (IP) Iron Pickaxe: *$100.000 MP*
- (GP) Gold Pickaxe: *$1M MP*
- (DP) Diamond Pickaxe: *$10M MP*
- (NP) Netherite Pickaxe: *$1000M MP*
- Use !buy <id pickaxe> to buy`,
      },
      { quoted: WaMessage },
    );
  }
}
