import { Input } from '@/components/ui/input';
import { useFormActionProperty, useFormProperty } from '@/zustand/store';
import { set } from 'date-fns';
import React, { useState } from 'react';

const FormHeaderContent = () => {
  const formTheme = useFormProperty('theme');
  const formName = useFormProperty('name');
  const formDescription = useFormProperty('description');

  const [isEditingFormName, setEditingFormName] = useState(false);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const updateFormConfig = useFormActionProperty('updateFormConfig');

  const [isEditingFormDescription, setEditingFormDescription] = useState(false);

  const handleInputFocus = (isEditingFormDescription: boolean) => {
    if (isEditingFormDescription) setEditingFormDescription(true);
    else setEditingFormName(true);
    setTimeout(() => inputRef?.current?.focus() || null, 100);
  };

  return (
    <div className="flex flex-col gap-1 px-2 w-full break-all">
      {!isEditingFormName ? (
        <h3
          className="font-bold text-xl tracking-tight border-b border-b-transparent cursor-pointer"
          style={{ color: formTheme?.properties?.primaryTextColor }}
          onClick={() => handleInputFocus(false)}
        >
          {formName}
        </h3>
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          onBlur={() => setEditingFormName(false)}
          onChange={(e) =>
            updateFormConfig({
              name: e.target.value || '',
            })
          }
          value={formName || ''}
          className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0  focus-visible:border-b-input text-white/80 font-bold text-xl tracking-tight"
        />
      )}
      {!isEditingFormDescription ? (
        <p
          className="font-semibold text-[13px] border-b border-b-transparent cursor-pointer"
          style={{ color: formTheme?.properties?.primaryTextColor }}
          onClick={() => handleInputFocus(true)}
        >
          {formDescription}
        </p>
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          onBlur={() => setEditingFormDescription(false)}
          onChange={(e) =>
            updateFormConfig({
              description: e.target.value || '',
            })
          }
          value={formDescription || ''}
          className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0  text-white/80 font-semibold text-[13px] tracking-tight"
        />
      )}
    </div>
  );
};

export default FormHeaderContent;
