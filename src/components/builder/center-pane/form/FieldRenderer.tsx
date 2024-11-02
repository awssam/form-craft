import { FieldEntity } from '@/types/form-config'
import React from 'react'
import FormTextInput from './fields/TextInput'
import FormRadioInput from './fields/RadioInput'
import FormCheckboxInput from './fields/CheckboxInput'
import FormTextareaInput from './fields/TextareaInput'
import FormDateInput from './fields/DateInput'
import { Control } from 'react-hook-form'

interface FieldRendererProps  {
    field: FieldEntity
    control: Control
}


const FieldRenderer = ({ field, control }:FieldRendererProps) => {
  
   switch (field.type) {
      case "text":
        return <FormTextInput control={control}  field={field}/>
      case "textarea":
        return <FormTextareaInput control={control} field={field}/>
      case "date":
        return <FormDateInput control={control} field={field}/>
      case "checkbox":
        return <FormCheckboxInput control={control} field={field}/>;
      case "radio":
        return <FormRadioInput control={control} field={field}/>
      default:
        return <div>Default</div>;
    }
}

export default FieldRenderer




