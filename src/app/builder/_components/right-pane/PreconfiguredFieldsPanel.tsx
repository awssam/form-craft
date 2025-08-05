'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useFormProperty, useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import { FORM_TYPE_CONFIGS } from '@/config/form-types';
import { PreconfiguredField } from '@/types/form-templates';
import { FieldEntity } from '@/types/form-config';
import { generateId } from '@/lib/utils';
import { Plus, Database, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo } from 'react';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';

interface PreconfiguredFieldsPanelProps {
  className?: string;
}

const PreconfiguredFieldsPanel = ({ className }: PreconfiguredFieldsPanelProps) => {
  const formType = useFormProperty('formType');
  const fieldEntities = useFormProperty('fieldEntities');
  const pages = useFormProperty('pages');
  const addFormField = useFormActionProperty('addField');
  const addFieldMapping = useFormActionProperty('addFieldMapping');
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);
  const { FORMSECTIONS, setSection } = useFormSectionDisplay();

  const formTypeConfig = formType ? FORM_TYPE_CONFIGS[formType] : null;
  
  // Memoize preconfigured fields to prevent dependency changes
  const preconfiguredFields = useMemo(() => {
    return formTypeConfig?.preconfiguredFields || [];
  }, [formTypeConfig]);

  // Group fields by category
  const fieldsByCategory = useMemo(() => {
    const groups: Record<string, PreconfiguredField[]> = {};
    preconfiguredFields.forEach(field => {
      if (!groups[field.category]) {
        groups[field.category] = [];
      }
      groups[field.category].push(field);
    });
    return groups;
  }, [preconfiguredFields]);

  // Track which fields are already added
  const addedFieldNames = useMemo(() => {
    return new Set(Object.values(fieldEntities || {}).map(field => field.name));
  }, [fieldEntities]);

  const categoryDisplayNames = {
    basic: 'Basic Information',
    contact: 'Contact Details',
    business: 'Business Information',
    event: 'Event Specific',
    preferences: 'Preferences',
    additional: 'Additional Information'
  };

  const categoryIcons = {
    basic: '👤',
    contact: '📞',
    business: '🏢',
    event: '🎪',
    preferences: '⚙️',
    additional: '📝'
  };

  const convertPreconfiguredToFieldEntity = (preconfiguredField: PreconfiguredField): FieldEntity => {
    return {
      id: generateId(),
      name: preconfiguredField.name,
      type: preconfiguredField.type,
      label: preconfiguredField.label,
      placeholder: preconfiguredField.placeholder,
      helperText: preconfiguredField.helperText,
      validation: preconfiguredField.validation,
      options: preconfiguredField.options,
      width: preconfiguredField.width,
      defaultValue: preconfiguredField.defaultValue,
      conditionalLogic: preconfiguredField.conditionalLogic
    };
  };

  const handleAddField = (preconfiguredField: PreconfiguredField) => {
    const firstPageId = pages?.[0];
    if (!firstPageId) {
      toast.error('No page available to add field');
      return;
    }

    if (addedFieldNames.has(preconfiguredField.name)) {
      toast.warning('Field already added to form');
      return;
    }

    const newField = convertPreconfiguredToFieldEntity(preconfiguredField);
    
    // Add the field to the form
    addFormField(firstPageId, newField);
    
    // Add the field mapping for database integration
    addFieldMapping(newField.id, preconfiguredField.mapping);
    
    // Select the newly added field
    setSelectedField(newField);

    // Switch to Settings section for immediate configuration
    setSection(FORMSECTIONS.Settings);

    toast.success(`Added ${preconfiguredField.label}`, {
      description: 'Field has been added to your form with database mapping configured. Configure it in Settings.',
    });
  };

  const getFieldTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: '📝',
      email: '📧',
      phone: '📱',
      dropdown: '📋',
      radio: '🔘',
      checkbox: '☑️',
      textarea: '📄',
      date: '📅',
      file: '📎'
    };
    return icons[type] || '📝';
  };

  if (!formType || !formTypeConfig) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Preconfigured Fields</h3>
          <p className="text-sm text-muted-foreground">
            Select a form type to see preconfigured fields
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No form type selected</p>
          </div>
        </div>
      </div>
    );
  }

  if (preconfiguredFields.length === 0) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Preconfigured Fields</h3>
          <p className="text-sm text-muted-foreground">
            {formTypeConfig.name} - No preconfigured fields available
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Use the Add Field button to create custom fields</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{formTypeConfig.icon}</span>
          <h3 className="font-semibold">{formTypeConfig.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {formTypeConfig.description}
        </p>
        <Badge variant="secondary" className="text-xs">
          <Database className="w-3 h-3 mr-1" />
          Auto-mapped to {Object.keys(formTypeConfig.fieldMappings).length} database fields
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(fieldsByCategory).map(([category, fields]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                <h4 className="font-medium text-sm">
                  {categoryDisplayNames[category as keyof typeof categoryDisplayNames]}
                </h4>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-2">
                {fields.map((field) => {
                  const isAdded = addedFieldNames.has(field.name);
                  const isRequired = field.required;

                  return (
                    <Card
                      key={field.id}
                      className={`transition-all hover:shadow-md cursor-pointer hover:transform-gpu hover:-translate-y-1 ${
                        isAdded 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800 cursor-not-allowed' 
                          : 'hover:border-primary/20 hover:bg-accent/50'
                      }`}
                      onClick={() => !isAdded && handleAddField(field)}
                      title={isAdded ? 'Field already added' : `Click to add ${field.label} to your form`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{getFieldTypeIcon(field.type)}</span>
                              <h5 className="font-medium text-sm">{field.label}</h5>
                              {isRequired && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Required
                                </Badge>
                              )}
                              {isAdded && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            
                            {field.helperText && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {field.helperText}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{field.mapping.targetTable}.{field.mapping.targetField}</span>
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {field.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="ml-2 flex items-center gap-1">
                            {!isAdded && (
                              <Plus className="w-4 h-4 text-muted-foreground" />
                            )}
                            {isAdded && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/50">
        <div className="text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            Fields are automatically mapped to your database schema
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreconfiguredFieldsPanel;
