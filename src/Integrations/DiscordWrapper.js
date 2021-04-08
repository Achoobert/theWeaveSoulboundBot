import ChatRoom, {VoiceChannel} from '../ChatRoom'
import Message from '../Message'

export default class DiscordWrapper {
  constructor(bot, discordClient, key){
    this.bot = bot;
    this.discordClient = discordClient;
    this.key = key;

    this.discordClient.on('message', this._handleMessage.bind(this));
  }

  start() {
    this.discordClient.login(this.key);
  }

  _handleMessage(discordMessage) {
    this.bot.handleMessage(this._messageFactory(discordMessage));
  }

  //Transform a discordMessage into a Message object
  _messageFactory(discordMessage) {

    const sendMessage = (messageContent) => {
      discordMessage.channel.sendMessage(messageContent);
    };

    const joinVoiceChannel = async() => {
      const channel = await discordMessage.member.voiceChannel.join();
      const playStream = (stream) => {
        channel.playStream(stream);
      };

      return new VoiceChannel(playStream)
    }

    const chatRoom = new ChatRoom(sendMessage, joinVoiceChannel);
    const message = new Message(chatRoom, discordMessage.content);

    return message;
  }
}