import FormConfigSection from '@/components/common/FormConfigSection'
import { CheckCircle } from 'lucide-react'
import React from 'react'
import { FieldMaxLength, FieldMinLength, FieldPattern, FieldRequired } from './fields'

const FieldValidationSection = () => {
  return (
    <FormConfigSection
    subtitle="Setup validations for your fields quickly"
    icon={<CheckCircle className="w-4 h-4 text-muted-foreground" />}
    title="Field validation"
  >
        <FieldRequired />
        <FieldMinLength />
        <FieldMaxLength />
        <FieldPattern />
    </FormConfigSection>
  )
}

export default FieldValidationSection