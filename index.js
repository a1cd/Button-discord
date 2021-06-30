const Keyv = require('keyv');
const {command} = require('command-based-discord');
const Discord = require('discord.js');
require('dotenv').config()
const add = require('./src/add');

let bot = new Discord.Client()
bot.login(process.env.TOKEN)

let buttons = require('discord-buttons')(bot)
let {MessageComponent}= require('discord-buttons');

const keyv = new Keyv('mongodb://localhost:27017/'+process.env.DATABASE, {adapter: "mongodb", namespace: "server"})
keyv.on('error', err => console.error('Keyv connection error:', err));

bot.once("ready", ()=>{
  bot.on("clickButton", (btn) => {
    /**
     * @type {MessageComponent}
     */
    const button = btn
  })

  let cmd = new command({name: "btrl", "help": "help message", bot: bot, subcommands: [
    new command({name: "add", help: "add a role", commandFunction: add})
  ]})

  bot.on("message", msg => {if (!msg.author.bot) cmd.test(msg.content, msg)
  console.log(msg);})
})
