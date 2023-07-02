const express = require('express');
const bodyParser = require('body-parser');
const { db, Op } = require('./models');
const request = require('request');

const URLS = [
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json',
  'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json'
]

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', async (req, res) => {
  try {
    const games = await db.Game.findAll()
    return res.send(games)
  } catch (err) {
    console.error('There was an error querying games', err);
    return res.send(err);
  }
})

app.post('/api/games', async (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***There was an error creating a game', err);
    return res.status(400).send(err);
  }
})

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id))
    await game.destroy({ force: true })
    return res.send({ id: game.id  })
  } catch (err) {
    console.error('***Error deleting game', err);
    return res.status(400).send(err);
  }
});

app.put('/api/games/:id', async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.findByPk(id)
    await game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***Error updating game', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/search', async(req, res) => {
  try {
    const {name, platform} = req.body;
    console.log({name, platform});
    const games = await db.Game.findAll({
      where: {
        platform: platform.length > 0 ? platform : { [Op.ne]: null },
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
    return res.send(games);
  } catch(err) {
    console.error('***There was an error while searching games', err);
    return res.status(400).send(err);
  }
});

app.get('/api/games/populate', async(req, res) => {
  try {
    for(const url of URLS) {    
      const parsedGames = [];
      const json = await fetch(url).then(res => res.json());
      for(const games of json) {
        for(const game of games) {
          const {publisher_id: publisherId, humanized_name: name, os: platform, bundle_id: bundleId, version: appVersion, appId: storeId} = game;
          parsedGames.push({publisherId, name, platform, bundleId, appVersion, storeId, isPublished: true});
        }
      }
      await db.Game.bulkCreate(parsedGames);
    }
    return res.status(201).send();
  } catch(err) {
    console.error('***There was an error while searching games', err);
    return res.status(400).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
