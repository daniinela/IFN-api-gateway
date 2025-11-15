// geo-service/models/municipiosModel.js
import supabase from '../config/database.js';

class MunicipiosModel {
  static async getByDepartamento(departamento_id) {
    const { data, error } = await supabase
      .from('municipios')
      .select('*')
      .eq('departamento_id', departamento_id)
      .order('nombre', { ascending: true });
    if (error) throw error;
    return data || [];
  }
}

export default MunicipiosModel;