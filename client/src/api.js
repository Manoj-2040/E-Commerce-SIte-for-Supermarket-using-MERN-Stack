import axios from 'axios';

const api = axios.create({
  baseURL: 'https://recommender-algorithm-model.onrender.com/api'
});

export default api;
