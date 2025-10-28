import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import dotenv from 'dotenv';
import services from './config/services.js';
import {
  getBrigadistaConNombre,
  getBrigadistasConNombres,
  getBrigadistasDeBrigadaConNombres
} from './orquestadores/brigadasorquestador.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);


// Middleware de proxy manual
app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api/')) return next();
  
  try {
    const path = req.path;
    let targetService = '';
    let targetUrl = '';

    if (path.startsWith('/api/auth') || path.startsWith('/api/usuarios')) {
      targetService = services.usuarios;
    } else if (path.startsWith('/api/brigadistas') || path.startsWith('/api/brigadas')) {
      targetService = services.brigadas;
    } else if (path.startsWith('/api/conglomerados') || path.startsWith('/api/weather')) {
      targetService = services.conglomerados;
    } else {
      return res.status(404).json({ 
        error: 'Ruta no encontrada en el gateway',
        availableRoutes: [
          '/api/auth/*', '/api/usuarios/*', 
          '/api/brigadistas/*', '/api/brigadas/*',
          '/api/conglomerados/*', '/api/weather/*'
        ]
      });
    }

    targetUrl = `${targetService}${path}`;
    console.log(`📡 Proxy: ${req.method} ${path} -> ${targetUrl}`);

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: new URL(targetService).host },
      data: req.body,
      validateStatus: null
    });
    
    res.status(response.status).set(response.headers).send(response.data);

  } catch (error) {
    console.error('❌ Error en gateway:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Servicio no disponible' });
    }
    res.status(500).json({ error: 'Error interno del gateway', message: error.message });
  }
});

// Ruta de salud del gateway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Gateway funcionando',
    timestamp: new Date().toISOString(),
    services: Object.keys(services).length
  });
});

//Usar /health normal
app.get('/api/services/status', async (req, res) => {
  const status = {};
  const checks = [];
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const startTime = Date.now();
      // ✅ CAMBIADO: Usar /health normal
      const response = await axios.get(`${url}/health`, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      status[name] = { 
        status: 'online', 
        data: response.data,
        response_time: `${responseTime}ms`
      };
      checks.push(`${name} ✅`);
    } catch (error) {
      status[name] = { status: 'offline', error: error.message };
      checks.push(`${name} ❌`);
    }
  }
  
  const onlineCount = Object.values(status).filter(s => s.status === 'online').length;
  
  res.json({
    summary: {
      total_services: Object.keys(status).length,
      online_services: onlineCount,
      offline_services: Object.keys(status).length - onlineCount,
      status: onlineCount === Object.keys(status).length ? 'healthy' : 'degraded'
    },
    services: status,
    checks: checks,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Gateway - Sistema de Brigadas Agroambientales',
    version: '1.0.0',
    services: Object.keys(services)
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`API Gateway iniciado en puerto ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Services Status: http://localhost:${PORT}/api/services/status`);
  console.log(`Servicios configurados:`, Object.keys(services));
  console.log(`=================================`);
});