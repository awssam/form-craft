export type Option = {
  value: string | number | boolean;
  label: string;
};

export interface FormIntegration<T = Record<string, unknown>> {
  formId: string;
  userId: string;
  connectedAccountId: string;
  provider: string;
  fieldMappings: Record<string, string>;
  config: T;
}

export interface GoogleSheetIntegrationConfig {
  spreadsheet: Option | null;
  worksheet: Option | null;
  worksheetColumnHeaders: string[];
}

export interface GoogleSheetIntegration extends FormIntegration<GoogleSheetIntegrationConfig> {
  provider: 'google';
  config: GoogleSheetIntegrationConfig;
}
