import React, { createContext, useContext, useState } from 'react';
import GlobalLoader from '../Components/GlobalLoader';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loaderState, setLoaderState] = useState({
    open: false,
    message: 'Loading...',
    variant: 'gradient',
    loadingCount: 0,
  });

  const showLoader = (message = 'Loading...', variant = 'gradient') => {
    setLoaderState(prev => ({
      ...prev,
      open: true,
      message,
      variant,
      loadingCount: prev.loadingCount + 1,
    }));
  };

  const hideLoader = () => {
    setLoaderState(prev => {
      const newCount = Math.max(0, prev.loadingCount - 1);
      return {
        ...prev,
        open: newCount > 0,
        loadingCount: newCount,
      };
    });
  };

  const forceHideLoader = () => {
    setLoaderState(prev => ({ ...prev, open: false, loadingCount: 0 }));
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, forceHideLoader }}>
      {children}
      <GlobalLoader
        open={loaderState.open}
        message={loaderState.message}
        variant={loaderState.variant}
      />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error('useLoader must be used within LoaderProvider');
  return context;
};
