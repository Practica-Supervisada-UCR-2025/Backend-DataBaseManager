import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    
  // Crear tabla User
  await knex.schema.createTable('User', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('token');
    table.string('username').notNullable();
    table.string('full_name').notNullable();
    table.string('profile_picture');
    table.enu('role', ['user', 'moderator', 'admin']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_login');
  });

  // Crear tabla AdminUser
  await knex.schema.createTable('AdminUser', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('full_name').notNullable();
    table.enu('admin_role', ['superadmin', 'admin', 'moderator']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_login');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('AdminUser');
  await knex.schema.dropTableIfExists('User');
}