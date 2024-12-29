import { generateId } from '@/lib/utils';
import { FieldEntity, FieldValidation, FormSettings, FormStyles, PageEntity } from '@/types/form-config';
import mongoose, { InferSchemaType } from 'mongoose';

const pageEntitySchema = new mongoose.Schema<PageEntity>({
  id: {
    type: String,
    default: generateId,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  fields: {
    type: [String],
    required: true,
  },
});

const customValidationSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const conditionalLogicSchema = new mongoose.Schema({
  showWhen: [
    new mongoose.Schema({
      fieldId: String,
      operatorType: String,
      label: String,
      operator: String,
      value: String,
    }),
  ],
  operator: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND',
  },
});

const fieldValidationSchema = new mongoose.Schema<FieldValidation>({
  custom: {
    type: Map,
    of: {
      type: customValidationSchema,
    },
    default: {},
  },
});

const fieldEntitySchema = new mongoose.Schema<FieldEntity>({
  id: {
    type: String,
    default: generateId,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  helperText: {
    type: String,
  },
  defaultValue: {
    type: {},
  },
  readonly: {
    type: Boolean,
  },
  validation: {
    type: fieldValidationSchema,
  },
  options: {
    type: [Object],
  },
  conditionalLogic: {
    type: conditionalLogicSchema,
  },
  width: {
    type: String,
    default: '100%',
  },
  allowMultiSelect: {
    type: Boolean,
  },
});

const formSettingsSchema = new mongoose.Schema<FormSettings>({
  submission: {
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    redirectURL: {
      type: String,
      default: '',
    },
  },
  fileUploadLimit: {
    type: String,
    default: '5mb',
  },
});

const formStylesSchema = new mongoose.Schema<FormStyles>({
  fontFamily: String,
  backgroundColor: String,
  fontPrimaryColor: String,
  fontSecondaryColor: String,
});

export const formSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: generateId,
      unique: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Untitled Form ' + new Date()?.toDateString(),
      index: 'text',
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
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'], // Use enum for status
      default: 'draft',
      index: 'descending',
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    multiPage: {
      type: Boolean,
      required: true,
      default: false,
    },
    pages: {
      type: [String],
      required: true,
      default: [],
    },
    pageEntities: {
      type: Map,
      of: pageEntitySchema,
      required: true,
      default: {},
    },
    fieldEntities: {
      type: Map,
      of: fieldEntitySchema,
      required: true,
      default: {},
    },
    settings: {
      type: formSettingsSchema,
      required: false,
      default: {},
    },
    styles: {
      type: formStylesSchema,
      required: true,
      default: {},
    },
    theme: {
      type: Object,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

type FormModel = InferSchemaType<typeof formSchema>;

const Form = mongoose.models?.Form || mongoose.model<FormModel>('Form', formSchema);

export default Form as mongoose.Model<FormModel>;
