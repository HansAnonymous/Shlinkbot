const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { randomQuip } = require('../../handlers/functions')

const changelog = [
    {
        name: "Update 4",
        description: `Code is now open source!
            \`\`\`md
1. Cleaned up code.
2. Added info/about command.
3. Most commands now have a random quip as a response!
4. Config now hosts list of random quips.
5. Separated tokens and bot configurations.
\`\`\``
    },{
        name: "Update 3",
        description: `I finally decided to add some more features:
            \`\`\`md
1. Add Career progression to profile command.
2. Add 3 buttons to profile command to 'Send SP', 'Give Review', and 'Give Endorsement'.
3. Added changelog command because it's good practice and so people can see what's new (i guess).\`\`\``
    },{
        name: "Update 0.0.2",
        description: `\`\`\`md
Quick bug fix to support externally hosted profile pictures. Darn you Jack Evangelizer!!!\`\`\``
    },{
        name: "Update 0.0.0.01",
        description: `Initial Release!
            \`\`\`md
1. Profile Command
2. Leaderboard Command
3. Jab/Ping Command
4. Help Command\`\`\``
    }
]
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
                    embed.setDescription(`${changelog[normQuery].description}`)
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