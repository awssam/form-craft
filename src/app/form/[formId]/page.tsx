import { getFormConfigWithIdAction } from '@/backend/actions/form';
import { FormConfig } from '@/types/form-config';
import React from 'react';
import Form from './_components/Form';
// import FormFooter from './_components/FormFooter';

// Theme-specific gradient configurations
const themeGradients = {
  'midnight-black': {
    backgroundGradient: 'from-black via-zinc-950 to-zinc-900',
    accentGlow1: 'bg-zinc-800/20',
    accentGlow2: 'bg-zinc-700/10',
    gridOpacity: '0.70',
  },
  'deep-space': {
    backgroundGradient: 'from-black via-[#090916] to-[#0b0b18]',
    accentGlow1: 'bg-blue-900/10',
    accentGlow2: 'bg-indigo-900/10',
    gridOpacity: '0.5',
  },
  'charcoal-black': {
    backgroundGradient: 'from-black via-[#0b0808] to-[#211717]',
    accentGlow1: 'bg-zinc-800/15',
    accentGlow2: 'bg-zinc-700/10',
    gridOpacity: '0.7',
  },
  'deep-violet': {
    backgroundGradient: 'from-black via-[#0a0214] to-[#1A0631]',
    accentGlow1: 'bg-purple-900/15',
    accentGlow2: 'bg-violet-900/10',
    gridOpacity: '0.4',
  },
  'night-sky': {
    backgroundGradient: 'from-[#050c23] via-[#02000a] to-[#131026]',
    accentGlow1: 'bg-indigo-900/15',
    accentGlow2: 'bg-blue-900/10',
    gridOpacity: '0.4',
  },
};

const defaultGradient = {
  backgroundGradient: 'from-black to-zinc-950',
  accentGlow1: 'bg-zinc-800/10',
  accentGlow2: 'bg-zinc-700/10',
  gridOpacity: '0.9',
};

const FormPage = async ({ params }: { params: { formId: string } }) => {
  const res = await getFormConfigWithIdAction(params.formId).then((res) => res?.data);
  const formConfig: FormConfig = res || ({} as FormConfig);

  const themeName = formConfig?.theme.id || 'midnight-black';

  const gradientConfig = themeGradients[themeName] || defaultGradient;

  return (
    <main
      className={`w-full h-full overflow-x-hidden min-h-screen relative bg-gradient-to-b ${gradientConfig.backgroundGradient} flex flex-col px-2 sm:px-4 py-8`}
    >
      <div
        className={`absolute top-20 -right-40 w-96 h-96 ${gradientConfig.accentGlow1} rounded-full filter blur-[100px]`}
      ></div>
      <div
        className={`absolute bottom-20 -left-40 w-96 h-96 ${gradientConfig.accentGlow2} rounded-full filter blur-[100px]`}
      ></div>

      {(themeName === 'deep-violet' || themeName === 'night-sky') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-900/5 to-blue-900/5 rounded-full filter blur-[120px]"></div>
      )}

      <div
        className="absolute z-[1] inset-0 bg-[url('/grid.svg')] bg-center"
        style={{ opacity: gradientConfig.gridOpacity }}
      ></div>

      <Form formConfig={formConfig} />

      <div className="mt-8 flex items-center justify-center opacity-30 hover:opacity-70 transition-opacity -ml-2">
        <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 mr-2"></div>
        <span className="text-sm font-medium text-zinc-200">Powered by FormCraft</span>
      </div>
    </main>
  );
};

export default FormPage;
