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
    msg.channel.send('Try again, you need to tell me some info first\n```json\n!role add "- getting my attention"\n#channel "- the channel you want it in"\n@role "- the role you want to grant (must already exist)"\nEpic role! "- the text on the role button"```\nexample button:', button)
  } else {
    let roles = await msg.mentions.roles.array()
    let channels = await msg.mentions.channels.array()
    let on = new buttons.MessageButton()
      .setID("on")
      .setDisabled(true)
      .setLabel("args[args.length]")
      .setStyle("grey")
    let off = on.setID("off")
    let row = new buttons.MessageActionRow()
      .addComponent(on)
      .addComponent(off)
    let mentionable = roles[0]
    await mentionable.setMentionable(false, "so as not to wake")
    await channels[0].send(`hi ${mentionable}`, { buttons: [on, off] })
    mentionable.setMentionable(mentionable, "so as not to wake")
  }
}