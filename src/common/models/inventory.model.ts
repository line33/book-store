import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Books } from './books.model';
import { Users } from './users.model';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true, versionKey: false })
export class Inventory {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Books.name,
  })
  book: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
  })
  user: Types.ObjectId;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ default: Date.now() })
  dateCollected: Date;

  @Prop({ type: Boolean, default: false })
  recovered: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory).set(
  'toJSON',
  {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
);
