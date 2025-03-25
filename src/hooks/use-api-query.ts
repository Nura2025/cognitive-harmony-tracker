
import { useState, useEffect, useCallback } from 'react';

type ApiQueryOptions<T> = {
  queryFn: () => Promise<T>;
  enabled?: boolean;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export function useApiQuery<T>({
  queryFn,
  enabled = true,
  dependencies = [],
  onSuccess,
  onError
}: ApiQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await queryFn();
      setData(result);
      setIsLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      console.error(`Error fetching data:`, err);
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      setIsLoading(false);
      
      if (onError) {
        onError(errorObject);
      }
    }
  }, [queryFn, enabled, onSuccess, onError]);

  useEffect(() => {
    let isMounted = true;
    
    const initFetch = async () => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await queryFn();
        
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          
          if (onSuccess) {
            onSuccess(result);
          }
        }
      } catch (err: any) {
        console.error(`Error fetching data:`, err);
        const errorObject = err instanceof Error ? err : new Error(String(err));
        
        if (isMounted) {
          setError(errorObject);
          setIsLoading(false);
          
          if (onError) {
            onError(errorObject);
          }
        }
      }
    };
    
    initFetch();
    
    return () => {
      isMounted = false;
    };
  }, [queryFn, enabled, onSuccess, onError, ...dependencies]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

// For mutations like create, update, delete
type ApiMutationOptions<TVariables, TResult> = {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  onSuccess?: (data: TResult, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
};

export function useApiMutation<TVariables, TResult>({
  mutationFn,
  onSuccess,
  onError
}: ApiMutationOptions<TVariables, TResult>) {
  const [data, setData] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await mutationFn(variables);
      setData(result);
      setIsLoading(false);
      
      if (onSuccess) {
        onSuccess(result, variables);
      }
      
      return result;
    } catch (err: any) {
      console.error(`Mutation error:`, err);
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      setIsLoading(false);
      
      if (onError) {
        onError(errorObject, variables);
      }
      
      throw errorObject;
    }
  };

  return { mutate, data, isLoading, error };
}

