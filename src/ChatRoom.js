// src/ChatRoom.js
export default class ChatRoom {
   constructor(sendMessage, joinVoiceChannel) {
     this.sendMessage = sendMessage;
     this.joinVoiceChannel = joinVoiceChannel;
   }
 }
 export class VoiceChannel {
   constructor(streamAudio) {
     this.streamAudio = streamAudio;
   }
 }