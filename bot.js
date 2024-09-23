// bot.js
const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('./config');
const { startHandler, helpHandler, webAppDataHandler } = require('./handlers');

const bot = new Telegraf(BOT_TOKEN);

bot.start(startHandler);
bot.help(helpHandler);
bot.on('web_app_data', webAppDataHandler);

bot.launch().then(() => {
  console.log('Bot started successfully');
}).catch(err => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
