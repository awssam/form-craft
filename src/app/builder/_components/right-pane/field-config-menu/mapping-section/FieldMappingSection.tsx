'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import FormConfigSection from '@/components/common/FormConfigSection';
import { EnhancedFieldMapping } from '@/types/form-templates';
import { useFormProperty, useSelectedFieldStore } from '@/zustand/store';
import { Database, MapPin } from 'lucide-react';

const FieldMappingSection = () => {
  const formType = useFormProperty('formType');
  const fieldMappingsRaw = useFormProperty('fieldMappings');
  const selectedFieldData = useSelectedFieldStore((s) => s.selectedField);


  // Memoize fieldMappings to prevent dependency issues
  const fieldMappings = useMemo(() => {
    return fieldMappingsRaw || {};
  }, [fieldMappingsRaw]);

  // Get current field mapping
  const currentMapping = selectedFieldData ? fieldMappings[selectedFieldData.id] : null;

  // Get field type icon
  const getFieldTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: '📝', email: '📧', phone: '📱', number: '🔢',
      dropdown: '📋', radio: '🔘', checkbox: '☑️',
      textarea: '📄', date: '📅', datetime: '🗓️', file: '📎', 
      boolean: '✓', string: '📝', json: '🔗'
    };
    return icons[type] || '📝';
  };

  


  // Don't show if no form type or no selected field
  if (!formType || !selectedFieldData) {
    return null;
  }

  const isEnhancedMapping = currentMapping && 'databaseFieldType' in currentMapping;

  return (
    <FormConfigSection
      icon={<Database className="w-4 h-4" />}
      title="Database Mapping"
      subtitle="Map this field to a database table and column"
    >
      {/* Current Mapping Display */}
      {currentMapping && (
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm">Current Mapping</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span>{getFieldTypeIcon(selectedFieldData.type)}</span>
              <span className="font-medium">{selectedFieldData.label}</span>
              <Badge variant="outline">{selectedFieldData.type}</Badge>
              <span className="text-muted-foreground">→</span>
              <span className="font-mono text-sm">
                {currentMapping.targetTable}.{currentMapping.targetField}
              </span>
              {isEnhancedMapping && (
                <Badge variant="secondary">{(currentMapping as EnhancedFieldMapping).databaseFieldType}</Badge>
              )}
            </div>
            {isEnhancedMapping && (currentMapping as EnhancedFieldMapping).description && (
              <p className="text-xs text-muted-foreground">{(currentMapping as EnhancedFieldMapping).description}</p>
            )}
            <div className="flex items-center gap-2">
              {currentMapping.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
              {isEnhancedMapping && (currentMapping as EnhancedFieldMapping).isCustomMapping && (
                <Badge variant="outline" className="text-xs">Custom</Badge>
              )}
            </div>
          </div>
        </div>
      )}


    </FormConfigSection>
  );
};

export default FieldMappingSection;
