import { useEffect, useRef, useCallback } from 'react';

// Cancellable Hook for managing cancellable API requests
export const useCancellableRequest = () => {
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createCancellableRequest = useCallback((apiFunction) => {
    return async (...args) => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const result = await apiFunction(...args, { signal });

        // Only update state if component is still mounted
        if (!isMountedRef.current) {
          return null;
        }

        return result;
      } catch (error) {
        // Ignore abort errors
        if (error.name === 'AbortError') {
          return null;
        }

        // Only throw error if component is still mounted
        if (isMountedRef.current) {
          throw error;
        }

        return null;
      }
    };
  }, []);

  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const isMounted = useCallback(() => {
    return isMountedRef.current;
  }, []);

  return {
    createCancellableRequest,
    cancelPendingRequests,
    isMounted,
  };
};
