import { useMemo } from 'react';

import FormField from '@/components/common/FormField';
import { Combobox, Option } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useFormActionProperty, useFormProperty } from '@/zustand/store';

import { FormConfig } from '@/types/form-config';
import ComingSoonBadge from '@/components/common/FeatureReleaseBadge';

const usePropertyAndUpdate = <K extends keyof FormConfig>(key: K) => {
  const v = useFormProperty(key)!;
  const updateFormConfig = useFormActionProperty('updateFormConfig');
  const handleChange = (key: keyof FormConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ [key]: e.target.value });
  };
  return { v, handleChange };
};

export const FormDescription = () => {
  const { v: description, handleChange } = usePropertyAndUpdate('description');
  return (
    <FormField label="Form Description" id="description">
      <Input id="description" value={description} className="bg-background" onChange={handleChange('description')} />
    </FormField>
  );
};

export const FormTags = () => {
  const tags = useFormProperty('tags');
  const updateFormConfig = useFormActionProperty('updateFormConfig');
  const tagOptions = useMemo(() => tags?.map((tag) => ({ value: tag, label: tag })) || [], [tags]);

  const handleSelect = (options: Option[]) => {
    updateFormConfig({ tags: options.map((option) => option.value?.toString()) as string[] });
  };

  return (
    <FormField label="Tags (Only for filtering)" id="tags">
      <Combobox
        handleChange={handleSelect}
        selectedValues={[tagOptions[0]]}
        // TODO fetch from api
        options={tagOptions}
        allowMultiple
      />
    </FormField>
  );
};

export const FormCover = () => {
  return (
    <FormField
      label="Cover Picture"
      id="coverPicture"
      renderLabelExtraContent={() => <ComingSoonBadge className="ml-2" />}
    >
      <Input id="coverPicture" className="bg-background" type="file" />
    </FormField>
  );
};

export const FormStatus = () => {
  const { v: status, handleChange } = usePropertyAndUpdate('status');
  return (
    <FormField label="Form Status" id="formStatus">
      <RadioGroup defaultValue={status} className="flex items-center gap-4 my-1" onChange={handleChange('status')}>
        <div className="flex items-center space-x-1.5">
          <RadioGroupItem value="draft" id="draft" />
          <Label htmlFor="draft">Draft</Label>
        </div>
        <div className="flex items-center space-x-1.5">
          <RadioGroupItem value="ready" id="ready" />
          <Label htmlFor="ready">Ready</Label>
        </div>
      </RadioGroup>
    </FormField>
  );
};
