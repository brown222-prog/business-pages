// Script to check and add template column to businesses table
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  const equalIndex = line.indexOf('=');
  if (equalIndex !== -1) {
    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1).trim();
    // Remove inline comments
    const commentIndex = value.indexOf(' #');
    if (commentIndex !== -1) {
      value = value.substring(0, commentIndex).trim();
    }
    if (key && value) {
      envVars[key] = value;
    }
  }
});

const { createClient } = require('@supabase/supabase-js');

console.log('Parsed env vars:', Object.keys(envVars));

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Found URL:', supabaseUrl ? 'Yes' : 'No');
  console.log('Found Key:', supabaseServiceKey ? 'Yes' : 'No');
  console.log('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndAddTemplateColumn() {
  console.log('🔍 Checking if template column exists...\n');

  try {
    // Try to fetch a business with the template column
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, template')
      .limit(1);

    if (error) {
      if (error.message.includes('column') && error.message.includes('template')) {
        console.log('❌ Template column does NOT exist yet.\n');
        console.log('📝 To add it, you need to run this SQL in your Supabase dashboard:');
        console.log('   (Go to: Supabase Dashboard → SQL Editor → New Query)\n');
        console.log('----------------------------------------');
        console.log('ALTER TABLE businesses');
        console.log("ADD COLUMN IF NOT EXISTS template VARCHAR(20) DEFAULT 'classic';");
        console.log('');
        console.log('ALTER TABLE businesses');
        console.log("ADD CONSTRAINT valid_template CHECK (template IN ('classic', 'modern', 'minimal'));");
        console.log('----------------------------------------\n');
        console.log('⚠️  The anon key does not have permission to alter tables.');
        console.log('   You must run this SQL directly in the Supabase dashboard.');
        return;
      }
      throw error;
    }

    console.log('✅ Template column exists!');
    console.log('\n📊 Current businesses:');

    // Fetch all businesses to show their current template values
    const { data: allBusinesses, error: fetchError } = await supabase
      .from('businesses')
      .select('name, slug, template');

    if (fetchError) throw fetchError;

    if (allBusinesses && allBusinesses.length > 0) {
      allBusinesses.forEach((biz, idx) => {
        console.log(`  ${idx + 1}. ${biz.name} (/${biz.slug}) - Template: ${biz.template || 'classic'}`);
      });
    } else {
      console.log('  No businesses found.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkAndAddTemplateColumn();
