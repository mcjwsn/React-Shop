export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Przekieruj zapytania /api do backendu
    },
  },
};