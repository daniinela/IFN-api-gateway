// geo-service/controller/geoController.js
import RegionesModel from '../models/regionesModel.js';
import DepartamentosModel from '../models/departamentosModel.js';
import MunicipiosModel from '../models/municipiosModel.js';

class GeoController {
  // ========== REGIONES ==========
  static async getRegiones(req, res) {
    try {
      console.log('📍 Obteniendo todas las regiones');
      const regiones = await RegionesModel.getAll();
      console.log(`✅ ${regiones.length} regiones encontradas`);
      res.json(regiones);
    } catch (error) {
      console.error('❌ Error en getRegiones:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getRegionById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📍 Obteniendo región ID: ${id}`);
      const region = await RegionesModel.getById(id);
      
      if (!region) {
        return res.status(404).json({ error: 'Región no encontrada' });
      }
      
      res.json(region);
    } catch (error) {
      console.error('❌ Error en getRegionById:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ========== DEPARTAMENTOS ==========
  static async getDepartamentos(req, res) {
    try {
      console.log('📍 Obteniendo todos los departamentos');
      const departamentos = await DepartamentosModel.getAll();
      console.log(`✅ ${departamentos.length} departamentos encontrados`);
      res.json(departamentos);
    } catch (error) {
      console.error('❌ Error en getDepartamentos:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getDepartamentosByRegion(req, res) {
    try {
      const { region_id } = req.params;
      console.log(`📍 Obteniendo departamentos de región: ${region_id}`);
      const departamentos = await DepartamentosModel.getByRegion(region_id);
      console.log(`✅ ${departamentos.length} departamentos encontrados`);
      res.json(departamentos);
    } catch (error) {
      console.error('❌ Error en getDepartamentosByRegion:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getDepartamentoById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📍 Obteniendo departamento ID: ${id}`);
      
      // ✅ VERIFICAR QUE EL MÉTODO EXISTE
      if (typeof DepartamentosModel.getById !== 'function') {
        console.error('❌ CRÍTICO: DepartamentosModel.getById NO ES UNA FUNCIÓN');
        console.error('Métodos disponibles:', Object.getOwnPropertyNames(DepartamentosModel));
        return res.status(500).json({ 
          error: 'Error interno: Método getById no disponible',
          metodos_disponibles: Object.getOwnPropertyNames(DepartamentosModel)
        });
      }
      
      const departamento = await DepartamentosModel.getById(id);
      
      if (!departamento) {
        return res.status(404).json({ error: 'Departamento no encontrado' });
      }
      
      console.log('✅ Departamento encontrado:', departamento.nombre);
      res.json(departamento);
    } catch (error) {
      console.error('❌ Error en getDepartamentoById:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ========== MUNICIPIOS ==========
  static async getMunicipios(req, res) {
    try {
      console.log('📍 Obteniendo todos los municipios');
      const municipios = await MunicipiosModel.getAll();
      console.log(`✅ ${municipios.length} municipios encontrados`);
      res.json(municipios);
    } catch (error) {
      console.error('❌ Error en getMunicipios:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMunicipiosByDepartamento(req, res) {
    try {
      const { departamento_id } = req.params;
      console.log(`📍 Obteniendo municipios de departamento: ${departamento_id}`);
      const municipios = await MunicipiosModel.getByDepartamento(departamento_id);
      console.log(`✅ ${municipios.length} municipios encontrados`);
      res.json(municipios);
    } catch (error) {
      console.error('❌ Error en getMunicipiosByDepartamento:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMunicipioById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📍 Obteniendo municipio ID: ${id}`);
      const municipio = await MunicipiosModel.getById(id);
      
      if (!municipio) {
        return res.status(404).json({ error: 'Municipio no encontrado' });
      }
      
      res.json(municipio);
    } catch (error) {
      console.error('❌ Error en getMunicipioById:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export default GeoController;