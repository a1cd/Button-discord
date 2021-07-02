const Keyv = require('keyv');
const {command} = require('command-based-discord');
const Discord = require('discord.js');
require('dotenv').config()
const add = require('./src/add');

module.exports = (bot) => {
  require('dotenv').config()
  bot.on("clickButton", async (btn) => {
    /**
     * @type {MessageComponent}
     */
    const button = btn
    const keyv = new Keyv('mongodb://localhost:27017/'+process.env.DATABASE, {adapter: "mongodb", namespace: button.guild.id})
    keyv.get(button.message.id)
    .then(async (info) => {
      let role = await button.guild.roles.fetch(info.role)
      await button.clicker.fetch()
      if (button.id == info.on) {
        console.log("before add");
        await button.clicker.member.roles.add(role.id, "button roles")
        console.log("after add");
        button.defer()
      } else if (button.id == info.off) {
        console.log("before remove");
        await button.clicker.member.roles.remove(role.id, "button roles")
        console.log("after remove");
        button.defer()
      }
    })
    .catch((reason)=>{console.log(reason.stack);console.error("oops", reason)})
  })

  let cmd = new command({name: "!", "help": "help message", subcommands: [
    new command({name: "add", help: "add a role", commandFunction: add})
  ]})
  return cmd
}