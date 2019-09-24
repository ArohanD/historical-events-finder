const Event = require('../db/index.js');
const seedDB = require('../db/seed.js')
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('dist'));

app.get('/seed', async (req, res) => {
  await seedDB();
  res.end('Database seed attempted')
})

app.get('/getItemsByKeyWord', async (req, res) => {
  let searchTerm = req.query.searchTerm;
  let index = (req.query.page - 1) * 2;
  
  let eventArray = await Event.find({description: { $regex: searchTerm }})
  res.send(eventArray.slice(index, index + 2));
})

app.get('/numPages', async (req, res) => {
  let searchTerm = req.query.searchTerm;
  let eventArray = await Event.find({description: { $regex: searchTerm }}).limit(20)
  res.status(200).end(JSON.stringify(eventArray.length / 2));
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'), function(err) {
    if (err) {
      res.sendStatus(500).send(err)
    }
  })
})

app.listen(port, () => console.log(`listening from port: ${port}`));
