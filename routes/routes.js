// geo-service/routes/routes.js
import express from 'express';
import GeoController from '../controllers/geoController.js';

const router = express.Router();

router.get('/regiones', GeoController.getRegiones);
router.get('/departamentos', GeoController.getDepartamentos);
router.get('/municipios', GeoController.getMunicipios);

export default router;