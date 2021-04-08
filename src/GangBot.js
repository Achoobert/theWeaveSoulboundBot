
export default class MusicBot {
   constructor() {
 
   }
 
   handleMessage(message) {
      const { chatRoom, content } = message;
      if(content === '!ping'){
        chatRoom.sendMessage('pong');
      }
    }
 }