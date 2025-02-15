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

  newBalanceMember(groupMember: GroupMember, updateTime: boolean = true) {
    return this._groupMemberModel.findOneAndUpdate(
      { jid: groupMember.jid, groupJid: groupMember.groupJid },
      { $set: { balance: groupMember.balance } },
      { new: true, timestamps: updateTime },
    );
  }

  // We can change this with a better approach
  newItemMember(groupMember: GroupMember, newWeapon: ItemsStore) {
    return this._groupMemberModel.findOneAndUpdate(
      { jid: groupMember.jid, groupJid: groupMember.groupJid },
      { $set: { [newWeapon.type]: newWeapon.id } },
      { new: true },
    );
  }

  createGroupMember(groupMember: GroupMember): Promise<GroupMember> {
    return this._groupMemberModel.create({ ...groupMember });
  }

  getGroupMemberByJidAndGroup(jidMember: string, groupJid: string) {
    const jid = jidToNumber(jidMember);
    return this._groupMemberModel.findOne({ jid, groupJid }).exec();
  }

  getTopGroupMembersByGroup(groupJid: string) {
    return this._groupMemberModel
      .find({ groupJid })
      .sort({ balance: -1 })
      .limit(5)
      .exec();
  }

  // Store - items service
  getStoreItems() {
    return this._itemsStore.find().exec();
  }

  getStoreItemById(itemId: string) {
    return this._itemsStore.findOne({ id: itemId }).exec();
  }
}
