import DiscordWrapper from './Integrations/DiscordWrapper.js';
// import MusicBot from './MusicBot'
import Discord from 'discord.js';
import Config from '../config.js'

import express from 'express';
//const express = require("express")
const server = express()
server.all("/", (req, res) => {
   res.send("Bot is running!")
})
function keepAlive() {
   server.listen(3000, () => {
      console.log("Server is ready.")
   })
}
keepAlive()

// If I use relepit
if(Config.key==undefined){
   Config.key = process.env.TOKEN;
}

var gangDatapath = './crimsonGang.json';
// Our main application, the bot
import GangBot from '../src/GangBot.js';
const gangBot = new GangBot(gangDatapath);
console.log(Config.key)
const discordBot = new DiscordWrapper(gangBot, new Discord.Client(), Config.key);
discordBot.start()
// TODO implement this

// const mediaFetcher = new MediaFetcher(YouTubeDL, null);
// const musicBot = new MusicBot(mediaFetcher);
// const discordMusicBot = new DiscordWrapper(musicBot, new Discord.Client(), Config.key);

// discordMusicBot.start();