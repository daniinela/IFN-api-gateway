// geo-service/models/regionesModel.js
import supabase from '../config/database.js';

class RegionesModel {
  static async getAll() {
    const { data, error } = await supabase
      .from('regiones')
      .select('*')
      .order('nombre', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('regiones')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default RegionesModel;