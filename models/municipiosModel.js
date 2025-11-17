// ========== geo-service/models/municipiosModel.js ==========
import supabase from '../config/database.js';

class MunicipiosModel {
  static async getAll() {
    const { data, error } = await supabase
      .from('municipios')
      .select(`
        *,
        departamentos(id, nombre, codigo)
      `)
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error('❌ Error en MunicipiosModel.getAll:', error);
      throw error;
    }
    
    return data || [];
  }

  static async getByDepartamento(departamento_id) {
    const { data, error } = await supabase
      .from('municipios')
      .select('*')
      .eq('departamento_id', departamento_id)
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error('❌ Error en MunicipiosModel.getByDepartamento:', error);
      throw error;
    }
    
    return data || [];
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('municipios')
      .select(`
        *,
        departamentos(id, nombre, codigo)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('❌ Error en MunicipiosModel.getById:', error);
      throw error;
    }
    
    return data;
  }
}

export default MunicipiosModel;