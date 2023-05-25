import { Schema, models, model, Model } from 'mongoose'
import { adminRole, githubProvider, userRole } from '../utils/types';

export interface UserModelSchema {
  name: string;
  email: string;
  role: 'user' | 'admin';
  provider: 'github';
  avatar?: string;
}

const UserSchema = new Schema<UserModelSchema>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: [userRole, adminRole],
    default: userRole
  },
  provider: {
    type: String,
    enum: [githubProvider],
  },
  avatar: {
    type: String,
  }
}, {
  timestamps: true
})

const User = models?.User || model('User', UserSchema)
export default User as Model<UserModelSchema>;