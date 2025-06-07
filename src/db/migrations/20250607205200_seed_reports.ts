import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function up(knex: Knex): Promise<void> {
  const DEFAULT_PROFILE_PICTURE = 'https://storage.googleapis.com/your-bucket/default-avatar.png';

  // Crear usuarios
  const joseId = uuidv4();
  const johnId = uuidv4();

  await knex('users').insert([
    {
      id: joseId,
      email: 'jose.salvatierra@ucr.ac.cr',
      full_name: 'Jose Andres Salvatierra',
      username: 'jose.salvatierra',
      profile_picture: DEFAULT_PROFILE_PICTURE,
      is_active: true,
      created_at: knex.fn.now(),
    },
    {
      id: johnId,
      email: 'john.cena@ucr.ac.cr',
      full_name: 'John Cena',
      username: 'john.desayuna',
      profile_picture: DEFAULT_PROFILE_PICTURE,
      is_active: true,
      created_at: knex.fn.now(),
    }
  ]);

  const posts = [];
  for (let i = 1; i <= 10; i++) {
    posts.push({
      id: uuidv4(),
      user_id: joseId,
      content: `Post número ${i} de Jose`,
      file_url: null,
      file_size: null,
      media_type: null,
      is_active: true,
      is_edited: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      status: 1,
    });
  }
  await knex('posts').insert(posts);

  const reports = [];
  for (const post of posts) {
    for (let j = 1; j <= 2; j++) {
      reports.push({
        id: uuidv4(),
        reporter_id: johnId,
        reported_content_id: post.id,
        content_type: 'post',
        reason: `Razón de reporte ${j} para el post ${post.content}`,
        created_at: knex.fn.now(),
        status: 0,
      });
    }
  }
  await knex('reports').insert(reports);
}

export async function down(knex: Knex): Promise<void> {
  const jose = await knex('users').where('email', 'jose.salvatierra@ucr.ac.cr').first();
  if (jose) {
    const posts = await knex('posts').where('user_id', jose.id);
    const postIds = posts.map((p: any) => p.id);
    await knex('reports').whereIn('reported_content_id', postIds).del();
    await knex('posts').where('user_id', jose.id).del();
  }
  await knex('users').whereIn('email', [
    'jose.salvatierra@ucr.ac.cr',
    'john.cena@ucr.ac.cr'
  ]).del();
}