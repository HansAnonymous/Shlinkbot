const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const tokens = require("../../botconfig/tokens.json");
const ee = require("../../botconfig/embed.json");
const { randomQuip } = require("../../handlers/functions")
const fs = require("fs");

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const cookies = [{
    'name': '_shlinkedin_key',
    'value': tokens.shlinkedin_key
}]

const mapping = {
    ads : ["ads", "advertisements", "advertisements", "ad", "adds", "add"],
    claps : ["claps", "clap"],
    hottest : ["hottest", "hot"],
    pr : ["pr", "posts", "reaction", "reactions", "postreactions", "post reactions"],
    shlinks : ["shlinks", "shlink", "shlinked", "sh"],
    wealth : ["wealth", "rich", "richest", "money"]
};

var leaderboard = {
    profiles: [],
    lastUpdate: 0
};

module.exports = {
    name: "leaderboard",
    aliases: ["top"],
    description: "Get the thought leaders of our generation.",
    category: "Utilities",
    cooldown: 5,
    usage: "leaderboard <category> [forceUpdate: false|true]",
    run: async (client, message, args, user, text, prefix) => {
        try{
            if(args[0]) {
                let forceUpdate = (args[1] == "true");
                const arg = args[0].toLowerCase();

                leaderboard = { profiles: [], lastUpdate: 0 };
                let url;
                let category;
                let categoryShort;
                if(mapping.ads.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Ads';
                    category = 'Unique Clicks';
                    categoryShort = 'topAds'
                    slug = 'Unique clicks on your ad.'
                } else if(mapping.claps.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Claps';
                    category = 'Claps'
                    categoryShort = 'topClaps'
                    slug = 'Unique headline claps.'
                } else if(mapping.hottest.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Hottest';
                    category = 'Profile Views'
                    categoryShort = 'topHottest'
                    slug = 'Unique profile views, from everyone but yourself.'
                } else if(mapping.pr.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Post+Reactions';
                    category = 'Reactions'
                    categoryShort = 'topReactions'
                    slug = 'The most prestigous ranking - the number of unique post reactions.'
                } else if(mapping.shlinks.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Shlinks';
                    category = 'Shlinks'
                    categoryShort = 'topShlinks'
                    slug = 'Total number of shlinked connections'
                } else if(mapping.wealth.includes(arg)) {
                    url = 'https://shlinkedin.com/leaders?curr_category=Wealth';
                    category = 'Net Worth'
                    categoryShort = 'topWealth'
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
                
                let newSearch = (fs.existsSync(`./data/${categoryShort}.json`)) ? false : true;

                let needsUpdate;
                if(!newSearch) {
                    const data = fs.readFileSync(`./data/${categoryShort}.json`, 'utf8');
                    leaderboard = JSON.parse(data);
                    needsUpdate = ((Date.now() - leaderboard.lastUpdate) > (config.cacheTime * 60 * 60 * 1000)) ? true : false;
                }

                if(newSearch || needsUpdate || forceUpdate) {
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
                        const html = await page.content();
                        const $ = cheerio.load(html);

                        for (let i = 1; i < 9; i++) {
                            let profile = {
                                rank: $(`table > tbody > tr:nth-child(${i}) > td:nth-child(1) > div > span`).text().replace('\n', '').replace(/\s\s+/g, ''),
                                name: $(`table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > div.ml-4 > a > div.text-sm.font-medium.text-gray-900`).text().replace('\n', '').replace(/\s\s+/g, ''),
                                url: 'https://shlinkedin.com/' + $(`table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > div.ml-4 > a`).attr('href'),
                                category: $(`table > tbody > tr:nth-child(${i}) > td.px-6.py-4.whitespace-nowrap.text-sm.text-blue-600.font-bold.text-center`).text().replace('\n', '').replace(/\s\s+/g, '').replace('\n','')
                            }
                            leaderboard.profiles.push(profile);
                        }
                        leaderboard.lastUpdate = Date.now();

                        const data = JSON.stringify(leaderboard, null, 4);
                        fs.writeFileSync(`./data/${categoryShort}.json`, data, 'utf8');
                    }
                }
                const timesince = Date.now() - leaderboard.lastUpdate;
                const timetext = (timesince < 60 * 1000) ? "\nLast updated: Now" : "\nLast updated: " + Math.floor(timesince/(60 * 60 * 1000)) + " hours, " + Math.floor((timesince/(60 * 1000))%60) + " minutes ago";
                const embed = new MessageEmbed();
                embed.setColor(ee.color);
                embed.setFooter(ee.footertext + timetext, ee.footericon);
                embed.setTitle('Your thought leaders of today');
                embed.setURL(url)
                embed.setDescription(slug);
                for (let i = 0; i < 8; i++) {
                    embed.addField("Rank", leaderboard.profiles[i].rank, true);
                    embed.addField("Profile", `[${leaderboard.profiles[i].name}](${leaderboard.profiles[i].url})`, true);
                    embed.addField(category, leaderboard.profiles[i].category, true)
                }

                message.reply(randomQuip(), new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle('Retrieving Shlinkfiles...')
                ).then(msg => {
                    msg.edit(embed);
                })

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