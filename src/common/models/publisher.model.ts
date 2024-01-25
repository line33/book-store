import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publishers & Document;

@Schema({ timestamps: true, versionKey: false })
export class Publishers {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const PublisherSchema = SchemaFactory.createForClass(Publishers).set(
  'toJSON',
  {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
);
