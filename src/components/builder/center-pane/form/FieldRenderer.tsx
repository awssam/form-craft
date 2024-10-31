import { FieldEntity } from '@/types/form-config'
import React from 'react'
import FormTextInput from './fields/TextInput'
import FormRadioInput from './fields/RadioInput'
import FormCheckboxInput from './fields/CheckboxInput'
import FormTextareaInput from './fields/TextareaInput'

interface FieldRendererProps  {
    field: FieldEntity
}


const FieldRenderer = ({ field }:FieldRendererProps) => {
  
   switch (field.type) {
      case "text":
        return <FormTextInput field={field}/>
      case "textarea":
        return <FormTextareaInput field={field}/>
      case "date":
        return <div>Date</div>;
      case "checkbox":
        return <FormCheckboxInput field={field}/>;
      case "radio":
        return <FormRadioInput field={field}/>
      default:
        return <div>Default</div>;
    }
}

export default FieldRenderer




