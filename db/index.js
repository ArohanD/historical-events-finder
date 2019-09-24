const mongoose = require('mongoose');
const uri = 'mongodb://localhost/historical-data';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database')
});

const eventSchema = new mongoose.Schema({
  date: Date,
  description: String,
  lang: String,
  category1: String,
  category2: String,
  granularity: String,
})

const Event = mongoose.model('events', eventSchema);

module.exports = Event;