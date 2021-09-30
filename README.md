# ShlinkBot

## Features

Default prefix: `.`

### Commands

* `.profile <username>` - Grabs a profile from ShlinkedIn
* `.leaderboard <category>` - Fetches the top 8 from the specified category
* `.jab` - Send a business jab to the bot (ping)
* `.help` - Shows help menu
* `.changelog [version]` - Shows bot's changelog
* `.uptime` - How long the bot has been running
* `.roadmap` - [Planned Features](https://github.com/HansAnonymous/ShlinkBot/README.md#roadmap)

## Requirements

Node.js

Node packages: ascii-table, cheerio, discord-buttons, discord.js, puppeteer, colors

## Running locally

1. Clone the repository through your preferred method. Eg:
`git clone https://github.com/HansAnonymous/ShlinkBot.git`
2. Make sure node.js is installed then run `npm i`
3. Configure the bot in `botconfig/config.json`
4. Run `npm start`

## Roadmap

1. Search by display name
2. All time best posts(?)
3. Secret Feature #1
4. Discord Quick Commands
5. Add badges to profile command
6. Customization commands (prefix, cooldowns, caching)
