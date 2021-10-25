const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const tokens = require("../../botconfig/tokens.json");
const ee = require("../../botconfig/embed.json");
const { MessageButton } = require('discord-buttons');
const { randomQuip } = require("../../handlers/functions")
const fs = require("fs");

//const browser = require("../../handlers/browser.js")

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const cookies = [{
    'name': '_shlinkedin_key',
    'value': tokens.shlinkedin_key
}]

var profile = {
    premium: false,
    moderator: false,
    verified: false,
    thumbnail: "",
    created: "",
    displayName: "",
    username: "",
    url: "",
    tagline: "",
    description: "",
    soundtrack: "",
    grade: "",
    networth: "",
    career: "",
    shlinks: "",
    views: "",
    lastUpdate: ""
}

module.exports = {
    name: "profile",
    aliases: ["p", "account", "user", "u"],
    description: "Get the profile of a ShlinkedIn user.",
    category: "Utilities",
    cooldown: 5,
    usage: "profile <username> [forceUpdate: false|true]",
    run: async (client, message, args, user, text, prefix) => {
        try{
            if(args[0]) {
                let forceUpdate = (args[1] == "true");
                profile.username = args[0].toLowerCase();
                
                let newSearch = (!fs.existsSync(`./data/${profile.username}.json`));

                let needsUpdate = true;
                if(!newSearch) {
                    const data = fs.readFileSync(`./data/${profile.username}.json`, 'utf8');
                    profile = JSON.parse(data);
                    needsUpdate = ((Date.now() - profile.lastUpdate) > (config.cacheTime * 60 * 60 * 1000)) ? true : false;
                }

                if(newSearch || needsUpdate || forceUpdate) {
                    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']})
                    const page = await browser.newPage();

                    await page.goto('https://shlinkedin.com/home');
                    await page.setCookie(...cookies);
                    profile.url = `https://shlinkedin.com/sh/${profile.username}`
                    const response = await page.goto(profile.url);
                    if(response.status() == 500) {
                        message.reply(new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter(ee.footertext, ee.footericon)
                            .setTitle('❌ No profiles found!')
                            .setDescription(`No profile with username: \`${profile.username}\` found!`)
                        )
                    } else {
                        const html = await page.content();
                        const $ = cheerio.load(html);
                        profile.premium = $('main > div.relative > div > div > div > div.flex.justify-center > div > div.font-bold > div > div > span.tooltip').length ? true : false;
                        profile.moderator = $('main > div.relative > div > div.bg-white > div.pt-2.p-5 > div.flex.justify-center > div > div > div > div.inline-flex.text-gray-400 > svg').length ? true : false;
                        profile.verified = $('main > div.relative > div > div.bg-white > div.pt-2.p-5 > div.flex.justify-center > div > div.font-bold > div > div:nth-child(2) > svg').length ? true : false;
                        if(profile.premium) {
                            profile.career = $('main > div.relative > div > div:nth-child(3) > h5 > span').text().trim();
                            profile.networth = $('main > div.relative > div > div:nth-child(5) > dl > div > div > dd > a:nth-child(1)').text()
                            profile.shlinks =  $('main > div.relative > div > div:nth-child(5) > dl > a:nth-child(2) > div > div > dd').text().trim();
                            profile.views = $('main > div.relative > div > div:nth-child(5) > dl > a:nth-child(3) > div > div > dd').text().trim();
                            profile.soundtrack = ('' + $('#soundtrack').attr('src')).replace('embed/', '').replace('?theme=0', '');
                        } else {
                            profile.career = $('main > div.relative > div > div:nth-child(2) > h5 > span').text().trim();
                            profile.networth = $('main > div.relative > div > div:nth-child(4) > dl > div > div > dd > a:nth-child(1)').text()
                            profile.shlinks = $('main > div.relative > div > div:nth-child(4) > dl > a:nth-child(2) > div > div > dd').text().trim();
                            profile.views = $('main > div.relative > div > div:nth-child(4) > dl > a:nth-child(3) > div > div > dd').text().trim();
                        }
                        profile.thumbnail = 'https:' + ('' + $('main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center.relative > div > img').prop('src')).replace("https:", "");
                        //profile.created = $('main > div.relative > div > div.bg-white > div.px-5.ml-3.flex.items-start.text-xs.pb-6.mt-3 > span.text-gray-700.ml-2').text().replace('\n', ' ').replace(/\s\s+/g, ' ');
                        profile.created = $('main > div.relative > div > div.bg-white > div.flex.justify-between > div > span.text-gray-700.ml-2').text().replace('\n', ' ').replace(/\s\s+/g, ' ');
                        profile.displayName = $('body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > div.font-bold').text().split('\n')[2];
                        profile.tagline = $('body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > div > span.text-gray-700').text()
                        let description = $('body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.px-5.mt-1 > div > span.text-gray-700.italic').text()
                        profile.description = (description.length < 51) ? description : description.substring(0, 50) + '...';
                        profile.grade = $('body > div.pt-16 > div > main > div.relative > div > div.bg-white.shadow > div.pt-2.p-5 > div.flex.justify-center > div.ml-3.mt-2 > p.text-lg').text().trim();
                    }

                    profile.lastUpdate = Date.now();
                    const data = JSON.stringify(profile, null, 4);
                    fs.writeFileSync(`./data/${profile.username}.json`, data, 'utf8');
                }

                let button1 = new MessageButton()
                    .setStyle('url')
                    .setLabel('Send them SP!')
                    .setURL(`https://www.shlinkedin.com/sh/${profile.username}/points`)

                let button2 = new MessageButton()
                    .setStyle('url')
                    .setLabel('Give them a Review!')
                    .setURL(`https://www.shlinkedin.com/sh/${profile.username}/testimonials/new`);

                let button3 = new MessageButton()
                    .setStyle('url')
                    .setLabel('Endorse them!')
                    .setURL(`https://www.shlinkedin.com/sh/${profile.username}/endorsements/new`);

                //const timesince = Date.now() - profile.lastUpdate;
                //const timetext = (timesince < 60 * 1000) ? "\nLast updated: Now" : "\nLast updated: " + Math.floor(timesince/(60 * 60 * 1000)) + " hours, " + Math.floor((timesince/(60 * 1000))%60) + " minutes ago";
                //const timetext = ` <t:${profile.lastUpdate}:R>`

                let embedDisplayName = profile.moderator ? profile.displayName + ' :shield:' : profile.displayName;
                embedDisplayName = profile.premium ? embedDisplayName + ' <:platinum:902113910365249576>' : embedDisplayName;
                embedDisplayName = profile.verified ? embedDisplayName + ' <:verified:902127233144078356>' : embedDisplayName;
                
                return message.reply(randomQuip(), new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Retrieving Shlinkfiles...`)
                ).then( msg => {
                    let profileEmbed = new MessageEmbed()
                        .setColor(ee.color)
                        .setThumbnail(profile.thumbnail)
                        .setFooter(profile.created, ee.footericon)
                        .setTitle(embedDisplayName)
                        .setURL(profile.url)
                        .setAuthor(profile.tagline)
                        .setDescription(profile.description)
                        .setTimestamp(profile.lastUpdate);
                    if(profile.premium) {
                        profileEmbed.addField('Soundtrack', `[Spotify](${profile.soundtrack})`, false)
                    }
                    profileEmbed
                        .addField('Username', profile.username, true)
                        .addField('Life Grade', profile.grade, true)
                        .addField('Net Worth', profile.networth, true)
                        .addField('Career Progress', profile.career, true)
                        .addField('Shlinks', profile.shlinks, true)
                        .addField('Profile Views', profile.views, true),
                        { buttons: [ button1, button2, button3 ]}

                    msg.edit(profileEmbed);
                });
            } else {
                return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`❌ ERROR | Please specify a profile`)
                .setDescription(`\`\`\`No profile sepicified. Usage: ${config.prefix}profile <username>\`\`\``)
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