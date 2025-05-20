import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Verificar si la tabla ya existe
  const tableExists = await knex.schema.hasTable('fcm_tokens');
  
  if (!tableExists) {
    // Solo crear la tabla si no existe
    return knex.schema.createTable('fcm_tokens', (table) => {
      table.string('fcm_token', 4096).primary();
      table.string('user_id', 255).notNullable();
      table.string('device_type', 255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  } else {
    // No hacer nada si la tabla ya existe (éxito silencioso)
    console.log('La tabla fcm_tokens ya existe, omitiendo creación.');
    return Promise.resolve();
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fcm_tokens');
}