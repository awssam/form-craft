export const CUSTOM_FIELD_VALIDATIONS = {
    text: {
      exactLength: (exactLength: number, msg: string) => (val: string) => {
        return val?.length === +exactLength || msg;
      },
      startsWith: (startsWith: string, msg: string) => (val: string) => {
        return val?.startsWith(startsWith) || msg;
      },
      endsWith: (endsWith: string, msg: string) => (val: string) => {
        return val?.endsWith(endsWith) || msg;
      },
      minLength: (minLength: number, msg: string) => (val: string) => {
        return val?.length >= +minLength || msg;
      },
      maxLength: (maxLength: number, msg: string) => (val: string) => {
        return val?.length <= +maxLength || msg;
      },
      contains: (substring: string, msg: string) => (val: string) => {
        return val?.includes(substring) || msg;
      },
      matchesRegex: (pattern: RegExp, msg: string) => (val: string) => {
        return pattern.test(val) || msg;
      },
      noWhitespace: (msg: string) => (val: string) => {
        return !/\s/.test(val) || msg;
      },
      isEmail: (msg: string) => (val: string) => {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        return emailRegex.test(val) || msg;
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
      noSpecialCharacters: (msg: string) => (val: string) => {
        return /^[a-zA-Z0-9\s]+$/.test(val) || msg;
      },
    },
  };
  