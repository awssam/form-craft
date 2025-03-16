import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { v7 as uuid } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any) => void,
  duration: number = 200,
) => {
  let timer: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    console.log(timer);
    timer = setTimeout(() => {
      console.log('debounced call');
      func(...args);
    }, duration);
  };
};

export const pickFromObject = <T extends Record<string, unknown>>(obj: T, keys: string[]) => {
  const result: Record<string, unknown> = {};
  keys.forEach((key) => {
    if (obj[key]) result[key] = obj[key];
  });
  return result;
};

export const omitFromObject = <T extends Record<string, unknown>>(obj: T, keys: string[]) => {
  const result: Record<string, unknown> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (!keys.includes(key)) result[key] = value;
  });
  return result;
};

export const camelCaseToReadable = (camelCaseString: string): string => {
  // Use regex to insert spaces before uppercase letters
  const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1').trim();

  const capitalizedString = spacedString.replace(/\b\w/g, (char) => char?.toUpperCase());

  return capitalizedString;
};

export const generateId = () => uuid();

export const copyToClipboard = async (text: string) => navigator.clipboard.writeText(text);

export const getAppOriginUrl = () => {
  if (typeof window === 'undefined')
    return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process?.env?.NEXT_PUBLIC_APP_URL || '';
  return window.location.origin;
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
