import React, { useEffect, useState } from 'react';
import FieldConfigMenu from './field-config-menu/FieldConfigMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { useSelectedFieldStore, useFormProperty } from '@/zustand/store';
import FieldListMenu from './field-list-menu/FieldListMenu';
import PreconfiguredFieldsPanel from './PreconfiguredFieldsPanel';

const RightPane = ({ className }: GenericProps) => {
  const classes = cn('h-full bg-background p-4 pt-0 flex flex-col gap-6 overflow-auto', className);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const formType = useFormProperty('formType');
  const [selected, setSelected] = useState('fields');

  // Show preconfigured tab if form has a specific type
  const showPreconfiguredTab = formType && formType !== 'general';

  useEffect(() => {
    setSelected(selectedField ? 'settings' : 'fields');
  }, [selectedField]);

  return (
    <div className={classes}>
      <Tabs value={selected} className="w-full">
        <TabsList className={`w-full flex justify-between sticky top-1 z-10 backdrop:blur-md ${showPreconfiguredTab ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger 
            value="fields" 
            className={showPreconfiguredTab ? "basis-1/3" : "basis-1/2"} 
            onClick={() => setSelected('fields')}
          >
            Fields
          </TabsTrigger>
          {showPreconfiguredTab && (
            <TabsTrigger 
              value="preconfigured" 
              className="basis-1/3" 
              onClick={() => setSelected('preconfigured')}
            >
              Templates
            </TabsTrigger>
          )}
          <TabsTrigger
            value="settings"
            className={showPreconfiguredTab ? "basis-1/3" : "basis-1/2"}
            disabled={!selectedField}
            onClick={() => setSelected('settings')}
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fields" className="mt-6">
          <FieldListMenu />
        </TabsContent>
        {showPreconfiguredTab && (
          <TabsContent value="preconfigured" className="mt-6 h-full">
            <PreconfiguredFieldsPanel />
          </TabsContent>
        )}
        <TabsContent value="settings" className="mt-6 flex flex-col gap-8">
          <FieldConfigMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPane;
