import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { GroupService } from 'src/group/services/group.service';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  errorDowngradeMessage,
  errorItemNoFoundMessage,
  errorNotEnoughMoneyMessage,
  errorSameItemMessage,
  itemBoughtMessage,
} from '../../utils/message-sender.utils';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class BuyHandlerService {
  constructor(
    private readonly _accountHandler: AccountHandlerService,
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.BUY)
  private async handleBuy(payload: CommandPayload, user: GroupMember) {
    const { groupJid, args, WaMessage, client } = payload;

    const itemsStore = await this._groupService.getStoreItems();

    const itemToFind = args[0] ? args[0].toUpperCase() : '';

    const newItemToBuy = itemsStore.find((item) => item.id === itemToFind);

    if (!newItemToBuy) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorItemNoFoundMessage,
      );
      return;
    }

    if (user.balance < newItemToBuy.price) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorNotEnoughMoneyMessage,
      );
      return;
    }

    const userItem = newItemToBuy.type === 'tool' ? user.tool : user.weapon;
    const oldItem = itemsStore.find((item) => item.id === userItem);

    if (userItem === newItemToBuy.id) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorSameItemMessage,
      );
      return;
    }

    if (oldItem!.price > newItemToBuy.price) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorDowngradeMessage,
      );
      return;
    }

    const finalPrice = newItemToBuy.price * -1;
    await this._groupService.updateBalance(user, {}, finalPrice);
    await this._groupService.newItemMember(user, newItemToBuy);
    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      itemBoughtMessage(newItemToBuy, user.balance + finalPrice),
    );
  }
}
