// src/Message.js
export default class Message {
   constructor(chatRoom, content, author){
     this.author = author;
     this.chatRoom = chatRoom;
     this.content = content;
   }
 }