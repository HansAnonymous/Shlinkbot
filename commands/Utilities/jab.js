const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "jab",
    category: "Utilities",
    aliases: ["latency", "ping"],
    cooldown: 2,
    usage: "jab",
    description: "Send a business jab to the bot",
    run: async (client, message, args, user, text, prefix) => {
    try{
      message.reply('You sent a jab!', new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`👉 Sending business jab...`)
      ).then(msg=>{
        msg.edit(new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`👉 Dink! Jab took \`${Math.round(client.ws.ping)}ms\``)
          .setDescription('Oi! What was that for? I\'m a bot!')
        );
      })
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
