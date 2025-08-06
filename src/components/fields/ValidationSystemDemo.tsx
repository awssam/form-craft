import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useValidationRegistry, 
  useFieldValidations, 
  useValidationStats 
} from './validation/useValidationRegistry';
import { FieldType } from '@/types/form-config';

const ValidationSystemDemo: React.FC = () => {
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>('text');
  
  // Initialize and get validation data
  useValidationRegistry();
  const fieldValidations = useFieldValidations(selectedFieldType);
  const stats = useValidationStats();

  const fieldTypes: FieldType[] = ['text', 'email', 'phone', 'number', 'textarea', 'dropdown', 'radio', 'checkbox', 'date', 'datetime', 'file'];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Phase 4: Validation System Integration</h2>
        <p className="text-muted-foreground">
          Complete validation registry system with field-specific validation rules and components
        </p>
      </div>

      <Tabs defaultValue="field-validations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="field-validations">Field Validations</TabsTrigger>
          <TabsTrigger value="validation-browser">Validation Browser</TabsTrigger>
          <TabsTrigger value="system-stats">System Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="field-validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Type Validations</CardTitle>
              <div className="flex flex-wrap gap-2">
                {fieldTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedFieldType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFieldType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Available Validations for &ldquo;{selectedFieldType}&rdquo; fields:</h4>
                {fieldValidations.length > 0 ? (
                  <div className="grid gap-3">
                    {fieldValidations.map((validation) => (
                      <div 
                        key={validation.key} 
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-medium">{validation.label}</h5>
                          <p className="text-sm text-muted-foreground">{validation.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={validation.category === 'basic' ? 'default' : 
                                        validation.category === 'advanced' ? 'secondary' : 'destructive'}>
                            {validation.category}
                          </Badge>
                          <Badge variant="outline">{validation.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No validations registered for this field type.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation-browser" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Registered Validations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['basic', 'advanced', 'custom'].map((category) => {
                  const categoryValidations = Object.values(fieldValidations).filter(
                    v => v.category === category
                  );
                  
                  if (categoryValidations.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="font-medium mb-2 capitalize">{category} Validations</h4>
                      <div className="grid gap-2">
                        {categoryValidations.map((validation) => (
                          <div 
                            key={validation.key}
                            className="p-2 border rounded flex items-center justify-between"
                          >
                            <span className="font-medium">{validation.label}</span>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {validation.type}
                              </Badge>
                              {validation.conflicts && validation.conflicts.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  conflicts
                                </Badge>
                              )}
                              {validation.dependencies && validation.dependencies.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  depends
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Validations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalValidations}</div>
                <p className="text-sm text-muted-foreground">Registered validation rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.validationsByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Field Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.fieldValidationCounts).map(([fieldType, count]) => (
                    <div key={fieldType} className="flex justify-between">
                      <span>{fieldType}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Validation Registry System</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Field Validation Integration</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Component-based Validation Rules</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Dynamic Validation Assignment</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationSystemDemo;
