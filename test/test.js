const request = require('supertest');
const assert = require('assert');
const app = require('../index');
const { db } = require('../models');
const GAMES = require('../fixtures/games')

/**
 * Testing create game endpoint
 */
describe('POST /api/games', () => {
    let data = {
        publisherId: "1234567890",
        name: "Test App",
        platform: "ios",
        storeId: "1234",
        bundleId: "test.bundle.id",
        appVersion: "1.0.0",
        isPublished: true
    }
    it('respond with 200 and an object that matches what we created', async () => {
        const { body, status } = await request(app)
            .post('/api/games')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.publisherId, '1234567890');
        assert.strictEqual(body.name, 'Test App');
        assert.strictEqual(body.platform, 'ios');
        assert.strictEqual(body.storeId, '1234');
        assert.strictEqual(body.bundleId, 'test.bundle.id');
        assert.strictEqual(body.appVersion, '1.0.0');
        assert.strictEqual(body.isPublished, true);
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
    it('respond with json containing a list that includes the game we just created', async () => {
        const { body, status } = await request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body[0].publisherId, '1234567890');
        assert.strictEqual(body[0].name, 'Test App');
        assert.strictEqual(body[0].platform, 'ios');
        assert.strictEqual(body[0].storeId, '1234');
        assert.strictEqual(body[0].bundleId, 'test.bundle.id');
        assert.strictEqual(body[0].appVersion, '1.0.0');
        assert.strictEqual(body[0].isPublished, true);
    });
});


/**
 * Testing update game endpoint
 */
describe('PUT /api/games/1', () => {
    let data = {
        id : 1,
        publisherId: "999000999",
        name: "Test App Updated",
        platform: "android",
        storeId: "5678",
        bundleId: "test.newBundle.id",
        appVersion: "1.0.1",
        isPublished: false
    }
    it('respond with 200 and an updated object', async () => {
        const { body, status } = await request(app)
            .put('/api/games/1')
            .set('Accept', 'application/json')
            .send(data)
        assert.strictEqual(status, 200);
        assert.strictEqual(body.publisherId, '999000999');
        assert.strictEqual(body.name, 'Test App Updated');
        assert.strictEqual(body.platform, 'android');
        assert.strictEqual(body.storeId, '5678');
        assert.strictEqual(body.bundleId, 'test.newBundle.id');
        assert.strictEqual(body.appVersion, '1.0.1');
        assert.strictEqual(body.isPublished, false);
    });
});

/**
 * Testing update game endpoint
 */
describe('DELETE /api/games/1', () => {
    it('respond with 200', async () => {
        const { body, status } = await request(app)
            .delete('/api/games/1')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body.id, 1);
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', () => {
    it('respond with json containing no games', async () => {
        const { body, status } = await request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 200);
        assert.strictEqual(body.length, 0);
    });
});

/**
 * Testing search games endpoint
 */
describe('POST /api/games/search', () => {
    beforeEach(async () => {
        await db.Game.bulkCreate(GAMES)
    });
    
    afterEach( async () => {
        db.Game.destroy({
            truncate: true
          })
    });

    it('respond with 200 and return all games if platform and name are empty', async () => {
        const {body, status} = await request(app)
            .post('/api/games/search')
            .set('Accept', 'application/json')
            .send({platform: '', name: ''})
        assert.strictEqual(status, 200)
        assert.strictEqual(body.length, 5)
    });
    it('respond with 200 and return all ios games if platform is set to ios and name is empty', async () => {
        const {body, status} = await request(app)
            .post('/api/games/search')
            .set('Accept', 'application/json')
            .send({platform: 'ios', name: ''})
        assert.strictEqual(status, 200)
        assert.strictEqual(body.length, 3)
    });
    it('respond with 200 and return ios games when platform is set to ios and name partially match element in db', async () => {
        const {body, status} = await request(app)
            .post('/api/games/search')
            .set('Accept', 'application/json')
            .send({platform: 'ios', name: 'heli'})
        assert.strictEqual(status, 200)
        assert.strictEqual(body.length, 1)
    });
});

/**
 * Testing populate games endpoint
 */
describe('POST /api/games/populate', () => {

    beforeEach(async () => {
        await db.Game.destroy({
            truncate: true
          })
    });
    
    afterEach( async () => {
        await db.Game.destroy({
            truncate: true
          })
    });

    it('respond with 201 and should populate all app from the android file', async () => {
        const {status} = await request(app)
            .get('/api/games/populate')
            .set('Accept', 'application/json')
        assert.strictEqual(status, 201);
        assert.strictEqual(await db.Game.count(), 600);
    });
});
