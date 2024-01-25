import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Users & Document;

@Schema({ timestamps: true, versionKey: false })
export class Users {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  email: string;

  @Prop({ default: Date.now() })
  dateEnrolled: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Users).set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
