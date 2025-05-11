import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.string('content', 300);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('file_url');
    table.integer('file_size');
    table.integer('media_type');
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_edited').defaultTo(false);
    table.integer('status').defaultTo(0).index();
  });

  await knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary();
    table.uuid('reporter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('reported_content_id').notNullable().references('id').inTable('posts').onDelete('CASCADE');
    table.enu('content_type', ['post', 'comment', 'media']).notNullable();
    table.string('reason').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('resolver_id').references('id').inTable('admin_users').onDelete('SET NULL')
    table.integer('status').defaultTo(0).index();
  });

  const DEFAULT_PROFILE_PICTURE = 'https://storage.googleapis.com/your-bucket/default-avatar.png';

  const newUserId = uuidv4();
  await knex('users').insert({
    id: newUserId,
    email: 'cristopher.hernandez@ucr.ac.cr',
    full_name: 'Cris Hernandez',
    username: 'cristopher.hernandez',
    profile_picture: DEFAULT_PROFILE_PICTURE,
    is_active: true,
    created_at: knex.fn.now(),
  });

  const post1Id = uuidv4();
  const post2Id = uuidv4();
  await knex('posts').insert([
    {
      id: post1Id,
      user_id: newUserId,
      content: 'Este es mi primer post.',
      file_url: 'https://storage.googleapis.com/your-bucket/image1.png',
      file_size: 1024,
      media_type: 1,
      is_active: true,
      is_edited: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      status: 1,
    },
    {
      id: post2Id,
      user_id: newUserId,
      content: 'Este es mi segundo post.',
      file_url: null,
      media_type: null, 
      is_active: true,
      is_edited: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

    await knex('reports').insert([
        {
        id: uuidv4(),
        reporter_id: newUserId,
        reported_content_id: post1Id,
        content_type: 'post',
        reason: 'Contenido inapropiado',
        created_at: knex.fn.now(),
        }
    ]);
}

export async function down(knex: Knex): Promise<void> {
  // Eliminar tablas en orden inverso para evitar conflictos de claves foráneas
  await knex.schema.dropTableIfExists('reports');
  await knex.schema.dropTableIfExists('posts');
  await knex('users').where('email', 'cristopher.hernandez@ucr.ac.cr').del();
}