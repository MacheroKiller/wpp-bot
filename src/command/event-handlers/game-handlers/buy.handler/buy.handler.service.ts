import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { GroupService } from 'src/group/services/group.service';
import { WAMessage } from 'baileys';

@Injectable()
export class BuyHandlerService {
  constructor(
    private readonly _accountHandler: AccountHandlerService,
    private readonly _groupService: GroupService,
  ) {}

  @OnEvent(Commands.BUY)
  private async handleBuy(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;

    const user = await this._groupService.getGroupMemberByJid(
      senderJid,
      groupJid,
    );

    if (!user) {
      await this._accountHandler.handleNoAccount(payload);
      return;
    }

    const itemsStore = await this._groupService.getStoreItems();

    if (!args.length) {
      await this.errorItemNoFoundMessage(client, groupJid, WaMessage);
      return;
    }

    const newItem = itemsStore.find(
      (item) => item.id === args[0].toUpperCase(),
    );
    const oldItem = itemsStore.find((item) => item.id === user.tool);

    if (!newItem) {
      await this.errorItemNoFoundMessage(client, groupJid, WaMessage);
      return;
    }

    if (user.balance < newItem.price) {
      await this.errorNotEnoughMoneyMessage(client, groupJid, WaMessage);
      return;
    }

    if (user.tool === newItem.id) {
      await this.errorSameToolMessage(client, groupJid, WaMessage);
      return;
    }

    if (oldItem!.price > newItem.price) {
      await this.errorDowngradeMessage(client, groupJid, WaMessage);
      return;
    }

    const newBalance = user.balance - newItem.price;
    await this._groupService.newBalanceMember(user, newBalance);
    await this._groupService.newToolMember(user, newItem.id as string);
    await client._wppSocket.sendMessage(groupJid, {
      text: `*The great piggy Nin 🐽:* Neeeeewwww adquisition!!! *${newItem.name}* for *$${newItem.price} MP*.
Your balance now is *$${newBalance}*.`,
    });
  }

  private async errorItemNoFoundMessage(
    client,
    groupJid,
    WaMessage: WAMessage,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*The great piggy Nin 🐽:* Buy... what?? `,
      },
      { quoted: WaMessage },
    );
  }

  private async errorNotEnoughMoneyMessage(
    client,
    groupJid,
    WaMessage: WAMessage,
  ) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*The great piggy Nin 🐽:* Bruh... no money = no item `,
      },
      { quoted: WaMessage },
    );
  }

  private async errorSameToolMessage(client, groupJid, WaMessage: WAMessage) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*The great piggy Nin 🐽:* Uh?!? Why do you want to acquire the same tool? `,
      },
      { quoted: WaMessage },
    );
  }

  private async errorDowngradeMessage(client, groupJid, WaMessage: WAMessage) {
    await client._wppSocket.sendMessage(
      groupJid,
      {
        text: `*The great piggy Nin 🐽:* No downgrade in my presence! `,
      },
      { quoted: WaMessage },
    );
  }
}
