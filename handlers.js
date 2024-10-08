const { Markup } = require('telegraf');
const { WEB_APP_URL } = require('./config');
const fs = require('fs');

// Set up users who have already received the start message and their intervals
let sentMessages = {};
let intervals = {};

// Function to send the reminder message
const sendReminderMessage = async (ctx, chatId) => {
  const reminderMessage = `🎉 Hurry up! Time is running out! ⏳

For some of you, there are only a few spins left in TON Spin! 🎰 Don’t miss your chance to use them and claim your reward! 🏆💎

And if you’ve already used your spin, all you need to do now is claim your reward! 🚀

Act fast before it's too late! 🔥`;

  await ctx.telegram.sendMessage(chatId, reminderMessage, {
    reply_markup: Markup.inlineKeyboard([
      [{ text: '🎡 START APP', web_app: { url: WEB_APP_URL } }]
    ])
  });
};

// Start handler to send the initial message and start reminders
const startHandler = async (ctx) => {
  const chatId = ctx.message.chat.id;
  const username = ctx.message.chat.username || 'there'; // handle users without a username

  // Initial message
  const initialMessage = `Dear ${username}, 🎡 Welcome to TON Spin! 🎉!

Our TON Spin Mini App lets you easily try your luck and score exclusive rewards.
How it works 🤔❓  
1. Start the bot and follow the simple instructions. 
2. Spin the wheel to see what prize you win! 🎡💎  
3. Claim your rewards instantly and enjoy your winnings.

Join now and start spinning to win incredible prizes today! 💎🎉`;

  // Local image path
  const mainImage = 'ton.png';

  // Send the image first
  await ctx.replyWithPhoto({ source: mainImage });

  // Send the initial message with the inline button that opens the web app inside Telegram
  await ctx.reply(initialMessage, Markup.inlineKeyboard([
    [{ text: '🎡 START APP', web_app: { url: WEB_APP_URL } }]
  ]));

  // Check if the user has already received the start message
  if (!sentMessages[chatId]) {
    sentMessages[chatId] = true;

    // Set up reminder messages 4 times a day (every 6 hours)
    intervals[chatId] = setInterval(() => sendReminderMessage(ctx, chatId), 6 * 60 * 60 * 1000); // every 6 hours
  }
};

// Help command handler to guide users
const helpHandler = async (ctx) => {
  await ctx.reply(
    'To use this bot, please start by sending the /start command. This will take you to the TON Spin platform where you can start spinning to win rewards!',
    Markup.inlineKeyboard([
      [{ text: '🎡 START APP', web_app: { url: WEB_APP_URL } }]
    ])
  );
};

// Handler for receiving data from the web app
const webAppDataHandler = async (ctx) => {
  // Log the data from the web app
  console.log('Web App Data:', ctx.webAppData);
};

// Exporting the handlers
module.exports = {
  startHandler,
  helpHandler,
  webAppDataHandler
};
