// { 
//   name:'Test Daemons',
//   cities:[
//      {name:'Anvilguard',
//      initiates:1,
//      apprentices:1,
//      leader:1,
//      comms:0,
//      inTransit:false,
//      budget:0},
//      {Hammerhall,}
//   ]
// }


export default class GangBot {
   constructor(gangData) {
    this.gangData = gangData
   }
   // Getters
   isEmptyCity(){
     // 
     var foundLeaderless = false
     this.gangData.cities.forEach(city => {
       if(city.leader == 0){
        foundLeaderless = true
       }
     });
     return foundLeaderless
   }
   // Setters
   addToEmptyCity(sentLeader){
    // 
    var updatedCity = false
    this.gangData.cities.forEach(city => {
      if(city.leader == 0){
        city.leader = sentLeader
        updatedCity = city
      }
    });
    return updatedCity
  }

   // Method
   newWeek(){
     var outcome =''
     this.gangData.cities.forEach(city => {
       city.initiates -= Math.random(1,6)
       city.initiates += (1 + Math.random(1,6))
       let upgrades = Math.random(1,3)

       // if theres room in the city
       if(((city.initiates/20) > city.leader) && city.apprentices > 0 ){ 
        upgrades -= 1
        city.apprentices -= 1
        city.leader += 1
       } 

       // if another city needs a leader
       if ((upgrades > 0) && this.isEmptyCity()){
         // add leader to other city
         upgrades -= 1
         city.apprentices -= 1
         addToEmptyCity(1)
       }
      });
      return outcome;

   }
 
   handleMessage(message) {
      const { chatRoom, content } = message;
      if(content === '!ping'){
        chatRoom.sendMessage('pong');
      }
      if(content === '!listCities'){
        var response = ''
        this.gangData.cities.forEach(city => {
          response += (city.name)
          response += (', ')
        });
        chatRoom.sendMessage(response);
      }
   
      if(content === '!data'){
        chatRoom.sendMessage(this.gangData);
      }
   
      if(content.slice(0,9) === '!addCity '){
        var newName = content.slice(9, content.length)

        // 
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
    
      if(content === '!newWeek'){
        response = this.newWeek()

        chatRoom.sendMessage(response);
      }
    }
 }