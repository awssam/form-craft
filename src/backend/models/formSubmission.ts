import mongoose, { InferSchemaType } from 'mongoose';

const pageProgressSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const formSubmissionSchema = new mongoose.Schema(
  {
    submissionType: {
      type: String,
      enum: ['anonymous', 'authenticated'],
      required: true,
      default: 'anonymous',
    },
    submittedBy: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
    },
    data: {
      type: Map,
      of: Object,
      required: true,
    },
    pageProgress: {
      type: [pageProgressSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      required: true,
      default: 'pending',
    },
  },
  { timestamps: true },
);

export type FormSubmissionModelType = InferSchemaType<typeof formSubmissionSchema>;

export const FormSubmission = mongoose.models?.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);

export default FormSubmission as mongoose.Model<FormSubmissionModelType>;
