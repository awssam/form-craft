import React, { useState, useRef, useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UploadIcon, FileIcon, ImageIcon, XIcon, DownloadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * FileField component with drag & drop, previews, and validation
 */
export interface FileFieldProps extends BaseFieldProps {
  /** Whether to allow multiple file uploads */
  allowMultiple?: boolean;
  
  /** Accepted file types (MIME types or extensions) */
  acceptedFileTypes?: string[];
  
  /** Maximum file size in bytes */
  maxFileSize?: number;
  
  /** Maximum number of files */
  maxFiles?: number;
  
  /** Whether to show file previews */
  showPreviews?: boolean;
  
  /** Whether to allow drag and drop */
  allowDragDrop?: boolean;
  
  /** Upload mode: 'immediate' or 'manual' */
  uploadMode?: 'immediate' | 'manual';
  
  /** Custom file validator */
  fileValidator?: (file: File) => boolean | string;
  
  /** Custom file upload handler */
  onFileUpload?: (files: File[]) => Promise<string[]>;
}

interface FileUpload {
  file: File;
  id: string;
  preview?: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  uploadProgress?: number;
}

const FileField: React.FC<FileFieldProps> = ({
  config,
  mode,
  allowMultiple = false,
  acceptedFileTypes = [],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  showPreviews = true,
  allowDragDrop = true,
  uploadMode = 'manual',
  fileValidator,
  onFileUpload,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasRequiredError = isRequired && files.length === 0;
  const hasTooManyFiles = files.length > maxFiles;
  const hasValidationErrors = validationErrors.length > 0;
  const hasError = hasRequiredError || hasTooManyFiles || hasValidationErrors;

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if file type is accepted
  const isFileTypeAccepted = (file: File) => {
    if (acceptedFileTypes.length === 0) return true;
    
    return acceptedFileTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type);
    });
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!isFileTypeAccepted(file)) {
      return `File type not accepted. Allowed: ${acceptedFileTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > maxFileSize) {
      return `File size too large. Maximum: ${formatFileSize(maxFileSize)}`;
    }

    // Custom validation
    if (fileValidator) {
      const result = fileValidator(file);
      if (typeof result === 'string') return result;
      if (result === false) return 'Invalid file';
    }

    return null;
  };

  // Create file preview
  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!showPreviews || !file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  };

  // Process selected files
  const processFiles = async (fileList: FileList) => {
    const newFiles: FileUpload[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check if we've reached the file limit
      if (files.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        break;
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      // Create file upload object
      const preview = await createPreview(file);
      const fileUpload: FileUpload = {
        file,
        id: `file_${Date.now()}_${i}`,
        preview,
        uploadStatus: uploadMode === 'immediate' ? 'uploading' : 'pending',
      };

      newFiles.push(fileUpload);
    }

    // Update state
    setFiles(prev => [...prev, ...newFiles]);
    setValidationErrors(errors);

    // Handle immediate upload
    if (uploadMode === 'immediate' && newFiles.length > 0 && onFileUpload) {
      handleUpload(newFiles.map(f => f.file));
    }

    // Notify parent
    const allFiles = [...files, ...newFiles].map(f => f.file);
    onChange?.(allowMultiple ? allFiles : allFiles[0]);
  };

  // Handle file upload
  const handleUpload = async (filesToUpload: File[]) => {
    if (!onFileUpload) return;

    try {
      await onFileUpload(filesToUpload);
      
      setFiles(prev => prev.map((fileUpload) => {
        if (filesToUpload.includes(fileUpload.file)) {
          return {
            ...fileUpload,
            uploadStatus: 'success',
            uploadProgress: 100,
          };
        }
        return fileUpload;
      }));
    } catch (error) {
      setFiles(prev => prev.map(fileUpload => {
        if (filesToUpload.includes(fileUpload.file)) {
          return {
            ...fileUpload,
            uploadStatus: 'error',
            errorMessage: error instanceof Error ? error.message : 'Upload failed',
          };
        }
        return fileUpload;
      }));
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    
    const remainingFiles = updatedFiles.map(f => f.file);
    onChange?.(allowMultiple ? remainingFiles : remainingFiles[0]);
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      processFiles(fileList);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (mode === 'builder' || !allowDragDrop) return;
    
    const fileList = event.dataTransfer.files;
    if (fileList) {
      processFiles(fileList);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (mode !== 'builder' && allowDragDrop) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    return FileIcon;
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'file' as const,
    allowMultiple,
    acceptedFileTypes,
    maxFileSize,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(maxFiles && {
          maxFiles: {
            value: maxFiles,
            message: `You can upload at most ${maxFiles} file${maxFiles > 1 ? 's' : ''}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, allowMultiple, acceptedFileTypes, maxFileSize, maxFiles]);

  return (
    <BaseField
      config={enhancedConfig}
      mode={mode}
      className={className}
      onChange={onChange}
      onConfigChange={onConfigChange}
      validation={config.validation}
      theme={theme}
      {...props}
    >
      <FieldWrapper
        field={enhancedConfig}
        mode={mode}
        showControls={mode === 'builder'}
        isDraggable={mode === 'builder'}
      >
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-6 transition-all',
              {
                'border-blue-500 bg-blue-50': isDragOver,
                'border-gray-300 hover:border-gray-400': !isDragOver && !hasError,
                'border-red-500 bg-red-50': hasError,
                'opacity-50 pointer-events-none': mode === 'builder',
              }
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mode === 'builder'}
                >
                  Choose Files
                </Button>
              </div>
              
              {allowDragDrop && (
                <p className="mt-2 text-sm text-gray-500">
                  or drag and drop files here
                </p>
              )}
              
              <div className="mt-2 text-xs text-gray-400 space-y-1">
                {acceptedFileTypes.length > 0 && (
                  <div>Accepted: {acceptedFileTypes.join(', ')}</div>
                )}
                <div>Max size: {formatFileSize(maxFileSize)}</div>
                {allowMultiple && (
                  <div>Max files: {maxFiles}</div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <Input
            ref={fileInputRef}
            type="file"
            multiple={allowMultiple}
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Files</h4>
                {uploadMode === 'manual' && onFileUpload && (
                  <Button
                    size="sm"
                    onClick={() => handleUpload(files.map(f => f.file))}
                    disabled={mode === 'builder'}
                  >
                    Upload All
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {files.map((fileUpload) => {
                  const FileIconComponent = getFileIcon(fileUpload.file);
                  
                  return (
                    <div
                      key={fileUpload.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {fileUpload.preview ? (
                          <div 
                            className="w-12 h-12 bg-cover bg-center rounded"
                            style={{ backgroundImage: `url(${fileUpload.preview})` }}
                            title={fileUpload.file.name}
                          />
                        ) : (
                          <FileIconComponent className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {fileUpload.file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(fileUpload.file.size)}
                        </div>
                        
                        {/* Upload Status */}
                        <div className="mt-1">
                          <Badge
                            variant={
                              fileUpload.uploadStatus === 'success' ? 'default' :
                              fileUpload.uploadStatus === 'error' ? 'destructive' :
                              fileUpload.uploadStatus === 'uploading' ? 'secondary' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {fileUpload.uploadStatus}
                          </Badge>
                          
                          {fileUpload.errorMessage && (
                            <div className="text-xs text-red-600 mt-1">
                              {fileUpload.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {fileUpload.uploadStatus === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={mode === 'builder'}
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileUpload.id)}
                          className="h-8 w-8 p-0"
                          disabled={mode === 'builder'}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Messages */}
          <div className="text-xs space-y-1">
            {hasRequiredError && (
              <div className="text-red-600">Please select at least one file</div>
            )}
            
            {hasTooManyFiles && (
              <div className="text-red-600">
                Too many files. Maximum allowed: {maxFiles}
              </div>
            )}
            
            {validationErrors.map((error, index) => (
              <div key={index} className="text-red-600">{error}</div>
            ))}
            
            {files.length > 0 && !hasError && (
              <div className="text-green-600">
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default FileField;
