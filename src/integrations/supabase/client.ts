
// Mock Supabase client to avoid dependency on @supabase/supabase-js
// This file provides a mock implementation for local development

// Create a simple mock for the Supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        order: (column: string, options: any) => Promise.resolve({ data: [], error: null }),
        range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      neq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
      order: (column: string, options: any) => ({
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
      limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      count: Promise.resolve({ data: [{ count: 0 }], error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { ...data, id: 'mock-id' }, error: null })
      }),
      then: (callback: any) => Promise.resolve({ data, error: null }).then(callback)
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data, error: null })
        }),
        then: (callback: any) => Promise.resolve({ data, error: null }).then(callback)
      }),
      match: (criteria: any) => Promise.resolve({ data, error: null }),
      then: (callback: any) => Promise.resolve({ data, error: null }).then(callback)
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      neq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (criteria: any) => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
    })
  }),
  channel: (name: string) => ({
    on: (event: string, filter: any, callback: Function) => ({
      subscribe: () => ({
        unsubscribe: () => {}
      }),
      on: (event: string, filter: any, callback: Function) => ({
        subscribe: () => ({
          unsubscribe: () => {}
        })
      })
    })
  })
};

// Mock function for testing Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  console.log('Mock: Testing Supabase connection');
  return true;
};
