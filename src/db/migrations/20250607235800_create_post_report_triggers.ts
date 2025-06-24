import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Crear función tipo TRIGGER
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_post_status_if_needed()
    RETURNS TRIGGER AS $$
    DECLARE
      report_count INTEGER;
      current_status INTEGER;
    BEGIN
      -- Contar reportes del contenido
      SELECT COUNT(*) INTO report_count 
      FROM reports 
      WHERE reported_content_id = NEW.reported_content_id 
        AND content_type = 'post';
      
      -- Si hay al menos 3 reportes
      IF report_count >= 3 THEN
        -- Obtener estado actual
        SELECT status INTO current_status 
        FROM posts 
        WHERE id = NEW.reported_content_id;

        -- Si está activo, desactivarlo
        IF current_status = 1 THEN
          UPDATE posts 
          SET status = 0, updated_at = NOW()
          WHERE id = NEW.reported_content_id;
        END IF;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Crear trigger para insert
  await knex.raw(`
    CREATE TRIGGER tr_reports_insert
    AFTER INSERT ON reports
    FOR EACH ROW
    WHEN (NEW.content_type = 'post')
    EXECUTE FUNCTION update_post_status_if_needed();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS tr_reports_insert ON reports;`);
  await knex.raw(`DROP FUNCTION IF EXISTS update_post_status_if_needed;`);
}
