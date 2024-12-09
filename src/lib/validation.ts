import { isAfter, isBefore, isToday } from '@/lib/datetime';
import { FieldEntity } from '@/types/form-config';
import { omitFromObject, pickFromObject } from './utils';

export const CUSTOM_FIELD_VALIDATIONS = {
  text: {
    withValue: {
      equals: (equals: string, msg?: string) => (val: string) => {
        return val?.toLowerCase() === equals?.toLowerCase() || msg;
      },
      exactLength: (exactLength: number, msg?: string) => (val: string) => {
        return val?.length === +exactLength || msg;
      },
      startsWith: (startsWith: string, msg?: string) => (val: string) => {
        return val?.startsWith(startsWith) || msg;
      },
      endsWith: (endsWith: string, msg?: string) => (val: string) => {
        return val?.endsWith(endsWith) || msg;
      },
      minLength: (minLength: number, msg?: string) => (val: string) => {
        return val?.length >= +minLength || msg;
      },
      maxLength: (maxLength: number, msg?: string) => (val: string) => {
        return val?.length <= +maxLength || msg;
      },
      contains: (substring: string, msg?: string) => (val: string) => {
        return val?.includes(substring) || msg;
      },
      matchesRegex: (pattern: RegExp, msg?: string) => (val: string) => {
        return pattern?.test(val) || msg;
      },
    },
    binary: {
      required: (msg: string) => (val: string) => {
        return (!!val && val?.trim()?.length > 0) || msg;
      },
      noWhitespace: (msg: string) => (val: string) => {
        return !/\s/.test(val) || msg;
      },
      isEmail: (msg: string) => (val: string) => {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        return emailRegex?.test(val) || msg;
      },
      isURL: (msg: string) => (val: string) => {
        try {
          new URL(val);
          return true;
        } catch {
          return msg;
        }
      },
      isNumeric: (msg: string) => (val: string) => {
        return /^[0-9]+$/.test(val) || msg;
      },
      isAlpha: (msg: string) => (val: string) => {
        return /^[a-zA-Z]+$/.test(val) || msg;
      },
      isAlphanumeric: (msg: string) => (val: string) => {
        return /^[a-zA-Z0-9]+$/.test(val) || msg;
      },

      isValidPhoneNumber: (msg: string) => (val: string) => {
        // const phoneRegex = /^(?:\+?\d{1,3}[- ]?)?(?:\(?\d{1,4}?\)?[- ]?)?\d{1,4}[- ]?\d{1,4}[- ]?\d{1,9}$/;
        const regex2 = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
        return regex2.test(val) || msg;
      },

      noSpecialCharacters: (msg: string) => (val: string) => {
        return /^[a-zA-Z0-9\s]+$/.test(val) || msg;
      },
    },
  },

  date: {
    withValue: {
      isBefore: (compareDate: string, msg?: string) => (val: string) => {
        const date = new Date(val);
        const comparisonDate = new Date(compareDate);
        return isBefore(date, comparisonDate) || msg;
      },
      isAfter: (compareDate: string, msg?: string) => (val: string) => {
        const date = new Date(val);
        const comparisonDate = new Date(compareDate);

        return isAfter(date, comparisonDate) || msg;
      },
      matchesFormat: (format: string, msg?: string) => (val: string) => {
        // Example format check for 'YYYY-MM-DD'
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Adjust regex as needed for different formats
        return regex.test(val) || msg;
      },
    },
    binary: {
      isValidDate: (msg: string) => (val: string) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) || msg;
      },
      restrictFutureDate: (msg: string) => (val: string) => {
        const date = new Date(val);
        const today = new Date();

        if (isToday(val) || isBefore(date, today)) return true;

        return msg;
      },
      restrictPastDate: (msg: string) => (val: string) => {
        const date = new Date(val);
        const today = new Date();

        if (isToday(val)) return true;

        if (isBefore(date, today)) return msg;

        return true;
      },
      required: (msg: string) => (val: string) => {
        return !!val || msg;
      },
    },
  },

  radio: {
    withValue: {
      equals: (equals: string, msg?: string) => (val: string) => {
        return val?.toLowerCase() === equals?.toLowerCase() || msg;
      },
    },
    binary: {
      required: (msg: string) => (val: string) => {
        return !!val || msg;
      },
    },
  },

  checkbox: {
    withValue: {
      minCount: (minCount: number, msg?: string, selectedField?: FieldEntity | null) => (val: string[]) => {
        if (selectedField && +minCount > (selectedField?.options?.length || 0))
          minCount = selectedField?.options?.length || 0;
        return val?.length >= +minCount || msg;
      },
      maxCount: (maxCount: number, msg?: string, selectedField?: FieldEntity | null) => (val: string[]) => {
        if (selectedField && (+maxCount < 1 || +maxCount > (selectedField?.options?.length || 0)))
          maxCount = selectedField?.options?.length || 0;
        return val?.length <= +maxCount || msg;
      },
      contains: (substringArray: string[] | string, msg?: string) => (val: string[]) => {
        if (!Array.isArray(substringArray)) substringArray = [substringArray];

        const hasSubstring = substringArray?.every((s) => !!val?.find((v) => v?.toLowerCase() === s?.toLowerCase()));
        return hasSubstring || msg;
      },
    },
    binary: {
      required: (msg: string) => (val: string | string[]) => {
        return val?.length > 0 || msg;
      },
    },
  },

  dropdown: {
    withValue: {
      minCount: (minCount: number, msg?: string, selectedField?: FieldEntity | null) => (val: string[]) => {
        if (selectedField && +minCount > (selectedField?.options?.length || 0))
          minCount = selectedField?.options?.length || 0;
        return val?.length >= +minCount || msg;
      },
      maxCount: (maxCount: number, msg?: string, selectedField?: FieldEntity | null) => (val: string[]) => {
        if (selectedField && (+maxCount < 1 || +maxCount > (selectedField?.options?.length || 0)))
          maxCount = selectedField?.options?.length || 0;
        return val?.length <= +maxCount || msg;
      },
      contains: (substringArray: string[] | string, msg?: string) => (val: string[]) => {
        if (!Array.isArray(substringArray)) substringArray = [substringArray];
        const hasSubstring = substringArray?.every((s) => !!val?.find((v) => v?.toLowerCase() === s?.toLowerCase()));
        return hasSubstring || msg;
      },
    },
    binary: {
      required: (msg: string) => (val: string | string[]) => {
        return val?.length > 0 || msg;
      },
    },
  },
};

export const CONDITIONAL_LOGIC_VALIDATIONS = {
  ...CUSTOM_FIELD_VALIDATIONS,
  date: {
    binary: pickFromObject(CUSTOM_FIELD_VALIDATIONS.date.binary, ['required']),
    withValue: omitFromObject(CUSTOM_FIELD_VALIDATIONS.date.withValue, ['matchesFormat']),
  },
};
