import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'items-store', timestamps: true })
export class ItemsStore {
  public static readonly NAME = 'items-store';

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  price: number;

  @Prop()
  multiplier: number;

  @Prop()
  description: string;
}

const _schema = SchemaFactory.createForClass(ItemsStore);
_schema.index({ name: 1 }, { unique: true });
_schema.index({ id: 1 }, { unique: true });

export const itemsStoreDefinition = {
  name: ItemsStore.NAME,
  schema: _schema,
};
