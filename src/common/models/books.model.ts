import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Category } from './category.model';
import { Publishers } from './publisher.model';

export type BooksDocument = Books & Document;

@Schema({ timestamps: true, versionKey: false })
export class Books {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Category.name,
  })
  category: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Publishers.name,
  })
  publisher: Types.ObjectId;

  @Prop({ type: String, required: true })
  bookName: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, default: false, required: false })
  borrowed: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const BooksSchema = SchemaFactory.createForClass(Books).set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
