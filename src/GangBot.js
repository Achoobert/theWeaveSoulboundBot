// { 
//   name:'Test Daemons',
//   cities:[
//      {name:'Anvilguard',
//      initiates:1,
//      apprentices:1,
//      leader:1,
//      comms:0},
//      {Hammerhall,}
//   ]
// }


export default class GangBot {
   constructor(gangData) {
    this.gangData = gangData
   }
 
   handleMessage(message) {
      const { chatRoom, content } = message;
      if(content === '!ping'){
        chatRoom.sendMessage('pong');
      }
      if(content === '!data'){
        chatRoom.sendMessage(this.gangData);
      }
   
      if(content.slice(0,9) === '!addCity '){
        var newName = content.slice(9, content.length)

        this.gangData.cities.push(
          {
            name:newName,
            initiates:0,
            apprentices:0,
            leader:0,
            comms:0
          })

          newName = this.gangData.cities[2].name

        chatRoom.sendMessage(`Added ${newName}`);
      }
    }
 }