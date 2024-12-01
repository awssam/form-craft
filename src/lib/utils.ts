import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
