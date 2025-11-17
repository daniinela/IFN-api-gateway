// geo-service/config/database.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('\n=== CONFIGURACIÓN GEO-SERVICE ===');
console.log('📍 SUPABASE_URL:', supabaseUrl ? '✅' : '❌ NO ENCONTRADA');
console.log('🔑 SUPABASE_KEY:', supabaseKey ? `✅ (${supabaseKey.substring(0, 20)}...)` : '❌ NO ENCONTRADA');
console.log('🌐 PORT:', process.env.PORT || '3004');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR CRÍTICO: Faltan credenciales de Supabase');
  console.error('Verifica que tu archivo .env tenga:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY)');
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

console.log('✅ Cliente de Supabase creado correctamente\n');

export default supabase;