import DiscordWrapper from './Integrations/DiscordWrapper.js';
// import MusicBot from './MusicBot'
import Discord from 'discord.js';
import Config from '../config.json';

var gangData = ('./crimsonGang.js');
// Our main application, the bot
import GangBot from '../src/GangBot.js';
const gangBot = new GangBot(gangData);
const discordBot = new DiscordWrapper(gangBot, new Discord.Client(), Config.key);
discordBot.start()
// TODO implement this

// const mediaFetcher = new MediaFetcher(YouTubeDL, null);
// const musicBot = new MusicBot(mediaFetcher);
// const discordMusicBot = new DiscordWrapper(musicBot, new Discord.Client(), Config.key);

// discordMusicBot.start();