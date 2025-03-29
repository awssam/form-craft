'use client';

import { useMemo, useState } from 'react';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput as FileUploadInput,
} from '@/components/ui/file-upload';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import React from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { useFormConfigStore } from '@/zustand/store';
import FormFieldWrapper from './FormFieldWrapper';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';
import EditableHelperText from './EditableHelperText';
import { ACCEPTED_FILE_TYPES_MAP } from '@/lib/form';

const FileInput = ({ field, className, control, isOverlay }: FormFieldProps) => {
  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = useMemo(
    () => ({
      maxFiles: +field?.validation?.custom?.maxFiles?.value || (field?.allowMultiSelect ? 10 : 1),
      maxSize: 1024 * 1024 * +(field?.validation?.custom?.maxFileSize?.value || 4),
      multiple: field?.allowMultiSelect,
      accept: ACCEPTED_FILE_TYPES_MAP,
    }),
    [
      field?.allowMultiSelect,
      field?.validation?.custom?.maxFileSize?.value,
      field?.validation?.custom?.maxFiles?.value,
    ],
  );

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <DraggableFieldWrapper id={field?.id} isOverlay={isOverlay} className={className}>
          {({ style: styles, listeners, attributes, setActivatorNodeRef, setNodeRef, className: wrapperClassName }) => (
            <div
              className={cn('flex flex-col gap-2', wrapperClassName)}
              ref={setNodeRef}
              style={styles}
              id={isOverlay ? `overlay-${field?.id}` : field?.id}
            >
              <FormFieldLabelAndControls
                field={field}
                listeners={listeners}
                attributes={attributes}
                setActivatorNodeRef={setActivatorNodeRef}
                isDragging={isOverlay}
              />
              <FileUploader
                value={files}
                onValueChange={(files) => {
                  setFiles(files);
                  rhFormField?.onChange(files);
                }}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background rounded-lg p-2"
              >
                <FileUploadInput
                  className="outline-dashed outline-2 outline-offset-1"
                  style={{ outlineColor: inputBorderColor, borderColor: inputBorderColor }}
                >
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw style={{ color: primaryColor }} />
                    <p
                      className="mb-1 text-xs md:text-sm mx-auto max-w-[80%] text-center"
                      style={{ color: primaryColor }}
                    >
                      <span className="font-semibold">{field?.placeholder || 'Click to upload or drag and drop'}</span>
                    </p>
                    <p className="text-xs mx-auto text-center max-w-[80%]" style={{ color: primaryColor }}>
                      {Object.values(ACCEPTED_FILE_TYPES_MAP)
                        .flatMap((d) => d?.join(', '))
                        .join(', ')}
                    </p>
                  </div>
                </FileUploadInput>
                <FileUploaderContent>
                  {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" style={{ color: primaryColor }} />
                        <span style={{ color: primaryColor }}>{file?.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
              <EditableHelperText field={field} />
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};

const FileSvgDraw = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <>
      <svg
        className={cn('w-8 h-8 mb-3', className)}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
        style={style}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
    </>
  );
};

export default withResponsiveWidthClasses(FileInput);
