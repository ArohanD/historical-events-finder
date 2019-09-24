const historicalData = require('./historicaldata')
const Event = require('./index.js')

const events = historicalData.events;

const seedDB = async () => {

  await events.forEach(event => {

    let date = new Date;
    let dateArray = event.date.split('/');
    date.setFullYear(dateArray[0]);
    date.setMilliseconds(0);
    if(dateArray[1]) date.setMonth(dateArray[1] - 1);
    if(dateArray[2]) {
      date.setDate(dateArray[2])
      date.setMilliseconds(333);
    };

    let singleEvent = new Event({
      date: date,
      description: event.description,
      lang: event.lang,
      category1: event.category1,
      category2: event.category2,
      granularity: event.granularity,
    })
    
    let count = 0;
    singleEvent.save((err, res) => {
      if (err) console.log(events[count], err)
      count++;
    })
  })

  await Event.collection.createIndex({date: 1});
  
}

module.exports = seedDB;
