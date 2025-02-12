import { jidToNumber } from './../../whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupMember } from '../models/group-member.model';
import { Model } from 'mongoose';
import { ItemsStore } from '../models/items-store.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupMember.NAME)
    private readonly _groupMemberModel: Model<GroupMember>,
    @InjectModel(ItemsStore.NAME)
    private readonly _itemsStore: Model<ItemsStore>,
  ) {}

  getGroupMembers() {
    return this._groupMemberModel.find().exec();
  }

  newBalanceMember(groupMember: GroupMember, newBalance: number) {
    return this._groupMemberModel.findOneAndUpdate(
      { jid: groupMember.jid, groupJid: groupMember.groupJid },
      { $set: { balance: newBalance } },
      { new: true },
    );
  }

  newToolMember(groupMember: GroupMember, newTool: string) {
    return this._groupMemberModel.findOneAndUpdate(
      { jid: groupMember.jid, groupJid: groupMember.groupJid },
      { $set: { tool: newTool } },
      { new: true },
    );
  }

  createGroupMember(groupMember: GroupMember): Promise<GroupMember> {
    return this._groupMemberModel.create({ ...groupMember });
  }

  getGroupMemberByJid(jidMember: string, groupJid: string) {
    const jid = jidToNumber(jidMember);
    return this._groupMemberModel.findOne({ jid, groupJid }).exec();
  }

  // Store - items service
  getStoreItems() {
    return this._itemsStore.find().exec();
  }

  getStoreItemById(itemId: string) {
    return this._itemsStore.findOne({ id: itemId }).exec();
  }
}
