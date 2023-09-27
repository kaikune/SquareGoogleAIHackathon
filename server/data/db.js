const mongoose = require('mongoose');


const uri = "mongodb+srv://user0:user0pass@test1.zp8ibld.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);

  });