import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  about: string;
}
