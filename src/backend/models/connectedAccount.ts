import mongoose from 'mongoose';

const connectedAccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  accountEmail: {
    type: String,
    required: true,
  },
  accountPicture: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
    enum: ['google', 'airtable'],
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },

  expiryDate: {
    type: Number,
  },
  tokenType: {
    type: String,
  },

  idToken: {
    type: String,
  },

  scope: {
    type: String,
  },
});

export type ConnectedAccountType = mongoose.InferSchemaType<typeof connectedAccountSchema>;

const ConnectedAccount =
  mongoose.models?.ConnectedAccount || mongoose.model('ConnectedAccount', connectedAccountSchema);

export default ConnectedAccount as mongoose.Model<ConnectedAccountType>;
