import mongoose, { InferSchemaType } from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['submission', 'published', 'unpublished', 'integration_error'],
    },
    formId: {
      type: String,
      required: true,
    },
    formName: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
    },
  },
  { timestamps: true },
);

export type ActivityModelType = InferSchemaType<typeof activitySchema>;

const Activity = mongoose?.models?.Activity || mongoose.model('Activity', activitySchema);

export default Activity as mongoose.Model<ActivityModelType>;
