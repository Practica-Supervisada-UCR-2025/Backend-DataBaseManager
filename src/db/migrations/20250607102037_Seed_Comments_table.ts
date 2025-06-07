import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

// Seeder: populate comments (and nested replies) for existing posts
export async function up(knex: Knex): Promise<void> {
    const USER_ID = 'aad06c03-08b8-4030-b006-c988347d9610';

    // Fetch all seeded post IDs for the user
    const posts = await knex<string, { id: string }[]>('posts')
        .select('id')
        .where('user_id', USER_ID);

    // Sample comments text
    const sampleComments = [
        '¡Gran post! Me encantó tu perspectiva.',
        'Totalmente de acuerdo con lo que compartes.',
        '¿Podrías profundizar un poco más en este punto?',
        'Gracias por la info, súper útil 👍',
        'Interesante, nunca lo había visto así.',
        '¿Alguien más ha probado esto? ¿Qué opinan?',
        'Buen trabajo, sigue así.',
        'Creo que podría complementar esto con otros datos.',
        '¡WOW! Esto cambió mi forma de verlo.',
        'Me surge una duda: ¿cómo lo implementaste?',
        'Siempre aprendo algo nuevo leyendo tus posts.',
        'Esto merece un tutorial completo 😉',
        'Gran captura, la calidad es excelente.',
        '¡Increíble idea! La compartiré con mis contactos.',
        'Me gustaría saber tu opinión sobre el aspecto X.',
    ];

    const commentsToInsert: any[] = [];

    let ensured = false;

    for (let idx = 0; idx < posts.length; idx++) {
        const postId = posts[idx].id;

        let numComments: number;
        if (!ensured) {
            numComments = 13;
            ensured = true;
        } else {
            numComments = Math.floor(Math.random() * 4) + 4;
        }

        for (let i = 0; i < numComments; i++) {
            const commentId = uuidv4();
            commentsToInsert.push({
                id: commentId,
                post_id: postId,
                user_id: USER_ID,
                parent_comment_id: null,
                content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
                file_url: Math.random() > 0.7
                    ? 'https://images.pexels.com/photos/' + (1000000 + Math.floor(Math.random() * 9000000)) + '/pexels-photo.jpg'
                    : null,
                file_size: null,
                media_type: null,
                is_active: true,
                is_edited: false,
                status: 0,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            });

            // 30% chance to add 1–2 replies
            if (Math.random() < 0.3) {
                const numReplies = Math.floor(Math.random() * 2) + 1;
                for (let j = 0; j < numReplies; j++) {
                    commentsToInsert.push({
                        id: uuidv4(),
                        post_id: postId,
                        user_id: USER_ID,
                        parent_comment_id: commentId,
                        content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
                        file_url: null,
                        file_size: null,
                        media_type: null,
                        is_active: true,
                        is_edited: false,
                        status: 0,
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now(),
                    });
                }
            }
        }
    }

    // Bulk insert all comments and replies
    await knex('comments').insert(commentsToInsert);
}

export async function down(knex: Knex): Promise<void> {
    // Remove all seeded comments by this user
    await knex('comments')
        .where('user_id', 'aad06c03-08b8-4030-b006-c988347d9610')
        .del();
}
