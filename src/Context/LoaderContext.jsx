import React, { createContext, useContext, useState } from 'react';
import GlobalLoader from '../Components/GlobalLoader';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loaderState, setLoaderState] = useState({
    open: false,
    message: 'Loading...',
    variant: 'gradient',
    loadingCount: 0,
    progress: 0,
    progressMessage: '',
    showProgress: false, // Only true for AI generation
  });

  const showLoader = (message = 'Loading...', variant = 'gradient', options = {}) => {
    setLoaderState(prev => ({
      ...prev,
      open: true,
      message,
      variant,
      loadingCount: prev.loadingCount + 1,
      showProgress: options.showProgress || false,
      progress: options.showProgress ? 0 : prev.progress,
      progressMessage: options.showProgress ? '' : prev.progressMessage,
    }));
  };

  const updateProgress = (progress, progressMessage = '') => {
    setLoaderState(prev => ({
      ...prev,
      progress,
      progressMessage,
    }));
  };

  const hideLoader = () => {
    setLoaderState(prev => {
      const newCount = Math.max(0, prev.loadingCount - 1);
      return {
        ...prev,
        open: newCount > 0,
        loadingCount: newCount,
        // Reset progress when fully hidden
        progress: newCount > 0 ? prev.progress : 0,
        progressMessage: newCount > 0 ? prev.progressMessage : '',
        showProgress: newCount > 0 ? prev.showProgress : false,
      };
    });
  };

  const forceHideLoader = () => {
    setLoaderState(prev => ({
      ...prev,
      open: false,
      loadingCount: 0,
      progress: 0,
      progressMessage: '',
      showProgress: false,
    }));
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, forceHideLoader, updateProgress }}>
      {children}
      <GlobalLoader
        open={loaderState.open}
        message={loaderState.message}
        variant={loaderState.variant}
        progress={loaderState.progress}
        progressMessage={loaderState.progressMessage}
        showProgress={loaderState.showProgress}
      />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error('useLoader must be used within LoaderProvider');
  return context;
};