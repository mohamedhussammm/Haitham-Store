const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Add session ID for guest cart
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('sessionId', sessionId);
      }
      config.headers['x-session-id'] = sessionId;
    }

    // Add auth token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, message: data.message || 'Something went wrong', errors: data.errors };
      }

      return data;
    } catch (error) {
      if (error.status) throw error;
      throw { status: 500, message: 'Network error. Please try again.' };
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // For multipart form data (file uploads)
  async upload(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw { status: response.status, message: data.message };
    return data;
  }

  async uploadPut(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw { status: response.status, message: data.message };
    return data;
  }
}

const api = new ApiClient();
export default api;
