import DiscordWrapper from './Integrations/DiscordWrapper'
import MusicBot from './MusicBot'
import Discord from 'discord.js'
import Config from '../config.json'

import gangData from './crimsonGang.js'
// Our main application, the bot
import GangBot from '../src/GangBot'
gangBot = new GangBot(gangData);
gangBot.start()
// TODO implement this

const mediaFetcher = new MediaFetcher(YouTubeDL, null);
const musicBot = new MusicBot(mediaFetcher);
const discordMusicBot = new DiscordWrapper(musicBot, new Discord.Client(), Config.key);

discordMusicBot.start();