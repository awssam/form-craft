import { generateId } from '@/lib/utils';
import mongoose, { InferSchemaType } from 'mongoose';

const templateCategorySchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateId,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  templates: {
    type: [String],
    required: true,
  },
});

export type TemplateCategoryModel = InferSchemaType<typeof templateCategorySchema>;
export const TemplateCategory =
  mongoose.models?.TemplateCategory ||
     mongoose.model<TemplateCategoryModel>('TemplateCategory', templateCategorySchema);

export default TemplateCategory as mongoose.Model<TemplateCategoryModel>;
