'use client';

import FormConfigSection from '@/components/common/FormConfigSection';
import { Table2Icon, WebhookIcon } from 'lucide-react';

import SheetsIcon from '../../../../../../public/images/sheets.png';
import AirtableIcon from '../../../../../../public/images/airtable.png';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GoogleSheetIntegrationModal from './google-sheets/GoogleSheetIntegrationModal';
import { useSearchParams } from 'next/navigation';
import AirtableIntegrationModal from './airtable/AirtableIntegrationModal';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import WebhookIntegrationModal from './webhook/WebhookIntegrationModal';

const FormIntegrations = () => {
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isAirtableModalOpen, setIsAirtableModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

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
      case 'webhook':
        setIsWebhookModalOpen(true);
        break;
    }
  }, [integrationSetup]);

  const integrations = [
    {
      name: 'Sheets',
      icon: SheetsIcon,
      iconType: 'image',
      onClick: () => setIsGoogleSheetModalOpen(true),
    },
    {
      name: 'Airtable',
      icon: AirtableIcon,
      iconType: 'image',
      onClick: () => setIsAirtableModalOpen(true),
    },
    {
      name: 'Webhook',
      icon: <WebhookIcon className="w-7 h-7 text-white/90" />,
      iconType: 'component',
      onClick: () => setIsWebhookModalOpen(true),
    },
  ];

  return (
    <FormConfigSection
      icon={<Table2Icon className="w-4 h-4 text-white/90" />}
      title="Form Integrations"
      subtitle="Connect your form to other services."
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6 border-input bg-background px-3 py-5 rounded-md min-w-100">
        {integrations.map((integration) => (
          <Card
            onClick={integration.onClick}
            key={integration.name}
            className="flex flex-col  items-center justify-center text-center gap-2 px-2 py-4 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            {integration.iconType === 'image' && (
              <Image src={integration.icon as StaticImport} alt={integration.name} className="w-8 h-8" />
            )}
            {integration.iconType === 'component' && (integration.icon as React.ReactElement)}
            <span className="text-sm font-medium text-muted-foreground">{integration.name}</span>
          </Card>
        ))}
      </div>

      <GoogleSheetIntegrationModal open={isGoogleSheetModalOpen} onOpenChange={setIsGoogleSheetModalOpen} />
      <AirtableIntegrationModal open={isAirtableModalOpen} onOpenChange={setIsAirtableModalOpen} />
      <WebhookIntegrationModal open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen} />
    </FormConfigSection>
  );
};

export default FormIntegrations;
