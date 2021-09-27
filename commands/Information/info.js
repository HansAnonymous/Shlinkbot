const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { duration, randomQuip } = require("../../handlers/functions")

module.exports = {
    name: "info",
    category: "Information",
    aliases: ["about"],
    cooldown: 5,
    usage: "info",
    description: "Shows information about the bot.",
    run: async (client, message, args, user, text, prefix) => {
    try{
      message.reply(randomQuip(), new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Shlinkbot for ShlinkedIn`)
        .setURL(`https://github.com/HansAnonymous/ShlinkBot`)
        .setThumbnail(client.user.avatarURL)
        .addField(`Information`, `[**Invite**](https://discord.com/api/oauth2/authorize?client_id=889284352595337236&permissions=8&scope=bot)\nVersion: ${config.latest_version}`, false)
        .addField(`Author`, `💻Created by <@168216897450541056>\n[☕ Buy me a coffee](https://www.buymeacoffee.com/hansanonymous)`)
        .addField(`Uptime`, `${duration(client.uptime)}`, true),
      );
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