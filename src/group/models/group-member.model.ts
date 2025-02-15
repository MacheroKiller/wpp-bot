import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ItemsStore } from './items-store.model';

@Schema({ timestamps: true })
export class GroupMember {
  public static readonly NAME = 'group-member';

  @Prop()
  id: string;

  @Prop()
  jid: string;

  @Prop()
  name: string;

  @Prop()
  groupJid: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ type: String, ref: ItemsStore.NAME, default: 'BH' })
  tool: string;

  @Prop({ type: String, ref: ItemsStore.NAME, default: 'WS' })
  weapon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
const _schema = SchemaFactory.createForClass(GroupMember);
_schema.index({ groupJid: 1 }, { unique: true });

export const groupMemberDefinition = {
  name: GroupMember.NAME,
  schema: _schema,
};
