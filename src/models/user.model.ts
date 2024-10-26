import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);


export interface User extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
}

// Hash password before saving
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

export { UserSchema };
