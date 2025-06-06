import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  name: string;
  description: string;
  startTime: Date;
  durationMinutes: number;
  roomInfo: string; // Could be a link or text description
  isRecurring: boolean;
  recurrenceRule?: string; // e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO" or simple string "Daily"
  createdBy: string; // Discord User ID
}

const MeetingSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  roomInfo: { type: String, required: true },
  isRecurring: { type: Boolean, default: false },
  recurrenceRule: { type: String, required: false },
  createdBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
