import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000 // 30 seconds timeout
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service calls
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data)
};

// Resume Service calls
export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAnalysis: () => API.get('/resume/analysis'),
  viewOwn: () => API.get('/resume/view', { responseType: 'blob' }),
  viewCandidate: (userId) => API.get(`/resume/view/${userId}`, { responseType: 'blob' })
};

// Recruiter Candidate queries
export const candidateAPI = {
  list: (filters) => API.get('/candidates', { params: filters }),
  get: (id) => API.get(`/candidates/${id}`),
  analytics: () => API.get('/candidates/analytics')
};

// Shortlist calls
export const shortlistAPI = {
  toggle: (candidateId) => API.post('/shortlist', { candidateId }),
  list: () => API.get('/shortlist')
};

export default API;
