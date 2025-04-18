'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-upload';
import { ACCEPTED_FILE_TYPES_MAP } from '@/lib/form';
import { ExternalLink, Loader2, Paperclip } from 'lucide-react';
import { useStorageContext } from '../FormBlobStorage';
import { useFormContext } from 'react-hook-form';

const uploadToCloudinary = async (files: File[]) => {
  const formData = new FormData();
  formData.append('file', files[0]);

  const res = await fetch('/api/form/cloudinary', {
    method: 'POST',
    body: formData,
  });

  const cloudinaryResponse = await res.json();

  return cloudinaryResponse?.data;
};

/**
  Idea is to have a tracker of the files that have been uploaded to cloudinary.
  When a file is uploaded, we add it to the tracker, and when a file is removed, we remove it from the tracker.
  On Change we only upload the files that are not in the tracker.

  Unique identifier for each file is the name
 */

const FormFileUploadField = ({ field, className, formConfig, control, actionDisabler }: FieldProps) => {
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};

  const {
    allFiles,
    updateFiles,
    uploadedFileIds: uploadTrackerRef,
    cloudinaryFiles: cloudinaryFileMapByFieldId,
    updateCloudinaryFiles,
  } = useStorageContext();

  const files = useMemo(() => allFiles?.[field?.id] ?? [], [allFiles, field?.id]);
  const cloudinaryFiles = useMemo(
    () => cloudinaryFileMapByFieldId?.[field?.id] ?? {},
    [cloudinaryFileMapByFieldId, field?.id],
  );

  const setFiles = updateFiles.bind(null, field?.id);
  const setCloudinaryFiles = updateCloudinaryFiles.bind(null, field?.id);

  const setValue = useFormContext().setValue;

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setValue(field?.name, Object.values(cloudinaryFiles));
  }, [field?.name, field?.id, cloudinaryFiles, setValue]);

  const dropZoneConfig = useMemo(
    () => ({
      maxFiles: +field?.validation?.custom?.maxFiles?.value || (field?.allowMultiSelect ? 30 : 1),
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

  const handleFileChange = async (selectedFiles: File[] | null) => {
    if (!selectedFiles) return;

    try {
      setIsUploading(true);
      actionDisabler?.(true);

      // Get files that are new (not previously uploaded)
      const filesToUpload = selectedFiles.filter((file) => !uploadTrackerRef.current.has(file.name));

      // Upload only the new files
      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (file) => {
          const res = await uploadToCloudinary([file]);
          uploadTrackerRef.current.add(file.name);
          return {
            name: file.name,
            url: res?.secure_url,
            type: file.type,
            size: file.size,
          };
        }),
      );

      // Create an updated cloudinary map without losing previous uploads
      const updatedCloudinaryMap = {} as typeof cloudinaryFiles;

      // Retain previously uploaded files, only updating the new ones
      selectedFiles.forEach((file) => {
        if (uploadTrackerRef.current.has(file.name)) {
          updatedCloudinaryMap[file.name] =
            cloudinaryFiles[file.name] || uploadedFiles.find((f) => f.name === file.name);
        }
      });

      uploadTrackerRef.current = new Set();

      for (const file of selectedFiles) {
        uploadTrackerRef.current.add(file.name);
      }

      // Update state
      setFiles(selectedFiles);
      setCloudinaryFiles(updatedCloudinaryMap);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      actionDisabler?.(false);
    }
  };

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation as ComponentProps<typeof FormField>['rules']}
      render={() => (
        <FormItem className={cn('flex flex-col gap-4 space-y-0', className, 'hover:bg-transparent')}>
          <Label
            htmlFor={field?.id}
            className="flex gap-3 font-semibold md:text-[12px] text-sm"
            style={{ color: primaryTextColor }}
          >
            <span className="relative">
              {field.label}
              {field?.validation?.custom?.required?.value && (
                <sup className="inline top-[-0.2em] right-[-8px] absolute ml-[1px] font-bold text-red-500 text-sm">
                  *
                </sup>
              )}
            </span>
          </Label>
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={(files) => handleFileChange(files)}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background p-2 rounded-lg"
            >
              <FileInput
                className="outline-2 outline-dashed outline-offset-1"
                style={{ outlineColor: inputBorderColor, borderColor: inputBorderColor }}
              >
                <div className="flex flex-col justify-center items-center gap-1 pt-3 pb-4 w-full">
                  {isUploading ? (
                    <Loader2 className="ml-2 w-8 h-8 animate-spin" />
                  ) : (
                    <FileSvgDraw style={{ color: primaryTextColor }} />
                  )}
                  <p
                    className="mx-auto mb-1 max-w-[80%] text-xs md:text-sm text-center"
                    style={{ color: primaryTextColor }}
                  >
                    <span className="font-semibold">
                      {isUploading ? `Uploading files...` : field?.placeholder || 'Click to upload or drag and drop'}
                    </span>
                  </p>
                  {!isUploading && (
                    <p className="mx-auto max-w-[80%] text-xs text-center" style={{ color: primaryTextColor }}>
                      {Object.values(ACCEPTED_FILE_TYPES_MAP)
                        .flatMap((d) => d?.join(', '))
                        .join(', ')}
                    </p>
                  )}
                </div>
              </FileInput>
              <div className="flex items-center gap-3 my-5">
                <FormMessage style={{ color: secondaryTextColor }} className="flex-1">
                  {field?.helperText}
                </FormMessage>
                <span style={{ color: secondaryTextColor }} className="ml-auto font-semibold text-[10px]">
                  Max size per file: {field?.validation?.custom?.maxFileSize?.value || 4} MB
                </span>
              </div>
              <FileUploaderContent>
                {files &&
                  files?.map((file: unknown, i) => (
                    <FileUploaderItem key={i} index={i} className="">
                      <Paperclip className="stroke-current w-4 h-4" style={{ color: primaryTextColor }} />
                      <a
                        /* @ts-expect-error: error property doesn't exist */
                        href={cloudinaryFiles[file?.name]?.url || file?.url}
                        target="_blank"
                        style={{ color: primaryTextColor }}
                        className="flex items-center gap-1 max-w-[85%] overflow-hidden text-ellipsis"
                      >
                        {/* @ts-expect-error: error property doesn't exist */}
                        {file?.name || file?.url} {file?.url && <ExternalLink className="w-4 h-4" />}
                      </a>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormFileUploadField);

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
