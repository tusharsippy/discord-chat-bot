const Discord = require('discord.js');
const client = new Discord.Client();
// MongoDB wrapper
const mongoose = require('mongoose');
const path = require('path');

// load config from .env file, all variables will now be availabe in process environment
require('dotenv').config({
  path: path.join(process.cwd(), '.env')
});

// mongoDB connection settings
mongoose.set('useFindAndModify', false);
mongoose
  .connect(
    process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Database Connected'))
  .catch(error => {
    console.error(error);
  });

// Bot token provided by discord
const token = process.env.BOT_TOKEN;

// controllers to handle all the logic
const msgController = require('./controllers/msgController');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.author.bot) return;

  // message will be passed to a function dispatcher for handle all logical part
  return msgController.dispatcher(message);
});

client.login(token);