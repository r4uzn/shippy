import request from 'supertest';
import app from '../app.js';
describe('GET /api/projects', () => {
    it('should return a list of projects', async () => {
        const response = await request(app).get('/api/projects');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
//# sourceMappingURL=projects.test.js.map