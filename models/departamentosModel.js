// geo-service/models/departamentosModel.js
import supabase from '../config/database.js';

class DepartamentosModel {
  static async getAll() {
    const { data, error } = await supabase
      .from('departamentos')
      .select(`*, regiones(nombre)`)
      .order('nombre', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getByRegion(region_id) {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('region_id', region_id)
      .order('nombre', { ascending: true });
    if (error) throw error;
    return data || [];
  }
}

export default DepartamentosModel;