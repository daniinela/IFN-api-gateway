// geo-service/controllers/geoController.js
import RegionesModel from '../models/regionesModel.js';
import DepartamentosModel from '../models/departamentosModel.js';
import MunicipiosModel from '../models/municipiosModel.js';

class GeoController {
  static async getRegiones(req, res) {
    try {
      const regiones = await RegionesModel.getAll();
      res.json(regiones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDepartamentos(req, res) {
    try {
      const { region_id } = req.query;
      const departamentos = region_id 
        ? await DepartamentosModel.getByRegion(region_id)
        : await DepartamentosModel.getAll();
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMunicipios(req, res) {
    try {
      const { departamento_id } = req.query;
      if (!departamento_id) {
        return res.status(400).json({ error: 'departamento_id requerido' });
      }
      const municipios = await MunicipiosModel.getByDepartamento(departamento_id);
      res.json(municipios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default GeoController;