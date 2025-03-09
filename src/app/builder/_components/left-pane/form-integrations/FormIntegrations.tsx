'use client';

import FormConfigSection from '@/components/common/FormConfigSection';
import { Table2Icon } from 'lucide-react';

import SheetsIcon from '../../../../../../public/images/sheets.png';
import AirtableIcon from '../../../../../../public/images/airtable.png';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GoogleSheetIntegrationModal from './google-sheets/GoogleSheetIntegrationModal';
import { useSearchParams } from 'next/navigation';
import AirtableIntegrationModal from './airtable/AirtableIntegrationModal';

const FormIntegrations = () => {
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isAirtableModalOpen, setIsAirtableModalOpen] = useState(false);

  const params = useSearchParams();

  const integrationSetup = params.get('integration');

  useEffect(() => {
    switch (integrationSetup) {
      case 'google':
        setIsGoogleSheetModalOpen(true);
        break;
      case 'airtable':
        setIsAirtableModalOpen(true);
        break;
    }
  }, [integrationSetup]);

  const integrations = [
    {
      name: 'Google Sheets',
      icon: SheetsIcon,
      onClick: () => setIsGoogleSheetModalOpen(true),
    },
    {
      name: 'Airtable',
      icon: AirtableIcon,
      onClick: () => setIsAirtableModalOpen(true),
    },
  ];

  return (
    <FormConfigSection
      icon={<Table2Icon className="w-4 h-4 text-white/90" />}
      title="Form Integrations"
      subtitle="Connect your form to other services."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-6 border-input bg-background px-3 py-5 rounded-md min-w-100">
        {integrations.map((integration) => (
          <Card
            onClick={integration.onClick}
            key={integration.name}
            className="flex flex-col items-center justify-center text-center gap-2 px-2 py-4 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <Image src={integration.icon as unknown as string} alt={integration.name} className="w-8 h-8" />
            <span className="text-sm font-medium text-muted-foreground">{integration.name}</span>
          </Card>
        ))}
      </div>

      <GoogleSheetIntegrationModal open={isGoogleSheetModalOpen} onOpenChange={setIsGoogleSheetModalOpen} />
      <AirtableIntegrationModal open={isAirtableModalOpen} onOpenChange={setIsAirtableModalOpen} />
    </FormConfigSection>
  );
};

export default FormIntegrations;
