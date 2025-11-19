// geo-service/routes/routes.js
import express from 'express';
import GeoController from '../controller/geoController.js';

const router = express.Router();

console.log('🔧 Cargando rutas de GeoService...');

// ========== REGIONES ==========
router.get('/regiones', GeoController.getRegiones);
router.get('/regiones/:id', GeoController.getRegionById);
console.log('✅ Rutas de regiones registradas');

// ========== DEPARTAMENTOS ==========
// ⚠️ IMPORTANTE: Rutas específicas PRIMERO, rutas con :id DESPUÉS
router.get('/departamentos', GeoController.getDepartamentos);
router.get('/departamentos/region/:region_id', GeoController.getDepartamentosByRegion);
router.get('/departamentos/:id', GeoController.getDepartamentoById);
console.log('✅ Rutas de departamentos registradas');

// ========== MUNICIPIOS ==========
// ⚠️ IMPORTANTE: Rutas específicas PRIMERO, rutas con :id DESPUÉS
router.get('/municipios', GeoController.getMunicipios);
router.get('/municipios/departamento/:departamento_id', GeoController.getMunicipiosByDepartamento);
router.get('/municipios/:id', GeoController.getMunicipioById);
console.log('✅ Rutas de municipios registradas');

console.log('🎯 Todas las rutas GeoService cargadas correctamente\n');

export default router;