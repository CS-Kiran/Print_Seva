import { createContext, useState, useContext, ReactNode } from 'react';
import Alert from '../components/Alert';

interface AlertContextProps {
  showAlert: (type: 'success' | 'info' | 'warning' | 'error', message: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ type: 'success' | 'info' | 'warning' | 'error', message: string } | null>(null);

  const showAlert = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </AlertContext.Provider>
  );
};
