import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
    it('should return a 200 status and the correct message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Server is running on port 3000');
    });
});

describe('GET /nonexistent', () => {
    it('should return a 404 status for unknown routes', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.status).toBe(404);
    });
});