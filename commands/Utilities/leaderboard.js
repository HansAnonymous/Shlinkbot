const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
//const { functionName } = require("../../handlers/functions")

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const cookies = [{
    'name': '_shlinkedin_key',
    'value': config.shlinkedin_key
}]

const mapping = {
    ads : ["ads", "advertisements", "advertisements", "ad", "adds", "add"],
    claps : ["claps", "clap"],
    hottest : ["hottest", "hot"],
    pr : ["pr", "posts", "reactions", "postreactions", "post reactions"],
    shlinks : ["shlinks", "shlink", "shlinked", "sh"],
    wealth : ["wealth", "rich", "richest", "money"]
};

module.exports = {
    name: "leaderboard",
    aliases: ["top"],
    description: "Get the thought leaders of our generation.",
    category: "Utilities",
    cooldown: 5,
    usage: "leaderboard <category>",
    run: async (client, message, args, user, text, prefix) => {
        try{
            if(args[0]) {
                const arg = args[0].toLowerCase();
                let url;
                let category;
                if(mapping.ads.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Ads';
                    category = 'Unique Clicks';
                    slug = 'Unique clicks on your ad.'
                } else if(mapping.claps.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Claps';
                    category = 'Claps'
                    slug = 'Unique headline claps.'
                } else if(mapping.hottest.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Hottest';
                    category = 'Profile Views'
                    slug = 'Unique profile views, from everyone but yourself.'
                } else if(mapping.pr.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Post+Reactions';
                    category = 'Reactions'
                    slug = 'The most prestigous ranking - the number of unique post reactions.'
                } else if(mapping.shlinks.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Shlinks';
                    category = 'Shlinks'
                    slug = 'Total number of shlinked connections'
                } else if(mapping.wealth.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Wealth';
                    category = 'Net Worth'
                    slug = 'Total number of ShlinkPoints'
                } else {
                    return message.reply('❌ Unknown category!', new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`🏆 Leaderboard Categories`)
                        .addField('👁 Ads', 'Unique clicks on your ad.\n`ads`, `ad`, `advertisements`', true)
                        .addField('👏 Claps', 'Unique headline claps.\n`claps`, `clap`', true)
                        .addField('🔥 Hottest', 'Unique profile views, from everyone but yourself.\n`hottest`, `hot`', true)
                        .addField('🪧 Post Reactions', 'The most prestigous ranking - the number of unique post reactions.\n`pr`, `posts`, `reactions`', true)
                        .addField('🤝 Shlinks', 'Total number of shlinked connections.\n`shlinks`, `sh`', true)
                        .addField('🥇 Wealth', 'Total number of ShlinkPoints\n`wealth`, `rich`, `money`', true)
                    );
                }
                
                const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']})
                const page = await browser.newPage();

                await page.goto('https://shlinkedin.com/home');
                await page.setCookie(...cookies);
                const response = await page.goto(url);

                if(response.status() == 500) {
                    message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle('❌ Unable to load page')
                        .setDescription(`ShlinkedIn may be down! If it's working, please ping @HansAnonymous#1007!`)
                    )
                } else {
                    const embed = new MessageEmbed();
                    embed.setColor(ee.color);
                    embed.setFooter(ee.footertext, ee.footericon);
                    embed.setTitle('Your thought leaders of today');
                    embed.setDescription(slug);
                    
                    const html = await page.content();
                    const $ = cheerio.load(html);

                    for (let i = 1; i < 9; i++) {
                        let profile = {
                            rank: $(`table > tbody > tr:nth-child(${i}) > td:nth-child(1) > div > span`).text().replace('\n', '').replace(/\s\s+/g, ''),
                            name: $(`table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > div.ml-4 > a > div.text-sm.font-medium.text-gray-900`).text().replace('\n', '').replace(/\s\s+/g, ''),
                            category: $(`table > tbody > tr:nth-child(${i}) > td.px-6.py-4.whitespace-nowrap.text-sm.text-blue-600.font-bold.text-center`).text().replace('\n', '').replace(/\s\s+/g, '')
                        }
                        embed.addField("Rank", profile.rank, true);
                        embed.addField("Profile", profile.name, true);
                        embed.addField(category, profile.category, true)
                    }

                    message.reply('Randomized phrase goes here', new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle('Retrieving Shlinkfiles...')
                    ).then(msg => {
                        msg.edit(embed);
                    })
                }
            } else {
                return message.reply('Here are a list of categories!', new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`🏆 Leaderboard Categories`)
                    .addField('👁 Ads', 'Unique clicks on your ad.\n`ads`, `ad`, `advertisements`', true)
                    .addField('👏 Claps', 'Unique headline claps.\n`claps`, `clap`', true)
                    .addField('🔥 Hottest', 'Unique profile views, from everyone but yourself.\n`hottest`, `hot`', true)
                    .addField('🪧 Post Reactions', 'The most prestigous ranking - the number of unique post reactions.\n`pr`, `posts`, `reactions`', true)
                    .addField('🤝 Shlinks', 'Total number of shlinked connections.\n`shlinks`, `sh`', true)
                    .addField('🥇 Wealth', 'Total number of ShlinkPoints\n`wealth`, `rich`, `money`', true)
                );
            }
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