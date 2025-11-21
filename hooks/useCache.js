import { useState, useCallback, useRef } from 'react';

// Cache hook for caching API responses with TTL
export const useCache = (ttlMinutes = 5) => {
  const cacheRef = useRef(new Map());
  const timestampRef = useRef(new Map());

  const getCached = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    const timestamp = timestampRef.current.get(key);

    if (!cached || !timestamp) return null;

    // Check if cache is still valid
    const now = Date.now();
    const ttlMs = ttlMinutes * 60 * 1000;

    if (now - timestamp > ttlMs) {
      // Cache expired
      cacheRef.current.delete(key);
      timestampRef.current.delete(key);
      return null;
    }

    return cached;
  }, [ttlMinutes]);

  const setCached = useCallback((key, value) => {
    cacheRef.current.set(key, value);
    timestampRef.current.set(key, Date.now());
  }, []);

  const invalidate = useCallback((key) => {
    if (key) {
      cacheRef.current.delete(key);
      timestampRef.current.delete(key);
    } else {
      // Clear all cache
      cacheRef.current.clear();
      timestampRef.current.clear();
    }
  }, []);

  const invalidateByPattern = useCallback((pattern) => {
    const regex = new RegExp(pattern);
    const keysToDelete = [];

    for (const key of cacheRef.current.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      cacheRef.current.delete(key);
      timestampRef.current.delete(key);
    });
  }, []);

  return {
    getCached,
    setCached,
    invalidate,
    invalidateByPattern,
  };
};

// Hook for caching API calls with automatic request deduplication
export const useCachedApi = (apiFunction, cacheKey, ttlMinutes = 5) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCached, invalidate } = useCache(ttlMinutes);
  const inflightRef = useRef(null);

  const fetch = useCallback(async (...args) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;

    // Check cache first
    const cached = getCached(key);
    if (cached) {
      setData(cached);
      return cached;
    }

    // Check if request is already in flight
    if (inflightRef.current) {
      return inflightRef.current;
    }

    setLoading(true);
    setError(null);

    try {
      const promise = apiFunction(...args);
      inflightRef.current = promise;

      const result = await promise;

      setCached(key, result);
      setData(result);
      setLoading(false);
      inflightRef.current = null;

      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      inflightRef.current = null;
      throw err;
    }
  }, [apiFunction, cacheKey, getCached, setCached]);

  const refetch = useCallback(async (...args) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    invalidate(key);
    return fetch(...args);
  }, [cacheKey, invalidate, fetch]);

  return {
    data,
    loading,
    error,
    fetch,
    refetch,
    invalidate: () => invalidate(),
  };
};
