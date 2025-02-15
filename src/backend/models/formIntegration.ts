import mongoose, { InferSchemaType } from 'mongoose';

const formIntegrationSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    connectedAccountId: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    fieldMappings: {
      type: Object,
    },
    config: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

export type FormIntegrationType = InferSchemaType<typeof formIntegrationSchema>;

const FormIntegration = mongoose.models?.FormIntegration || mongoose.model('FormIntegration', formIntegrationSchema);

export default FormIntegration as mongoose.Model<FormIntegrationType>;
