import DiscordWrapper from './Integrations/DiscordWrapper'
import MusicBot from './MusicBot'
import Discord from 'discord.js'
import Config from '../config.json'

const mediaFetcher = new MediaFetcher(YouTubeDL, null);
const musicBot = new MusicBot(mediaFetcher);
const discordMusicBot = new DiscordWrapper(musicBot, new Discord.Client(), Config.key);

discordMusicBot.start();