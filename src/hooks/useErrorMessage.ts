import { useCallback } from 'react';
import errorMessages from '@/assets/errorMessage.json';

interface ErrorMessages {
  [key: string]: string | ErrorMessages;
}

const useErrorMessage = () => {
  const getErrorMessage = useCallback((path: string): string => {
    const keys = path.split('.');
    let message: string | ErrorMessages | null = errorMessages;
    let title: string | null = null;

    for (let key of keys) {
      if (message && typeof message !== 'string' && key in message) {
        message = message[key] as string | ErrorMessages;
      } else {
        message = "未知错误";
        break;
      }
    }

    if (message && typeof message === 'string') {
      const titlePath = keys.slice(0, -1).concat('title').join('.');
      let titleMessage: string | ErrorMessages | null = errorMessages;
      for (let key of titlePath.split('.')) {
        if (titleMessage && typeof titleMessage !== 'string' && key in titleMessage) {
          titleMessage = titleMessage[key] as string | ErrorMessages;
        } else {
          titleMessage = null;
          break;
        }
      }

      if (titleMessage && typeof titleMessage === 'string') {
        title = titleMessage;
      }

      return title ? `${title}: ${message}` : message;
    }

    return "未知错误";
  }, []);

  return { et: getErrorMessage };
};

export default useErrorMessage;
