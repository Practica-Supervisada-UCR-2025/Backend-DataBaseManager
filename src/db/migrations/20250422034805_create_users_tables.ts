import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
    
  const DEFAULT_PROFILE_PICTURE = 'https://storage.googleapis.com/your-bucket/default-avatar.png'; // Update with your actual default image URL

  // Crear tabla User
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    // table.string('password_hash').notNullable();
    // table.string('token');
    table.string('full_name').notNullable();
    table.string('username').notNullable();
    table.string('profile_picture');
    // table.enu('role', ['user', 'moderator', 'admin']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    // table.timestamp('last_login');
  });

  // Insert default user
  await knex('users').insert({
    id: uuidv4(),
    email: 'angel.chaveschinchilla@ucr.ac.cr',
    full_name: 'Angel Chaves',
    username: 'angel.chaveschinchilla',
    profile_picture: DEFAULT_PROFILE_PICTURE,
    is_active: true,
    created_at: knex.fn.now(),
  });

  // Crear tabla AdminUser
  await knex.schema.createTable('admin_users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    // table.string('password_hash').notNullable();
    table.string('full_name').notNullable();
    // table.enu('admin_role', ['superadmin', 'admin', 'moderator']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    // table.timestamp('last_login');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('admin_users');
  await knex.schema.dropTableIfExists('users');
}