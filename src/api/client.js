// API client configuration
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    throw new Error('Not implemented');
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }
}

export default new ApiClient(process.env.REACT_APP_API_URL || 'http://localhost:3001');
