
// API client for FastAPI backend

const API_URL = 'http://localhost:8000/api';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Generic API function creator for common CRUD operations
function createApiService<T>(basePath: string) {
  return {
    getAll: (queryParams?: Record<string, string>) => {
      const queryString = queryParams 
        ? '?' + new URLSearchParams(queryParams).toString() 
        : '';
      return fetchAPI<T[]>(`${basePath}${queryString}`);
    },
    
    getById: (id: string) => fetchAPI<T>(`${basePath}/${id}`),
    
    create: (data: Partial<T>) => fetchAPI<T>(basePath, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: string, data: Partial<T>) => fetchAPI<T>(`${basePath}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: string) => fetchAPI<void>(`${basePath}/${id}`, {
      method: 'DELETE',
    }),
  };
}

// Patient API functions
export const patientAPI = createApiService<any>('/patients');

// Session API functions
export const sessionAPI = createApiService<any>('/sessions');

// Patient Metrics API functions
export const patientMetricsAPI = createApiService<any>('/patient-metrics');

// Clinical concerns API functions
export const clinicalConcernsAPI = createApiService<any>('/clinical-concerns');

// Activities API functions
export const activitiesAPI = createApiService<any>('/activities');

// Doctor API functions
export const doctorAPI = createApiService<any>('/doctors');

// Authentication integration with Supabase but data from FastAPI
export const authAPI = {
  // This function can be used to fetch the user's data from the FastAPI backend
  // after they authenticate with Supabase
  getUserData: (userId: string) => fetchAPI<any>(`/users/${userId}`),
  
  // This function can be used to register user data with your FastAPI backend
  // after they sign up with Supabase
  registerUser: (userData: any) => fetchAPI<any>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // This function can update user data in your FastAPI backend
  updateUserData: (userId: string, userData: any) => fetchAPI<any>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

