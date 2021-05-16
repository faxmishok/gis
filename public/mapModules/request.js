import axios from 'axios';

const instance = axios.create({
  baseURL: '', // Empty due to same base URL
  timeout: 5000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === undefined) {
      console.log('Axios undefined error');
    }
    return Promise.reject(error.response.data);
  }
);

function fetchAllData() {
  return instance.get('/fetch');
}

export default fetchAllData;
