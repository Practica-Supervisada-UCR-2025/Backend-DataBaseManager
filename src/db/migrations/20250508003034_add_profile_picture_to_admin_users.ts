import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('admin_users', (table) => {
    table.string('profile_picture').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('admin_users', (table) => {
    table.dropColumn('profile_picture');
  });
}