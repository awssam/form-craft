import React from 'react';
import CustomTooltip from '../ui/custom-tooltip';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

const EditableText = ({
  value,
  onChange,
  renderText,
  inputClassName,
  tooltipBtnClassName,
  inputPlaceholder,
  tooltipPosition,
}: {
  value: string;
  onChange: (newValue: string) => void;
  renderText: (value: string, onClick: () => void) => React.ReactNode;
  inputClassName?: string;
  inputPlaceholder?: string;
  tooltipBtnClassName?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleInputFocus = () => {
    setIsEditing(true);
    setTimeout(() => inputRef?.current?.focus() || null, 100);
  };

  return (
    <CustomTooltip
      tooltip={isEditing ? 'Click outside to Save' : 'Click to Edit'}
      triggerClassName={cn('self-start w-full text-left', tooltipBtnClassName)}
      side={tooltipPosition}
      align="start"
    >
      <div className="items-start flex flex-col gap-1 w-full break-all" tabIndex={0} onFocus={handleInputFocus}>
        {!isEditing ? (
          renderText(value, handleInputFocus)
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            className={cn(
              'border-0 p-0 w-full border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0  focus-visible:border-b-input text-gray-900 font-semibold text-[13px] tracking-tight',
              inputClassName,
            )}
            placeholder={inputPlaceholder}
          />
        )}
      </div>
    </CustomTooltip>
  );
};

export default EditableText;
