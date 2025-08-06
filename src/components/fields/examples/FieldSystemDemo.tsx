import React, { useState } from 'react';
import { 
  FieldRenderer, 
  useAvailableFieldTypes, 
  useFieldsByCategory, 
  useSearchFields, 
  useRegistryStats,
  useRegistryReady,
  FieldRegistry
} from '../index';
import { FieldEntity, FieldType } from '@/types/form-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 *  demo component showcasing the complete field registry system
 */
const FieldSystemDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [renderFieldType, setRenderFieldType] = useState<string>('text');

  // Use registry hooks
  const isRegistryReady = useRegistryReady();
  const availableTypes = useAvailableFieldTypes();
  const categoryFields = useFieldsByCategory(selectedCategory);
  const { results: searchResults, isSearching } = useSearchFields(searchQuery);
  const registryStats = useRegistryStats();

  // Sample field configuration for demonstration
  const sampleFieldConfig: FieldEntity = {
    id: 'demo-field',
    type: renderFieldType as FieldEntity['type'],
    label: 'Demo Field',
    name: 'demoField',
    placeholder: 'This is a demo field...',
    helperText: 'This field demonstrates the registry system',
    width: '100%',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ],
  };

  const categories = ['basic', 'contact', 'selection', 'datetime', 'media'];

  if (!isRegistryReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-medium">Loading Field Registry...</div>
          <div className="text-sm text-gray-500">Initializing field components</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Enhanced Field Registry System</h1>
        <p className="text-gray-600 mb-4">
          Comprehensive demonstration of the component-based field architecture
        </p>
        
        {/* Registry Statistics */}
        <div className="flex justify-center space-x-4 mb-6">
          <Badge variant="secondary">
            {registryStats.totalFields} Total Fields
          </Badge>
          <Badge variant="secondary">
            {registryStats.totalCategories} Categories
          </Badge>
          <Badge variant="secondary">
            {registryStats.lazyFields} Lazy Fields
          </Badge>
          <Badge variant="secondary">
            {registryStats.eagerFields} Eager Fields
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demo">Field Demo</TabsTrigger>
          <TabsTrigger value="registry">Registry Browser</TabsTrigger>
          <TabsTrigger value="search">Search Fields</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Field Demo Tab */}
        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Field Renderer</CardTitle>
              <CardDescription>
                Test the field renderer with different field types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Select Field Type:
                  </label>
                  <select
                    value={renderFieldType}
                    onChange={(e) => setRenderFieldType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {availableTypes.map(type => (
                      <option key={type} value={type}>
                        {FieldRegistry.getFieldDisplayName(type)} ({type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Field Information:
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <div><strong>Type:</strong> {renderFieldType}</div>
                    <div><strong>Name:</strong> {FieldRegistry.getFieldDisplayName(renderFieldType as FieldType)}</div>
                    <div><strong>Description:</strong> {FieldRegistry.getFieldDescription(renderFieldType as FieldType)}</div>
                  </div>
                </div>
              </div>

              {/* Live Field Rendering */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Rendered Field:</h3>
                <div className="bg-white p-4 rounded-md border">
                  <FieldRenderer
                    fieldConfig={sampleFieldConfig}
                    mode="runtime"
                    onChange={(value) => console.log('Field value changed:', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registry Browser Tab */}
        <TabsContent value="registry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registry Browser</CardTitle>
              <CardDescription>
                Browse fields by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Selector */}
              <div className="flex space-x-2 mb-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({registryStats.fieldsByCategory[category] || 0})
                  </Button>
                ))}
              </div>

              {/* Fields in Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFields.map(field => (
                  <div
                    key={field.type}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {field.icon}
                      <span className="font-medium">{field.displayName}</span>
                      {field.isLazy && (
                        <Badge variant="outline" className="text-xs">Lazy</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{field.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {field.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Search</CardTitle>
              <CardDescription>
                Search for field types by name, description, or tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {searchQuery && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  
                  {searchResults.map(field => (
                    <div
                      key={field.type}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {field.icon}
                        <span className="font-medium">{field.displayName}</span>
                        <Badge variant="outline">{field.category}</Badge>
                        {field.isLazy && (
                          <Badge variant="outline" className="text-xs">Lazy</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{field.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {field.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registry Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Fields:</span>
                    <Badge>{registryStats.totalFields}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <Badge>{registryStats.totalCategories}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Lazy Fields:</span>
                    <Badge variant="outline">{registryStats.lazyFields}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Eager Fields:</span>
                    <Badge variant="outline">{registryStats.eagerFields}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fields by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(registryStats.fieldsByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}:</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {availableTypes.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldSystemDemo;
