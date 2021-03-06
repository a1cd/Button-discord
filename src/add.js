const buttons = require('discord-buttons')
const Keyv = require('keyv');
const Discord = require('discord.js');
const {command} = require('command-based-discord');
const {log} = console

require('dotenv').config()

/**
 * @type {(input: String, message: Discord.Message, command: command) => {} | null}
 */
module.exports = async (input, msg, cmd) => {
  const bot = cmd.bot
  const keyv = new Keyv('mongodb://localhost:27017/'+process.env.DATABASE, {adapter: "mongodb", namespace: msg.guild.id})
  const args = msg.cleanContent.split("\n")
  
  keyv.on('error', err => console.error('Keyv connection error:', err));
  
  if (args.length != 4) {
    let button = new buttons.MessageButton()
    .setID("test")
    .setDisabled(true)
    .setLabel("Epic role!")
    .setStyle("grey")
    msg.channel.send('Try again, you need to tell me some info first\n```json\n!add "- getting my attention"\n#channel "- the channel you want it in"\n@role "- the role you want to grant (must already exist)"\nEpic role! "- the text on the role button"```\nexample button:', button)
  } else {
    let roles = await msg.mentions.roles.array()
    if (roles.length == 0){ 
      msg.reply("that role doesnt exist! (or you need to mention the role for me to understand)")
    }
    let channels = await msg.mentions.channels.array()
    if (channels.length == 0){ 
      msg.reply("that channel doesnt exist! (or you need to mention the channel you want!)")
    }
    var on = new buttons.MessageButton()
      .setID("on")
      .setStyle("green")
    var off = new buttons.MessageButton()
      .setID("off")
      .setStyle("blurple")
    on = on.setLabel(args[args.length-1])
    let row = new buttons.MessageActionRow()
      .addComponent(on.setEmoji("✅"))
      .addComponent(off.setEmoji("🇽"))
    let mentionable = roles[0]
    // var thing = mentionable.setMentionable(false, "so as not to wake")
    // thing.catch((reason) => {log("an error occored", reason)})
    // await thing
    let rr = await channels[0].send(`hi ${mentionable}`, row)
    // var thing = mentionable.setMentionable(mentionable, "so as not to wake")
    // thing.catch((reason) => {log("an error occored", reason)})
    // await thing
    keyv.set(rr.id, {on: "on", off: "off", role: roles[0].id, message: rr.id})
  }
}