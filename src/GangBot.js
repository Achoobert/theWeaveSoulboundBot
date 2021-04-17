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
   addToEmptyCity(sentLeader,sender){
    // 
    var updatedCity = false
    this.gangData.cities.forEach(city => {
      if(city.leader == 0){
        city.leader = sentLeader
        city.inTransit = true
        // if comms and budget, add recruit endeavor
        if(sender.comms && this.gangData.budget>200){
          this.gangData.budget -= 200
          leaderDice = 12
          while (leaderDice >0) {
            if(Math.random(1,6)>=4){
              city.initiates +=1
            }
            leaderDice--
          }
        }
        updatedCity = city
      }
    });
    return updatedCity
  }

   // Method
   // parent method for new week
   // iterates each city, TODO iterates gangs
   newWeek(){
     var outcome ='done'
     this.gangData.cities.forEach(city => {
       // 
       if(city.initiates<6){
         city = this.safeRoll(city)
       } else {
         city = this.roll(city)
       }
       // 
       city = this.spendUpgrades(city)
      });
      return outcome;
   }
   // Safe upgrade roll
   safeRoll(city){
     city.initiates += (1 + Math.random(1,6))
     return city
   }
   // rolls dice for each city
   roll(city){
     city.initiates -= Math.random(1,6)
     city.initiates += (1 + Math.random(1,6))
     city.upgrades = Math.random(1,3)
     return city
   }
   // calculates who upgrades
   spendUpgrades(city){
    // if theres room in the city
    if(((city.initiates/20) > city.leader) && city.apprentices > 0 ){ 
      city.upgrades -= 1
      city.apprentices -= 1
      city.leader += 1   
    } 

    // if another city needs a leader
    if ((city.upgrades > 0) && this.isEmptyCity()){
      // add leader to other city
      city.upgrades -= 1
      city.apprentices -= 1
      addToEmptyCity(1)
    }
    // else 
    if (city.initiates>city.upgrades){
      city.apprentices += city.upgrades
      city.initiates -= city.upgrades
      city.upgrades = 0
    }

    return city
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
            comms:0,
            localBalance:0,
            upgrades:0,
            inTransit:true
          })

          newName = this.gangData.cities[2].name

        chatRoom.sendMessage(`Added ${newName}`);
      }
    
      if(content === '!newWeek'){
        response = this.newWeek()

        chatRoom.sendMessage(response);
      }

      if(content === '!cat'){
        
        //var searchName = content.slice(5, content.length)
        //where 
        // TODO
        chatRoom.sendMessage(this.gangData);
      }
    }
 }