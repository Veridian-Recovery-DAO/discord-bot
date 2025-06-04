import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string; // Discord User ID (unique)
  username: string; // Discord username (can change, store for convenience)
  bio?: string;
  recoveryInterests?: string[];
  isMember: boolean; // Based on holding membership NFT
  contributionPoints?: number; // Example field
  joinedDAOAt: Date;
  // Add other relevant fields
}

const UserProfileSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  bio: { type: String, maxLength: 250 },
  recoveryInterests: [{ type: String }],
  isMember: { type: Boolean, default: false },
  contributionPoints: { type: Number, default: 0 },
  joinedDAOAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
