// geo-service/models/departamentosModel.js
import supabase from '../config/database.js';

class DepartamentosModel {
  
  // ✅ OBTENER TODOS
  static async getAll() {
    console.log('📡 DepartamentosModel.getAll() ejecutado');
    
    const { data, error } = await supabase
      .from('departamentos')
      .select(`
        *,
        regiones (
          id,
          nombre,
          codigo
        )
      `)
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error('❌ Error en getAll:', error);
      throw error;
    }
    
    console.log(`✅ ${data?.length || 0} departamentos obtenidos`);
    return data || [];
  }

  // ✅ OBTENER POR REGIÓN
  static async getByRegion(region_id) {
    console.log('📡 DepartamentosModel.getByRegion() ejecutado:', region_id);
    
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('region_id', region_id)
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error('❌ Error en getByRegion:', error);
      throw error;
    }
    
    console.log(`✅ ${data?.length || 0} departamentos encontrados`);
    return data || [];
  }

  // ✅ OBTENER POR ID (MÉTODO QUE FALTABA)
  static async getById(id) {
    console.log('📡 DepartamentosModel.getById() ejecutado:', id);
    
    const { data, error } = await supabase
      .from('departamentos')
      .select(`
        *,
        regiones (
          id,
          nombre,
          codigo
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Error en getById:', error);
      throw error;
    }
    
    console.log('✅ Departamento encontrado:', data?.nombre);
    return data;
  }
}

export default DepartamentosModel;