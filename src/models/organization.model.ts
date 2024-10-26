import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
