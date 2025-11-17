// geo-service/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import supabase from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

console.log('🚀 Iniciando GeoService...\n');

// ========== MIDDLEWARES ==========
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// ========== HEALTH CHECKS ==========
app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('regiones')
      .select('count')
      .limit(1);

    if (error) throw error;

    res.json({
      status: 'OK',
      service: 'geoService',
      timestamp: new Date().toISOString(),
      database: 'connected',
      port: PORT
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      service: 'geoService',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'GeoService funcionando',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/regiones',
      'GET /api/regiones/:id',
      'GET /api/departamentos',
      'GET /api/departamentos/region/:region_id',
      'GET /api/departamentos/:id',
      'GET /api/municipios',
      'GET /api/municipios/departamento/:departamento_id',
      'GET /api/municipios/:id'
    ]
  });
});

// ========== RUTAS PRINCIPALES ==========
console.log('📦 Montando rutas en /api...');
app.use('/api', routes);
console.log('✅ Rutas montadas correctamente\n');

// ========== MANEJO DE ERRORES ==========
app.use((req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /api/regiones',
      'GET /api/departamentos/region/:region_id',
      'GET /api/municipios/departamento/:departamento_id'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
  console.log('\n=== GEO-SERVICE INICIADO ===');
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
  console.log(`📍 Regiones: http://localhost:${PORT}/api/regiones`);
  console.log(`📍 Departamentos por región: http://localhost:${PORT}/api/departamentos/region/:region_id`);
  console.log(`📍 Municipios por depto: http://localhost:${PORT}/api/municipios/departamento/:departamento_id\n`);
});