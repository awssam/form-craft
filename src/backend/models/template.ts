import mongoose, { InferSchemaType } from 'mongoose';
import { formSchema } from './form';
import { generateId } from '@/lib/utils';

const templateMetaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
});

const templateSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateId,
    unique: true,
  },

  templateConfig: {
    type: formSchema,
    required: true,
  },
  meta: {
    type: templateMetaSchema,
    required: true,
  },
});

export type TemplateModel = InferSchemaType<typeof templateSchema>;

export const FormTemplate = mongoose.models?.FormTemplate || mongoose.model('FormTemplate', templateSchema);

export default FormTemplate as mongoose.Model<TemplateModel>;
