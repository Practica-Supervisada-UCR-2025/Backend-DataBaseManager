import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('auth_id').unique().nullable();
  });

  await knex.schema.alterTable('admin_users', (table) => {
    table.string('auth_id').unique().nullable();
  });

  await knex('admin_users').insert({
    id: uuidv4(),
    email: 'johana.wu@ucr.ac.cr',
    full_name: 'Johana Wu',
    auth_id: '1c00UonopaZ6EXsiMqkM1Rxq1ro1 ',
    is_active: true,
    created_at: knex.fn.now(),
  });

  await knex('admin_users')
    .where('email', 'angel.chaveschinchilla@ucr.ac.cr')
    .update({
      auth_id: 'auth-admin-12345',
  });
}

export async function down(knex: Knex): Promise<void> {
  // Eliminar la columna auth_id de la tabla users
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('auth_id');
  });

  // Eliminar la columna auth_id de la tabla admin_users
  await knex.schema.alterTable('admin_users', (table) => {
    table.dropColumn('auth_id');
  });

  // Eliminar el usuario insertado en la tabla admin_users
  await knex('admin_users')
    .where('email', 'admin@example.com')
    .del();
}