// test-supabase.js
// Guarda este archivo en geo-service/ y ejecuta: node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('\n🔍 DIAGNÓSTICO SUPABASE GEO-SERVICE\n');
console.log('1️⃣ Variables de Entorno:');
console.log('   URL:', supabaseUrl);
console.log('   KEY:', supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'NO ENCONTRADA');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Faltan credenciales');
  process.exit(1);
}

console.log('\n2️⃣ Creando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Cliente creado\n');

console.log('3️⃣ Probando conexión a tablas...\n');

// Test 1: Regiones
console.log('📍 Probando tabla "regiones"...');
try {
  const { data, error, count } = await supabase
    .from('regiones')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('   ❌ ERROR:', error.message);
    console.error('   Código:', error.code);
    console.error('   Detalles:', error.details);
    console.error('   Hint:', error.hint);
  } else {
    console.log(`   ✅ Éxito: ${data?.length || 0} regiones encontradas`);
    if (data && data.length > 0) {
      console.log('   Primeras regiones:');
      data.slice(0, 3).forEach(r => console.log(`      - ${r.nombre}`));
    }
  }
} catch (err) {
  console.error('   ❌ EXCEPCIÓN:', err.message);
}

// Test 2: Departamentos
console.log('\n📍 Probando tabla "departamentos"...');
try {
  const { data, error } = await supabase
    .from('departamentos')
    .select('*')
    .limit(3);

  if (error) {
    console.error('   ❌ ERROR:', error.message);
  } else {
    console.log(`   ✅ Éxito: ${data?.length || 0} departamentos encontrados`);
  }
} catch (err) {
  console.error('   ❌ EXCEPCIÓN:', err.message);
}

// Test 3: Municipios
console.log('\n📍 Probando tabla "municipios"...');
try {
  const { data, error } = await supabase
    .from('municipios')
    .select('*')
    .limit(3);

  if (error) {
    console.error('   ❌ ERROR:', error.message);
  } else {
    console.log(`   ✅ Éxito: ${data?.length || 0} municipios encontrados`);
  }
} catch (err) {
  console.error('   ❌ EXCEPCIÓN:', err.message);
}

console.log('\n✅ DIAGNÓSTICO COMPLETADO\n');
process.exit(0);