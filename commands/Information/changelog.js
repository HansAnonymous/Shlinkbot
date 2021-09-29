const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { randomQuip } = require('../../handlers/functions')
const changelog = require('../../botconfig/changelog.json')

const latestVersion = config.latest_version;

module.exports = {
    name: "changelog",
    aliases: ["changes", "version", "versions", "update", "updates", "log", "v", "ver", "cl"],
    description: "Find out about the most recent versions of the bot.",
    category: "Information",
    cooldown: 3,
    usage: `changelog [optional: version# from 1 to ${changelog.length}]`,
    run: async (client, message, args, user, text, prefix) => {
        try{
            const embed = new MessageEmbed();
            embed.setFooter(ee.footertext, ee.footericon);
            
            if(args[0]) {
                const query = parseInt(args[0]);
                const normQuery = changelog.length - query;
                if(Number.isInteger(normQuery) && normQuery >= 0 && normQuery <= (changelog.length)) {
                    let latest = (query == changelog.length) ? ` (Latest)` : ``;
                    embed.setColor(ee.color);
                    embed.setTitle(`📜 Shlinkbot Changelog`);
                    embed.setAuthor(`${changelog[normQuery].name + latest}`);
                    embed.setDescription(`${changelog[normQuery].description.join('\n')}`)
                    //embed.addField(`${changelog[normQuery].name + latest}`, `${changelog[normQuery].description}`)
                } else {
                    embed.setColor(ee.wrongcolor);
                    embed.setTitle(`❌ Invalid changelog index!`);
                    embed.setDescription(`Please input a proper changelog index!\n(Psst, hint: Valid versions are from: \`1 to ${changelog.length}\`!)`);
                }
            } else {
                embed.setColor(ee.color);
                embed.setTitle(`📜 Shlinkbot Changelog`);
                embed.setAuthor(`${latestVersion}`);
                for(let i = 0; i < Math.min(changelog.length, 3); i++) {
                    embed.addField(changelog[i].name, changelog[i].description);
                }
            }
            return message.reply(randomQuip(), embed);
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