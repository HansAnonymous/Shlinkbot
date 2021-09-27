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

## Requirements

Node.js

Node packages: ascii-table, cheerio, discord-buttons, discord.js, puppeteer, colors

## Running locally

1. Clone the repository through your preferred method. Eg:
`git clone https://github.com/HansAnonymous/ShlinkBot.git`
2. Make sure node.js is installed then run `npm i`
3. Configure the bot in `botconfig/config.json`
4. Run `npm start`
