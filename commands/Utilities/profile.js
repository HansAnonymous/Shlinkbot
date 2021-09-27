const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const tokens = require("../../botconfig/tokens.json");
const ee = require("../../botconfig/embed.json");
const { MessageButton } = require('discord-buttons');
const { randomQuip } = require("../../handlers/functions")

//const browser = require("../../handlers/browser.js")

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const cookies = [{
    'name': '_shlinkedin_key',
    'value': tokens.shlinkedin_key
}]

module.exports = {
    name: "profile",
    aliases: ["p", "account"],
    description: "Get the profile of a ShlinkedIn user.",
    category: "Utilities",
    cooldown: 5,
    usage: "profile <username>",
    run: async (client, message, args, user, text, prefix) => {
        try{
            if(args[0]) {
                const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']})
                const page = await browser.newPage();

                await page.goto('https://shlinkedin.com/home');
                await page.setCookie(...cookies);
                const username = args[0].toLowerCase();
                const url = `https://shlinkedin.com/sh/${username}`
                const response = await page.goto(url);
                if(response.status() == 500) {
                    message.reply(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle('❌ No profiles found!')
                        .setDescription(`No profile with username: \`${username}\` found!`)
                    )

                } else {
                    const html = await page.content();
                    const $ = cheerio.load(html);
                    const pfp = 'body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div > img'
                    const created = 'main > div.relative > div > div.bg-white > div.px-5.ml-3.flex.items-start.text-xs.pb-6.mt-3 > span.text-gray-700.ml-2'
                    const displayName = 'body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > div.font-bold'
                    const tagline = 'body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > div > span.text-gray-700'
                    const description = 'body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.px-5.mt-1 > div > span.text-gray-700.italic'
                    const grade = 'body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > p.text-lg'
                    const networth = 'main > div.relative > div > div:nth-child(4) > dl > div > div > dd > a:nth-child(1)'
                    const career = 'main > div.relative > div > div:nth-child(2) > h5 > span'
                    const shlinks = 'main > div.relative > div > div:nth-child(4) > dl > a:nth-child(2) > div > div > dd'
                    const views = 'main > div.relative > div > div:nth-child(4) > dl > a:nth-child(3) > div > div > dd'
                    
                    let button1 = new MessageButton()
                        .setStyle('url')
                        .setLabel('Send them SP!')
                        .setURL(`https://www.shlinkedin.com/sh/${username}/points`)

                    let button2 = new MessageButton()
                        .setStyle('url')
                        .setLabel('Give them a Review!')
                        .setURL(`https://www.shlinkedin.com/sh/${username}/testimonials/new`);

                    let button3 = new MessageButton()
                        .setStyle('url')
                        .setLabel('Endorse them!')
                        .setURL(`https://www.shlinkedin.com/sh/${username}/endorsements/new`);

                    message.reply(randomQuip(), new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(`Retrieving Shlinkfiles...`)
                    ).then( msg => {
                        msg.edit(new MessageEmbed()
                        .setColor(ee.color)
                        .setThumbnail('https:' + $(pfp).attr('src').replace("https:", ""))
                        .setFooter($(created).text().replace('\n', ' ').replace(/\s\s+/g, ' '), ee.footericon)
                        .setTitle($(displayName).text().split('\n')[2])
                        .setURL(url)
                        .setAuthor($(tagline).text())
                        .setDescription(($(description).text().length < 51) ? $(description).text() : $(description).text().substring(0,50) + '...')
                        .addField('Life Grade', $(grade).text(), true)
                        .addField('Net Worth', $(networth).text(), true)
                        .addField('Career Progress', $(career).text(), true)
                        .addField('Shlinks', $(shlinks).text(), true)
                        .addField('Profile Views', $(views).text(), true),
                        { buttons: [ button1, button2, button3 ]}
                        );
                    })
                }
            } else {
                return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Please specify a profile`)
                .setDescription(`\`\`\`No profile sepicified. Usage: !profile <username>\`\`\``)
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