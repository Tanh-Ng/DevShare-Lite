// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};
