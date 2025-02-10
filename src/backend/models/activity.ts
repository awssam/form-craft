import mongoose, { InferSchemaType } from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['submission', 'published', 'unpublished'],
    },
    formId: {
      type: String,
      required: true,
    },
    formName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type ActivityModelType = InferSchemaType<typeof activitySchema>;

const Activity = mongoose?.models?.Activity || mongoose.model('Activity', activitySchema);

export default Activity as mongoose.Model<ActivityModelType>;
