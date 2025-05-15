import db from '../../src/db/connection';

describe('Database Connection', () => {
  afterAll(async () => {
    await db.destroy();
  });

  it('should connect to the database successfully', async () => {
    const result = await db.raw('SELECT 1+1 AS result');
    expect(result.rows[0].result).toBe(2);
  });
});