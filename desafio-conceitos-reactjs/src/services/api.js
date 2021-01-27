import axios from 'desafio-conceitos-reactjs/node_modules/~/axios';

const api = axios.create({
  baseURL: 'http://localhost:5858',
});

export default api;
