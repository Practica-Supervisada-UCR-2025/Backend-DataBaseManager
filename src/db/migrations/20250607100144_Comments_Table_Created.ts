import {Knex} from 'knex';

// Migration: create comments table (supports replies via parent_comment_id)
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('comments', (table) => {
        // Primary key
        table.uuid('id').primary();

        // Foreign keys
        table.uuid('post_id')
            .notNullable()
            .references('id')
            .inTable('posts')
            .onDelete('CASCADE')
            .index();

        table.uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .index();

        // Support nested replies
        table.uuid('parent_comment_id')
            .nullable()
            .references('id')
            .inTable('comments')
            .onDelete('CASCADE')
            .index();

        // Core content
        table.text('content').notNullable();

        // Media attachments (optional)
        table.string('file_url');
        table.integer('file_size');
        table.integer('media_type');

        // Status flags
        table.boolean('is_active').defaultTo(true);
        table.boolean('is_edited').defaultTo(false);
        table.integer('status').defaultTo(0).index();

        // Timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    // Drop comments table (no dependencies below)
    await knex.schema.dropTableIfExists('comments');
}


