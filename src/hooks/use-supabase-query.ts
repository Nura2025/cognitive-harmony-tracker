
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

type SupabaseQueryOptions<T> = {
  table: string;
  columns?: string;
  filter?: (query: PostgrestFilterBuilder<any, any, any>) => PostgrestFilterBuilder<any, any, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  singleRow?: boolean;
  enabled?: boolean;
  dependencies?: any[];
};

export function useSupabaseQuery<T>({
  table,
  columns = '*',
  filter,
  orderBy,
  limit,
  singleRow = false,
  enabled = true,
  dependencies = []
}: SupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!enabled) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from(table)
          .select(columns);
        
        // Apply filter if provided
        if (filter) {
          query = filter(query);
        }
        
        // Apply ordering if provided
        if (orderBy) {
          query = query.order(orderBy.column, { 
            ascending: orderBy.ascending !== false 
          });
        }
        
        // Apply limit if provided
        if (limit) {
          query = query.limit(limit);
        }
        
        // Get single row or all results
        const { data: result, error: supabaseError } = singleRow 
          ? await query.single() 
          : await query;
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        setData(result as T);
      } catch (err: any) {
        console.error(`Error fetching data from ${table}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [table, columns, singleRow, enabled, ...dependencies]);

  return { data, isLoading, error };
}
