// Configuración de los microservicios - VERSIÓN CORREGIDA
const services = {
  usuarios: {
    target: 'http://localhost:3001',
    endpoints: ['/api/auth', '/api/usuarios']
  },
  brigadas: {
    target: 'http://localhost:3002', 
    endpoints: ['/api/brigadistas', '/api/brigadas']
  },
  conglomerados: {
    target: 'http://localhost:3003',
    endpoints: ['/api/conglomerados', '/api/weather']
  }
};

module.exports = services;