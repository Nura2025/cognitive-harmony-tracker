
// API client for Express backend

const API_URL = 'http://localhost:5000/api';

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

// Patient API functions
export const patientAPI = {
  getAll: () => fetchAPI<any[]>('/patients'),
  
  getById: (id: string) => fetchAPI<any>(`/patients/${id}`),
  
  create: (data: any) => fetchAPI<any>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchAPI<any>(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/patients/${id}`, {
    method: 'DELETE',
  }),
};

// Session API functions
export const sessionAPI = {
  getAll: (patientId?: string) => {
    const query = patientId ? `?patient_id=${patientId}` : '';
    return fetchAPI<any[]>(`/sessions${query}`);
  },
  
  getById: (id: string) => fetchAPI<any>(`/sessions/${id}`),
  
  create: (data: any) => fetchAPI<any>('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => fetchAPI<any>(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI<any>(`/sessions/${id}`, {
    method: 'DELETE',
  }),
};
