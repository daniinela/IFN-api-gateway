import axios from 'axios';

const SERVICES = {
  usuarios: process.env.USUARIOS_SERVICE_URL || 'http://localhost:3001',
  brigadas: process.env.BRIGADAS_SERVICE_URL || 'http://localhost:3002'
};

export async function getBrigadistaConNombre(brigadista_id, token) {  // ← Recibe token
  try {
    const brigadistaRes = await axios.get(
      `${SERVICES.brigadas}/api/brigadistas/${brigadista_id}`,
      { 
        timeout: 5000,
        headers: { Authorization: `Bearer ${token}` }  // ← Pasa el token
      }
    );
    
    const brigadista = brigadistaRes.data;
    
    const usuarioRes = await axios.get(
      `${SERVICES.usuarios}/api/usuarios/${brigadista.user_id}`,
      { 
        timeout: 5000,
        headers: { Authorization: `Bearer ${token}` }  // ← Pasa el token
      }
    );
    
    const usuario = usuarioRes.data;
    
    return {
      ...brigadista,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email
    };
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout obteniendo datos del brigadista');
    }
    if (error.response?.status === 404) {
      throw new Error('Brigadista o usuario no encontrado');
    }
    if (error.response?.status === 401) {
      throw new Error('No autorizado: Token inválido o expirado');
    }
    throw new Error(`Error en orquestación: ${error.message}`);
  }
}

export async function getBrigadistasConNombres() {
  try {
    const brigadistasRes = await axios.get(
      `${SERVICES.brigadas}/api/brigadistas`,
      { timeout: 5000 }
    );
    
    const brigadistas = brigadistasRes.data;
    
    const userIds = [...new Set(brigadistas.map(b => b.user_id))];
    
    const usuariosPromises = userIds.map(userId =>
      axios.get(`${SERVICES.usuarios}/api/usuarios/${userId}`, { timeout: 5000 })
        .catch(err => null)
    );
    
    const usuariosResponses = await Promise.all(usuariosPromises);
    const usuarios = usuariosResponses
      .filter(res => res !== null)
      .map(res => res.data);
    
    const usuariosMap = {};
    usuarios.forEach(u => {
      usuariosMap[u.id] = u;
    });
    
    return brigadistas.map(brigadista => ({
      ...brigadista,
      nombre_completo: usuariosMap[brigadista.user_id]?.nombre_completo || 'Nombre no disponible',
      email: usuariosMap[brigadista.user_id]?.email || null
    }));
    
  } catch (error) {
    throw new Error(`Error obteniendo brigadistas: ${error.message}`);
  }
}

export async function getBrigadistasDeBrigadaConNombres(brigada_id) {
  try {
    const asignacionesRes = await axios.get(
      `${SERVICES.brigadas}/api/brigadas-brigadistas/brigada/${brigada_id}`,
      { timeout: 5000 }
    );
    
    const asignaciones = asignacionesRes.data;
    
    if (asignaciones.length === 0) {
      return [];
    }
    
    const brigadistas = asignaciones.map(a => a.brigadistas);
    const userIds = brigadistas.map(b => b.user_id);
    
    const usuariosPromises = userIds.map(userId =>
      axios.get(`${SERVICES.usuarios}/api/usuarios/${userId}`, { timeout: 5000 })
        .catch(() => null)
    );
    
    const usuariosResponses = await Promise.all(usuariosPromises);
    const usuarios = usuariosResponses
      .filter(res => res !== null)
      .map(res => res.data);
    
    const usuariosMap = {};
    usuarios.forEach(u => {
      usuariosMap[u.id] = u;
    });
    
    return asignaciones.map(asignacion => ({
      ...asignacion,
      brigadistas: {
        ...asignacion.brigadistas,
        nombre_completo: usuariosMap[asignacion.brigadistas.user_id]?.nombre_completo,
        email: usuariosMap[asignacion.brigadistas.user_id]?.email
      }
    }));
    
  } catch (error) {
    throw new Error(`Error obteniendo brigadistas de brigada: ${error.message}`);
  }
}