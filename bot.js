require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })

bot.on('message', (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `سلام ${msg.from.first_name}! پیام شما: ${msg.text}`)
})

console.log('ربات در حال اجرا است...')
