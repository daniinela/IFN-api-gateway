// config/services.js
const services = {
  usuarios: {
    target: 'https://ifn-usuarios-service.onrender.com',
    endpoints: ['/api/auth', '/api/usuarios']
  },
  brigadas: {
    target: 'https://ifn-brigadas-service.onrender.com',
    endpoints: ['/api/brigadistas', '/api/brigadas']
  },
  conglomerados: {
    target: 'https://ifn-conglomerados-service.onrender.com',
    endpoints: ['/api/conglomerados', '/api/weather']
  }
};

export default services;
