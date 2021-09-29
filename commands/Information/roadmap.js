const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { duration, randomQuip } = require("../../handlers/functions")

module.exports = {
    name: "roadmap",
    category: "Information",
    aliases: ["plans"],
    cooldown: 5,
    usage: "roadmap",
    description: "Lists planned features for the bot.",
    run: async (client, message, args, user, text, prefix) => {
    try{
      message.reply(randomQuip(), new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`🛣 Shlinkbot Roadmap`)
        .setURL(`https://github.com/HansAnonymous/ShlinkBot/README.md#roadmap`)
        .addField('Feature #1', "Leaderboard Caching")
        .addField('Feature #2', "Search by display name")
        .addField('Feature #3', 'All time best posts?')
        .addField('Secret Feature #1', "🤫")
        .addField('Feature #4', "Quick commands")
        .addField('Feature #5', "Add badges to profile command")

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