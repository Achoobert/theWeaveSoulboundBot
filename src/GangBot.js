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
import fs from 'fs';
import path from 'path';

export default class GangBot {
   constructor(gangDatapath) {
    // read the file
    this.path = gangDatapath;
    this.gangData = this.getGangData(gangDatapath)
    //
   }
   // Getters
   getGangData(path){
    let jsonData = fs.readFileSync(path, "utf8", (err, jsonString) => {
              if (err) {
                  console.log("File read failed:", err)
                  return 'error'
              }
              console.log('File data:', jsonString) 
              //return jsonString;
              return (jsonString);
            });
      if(jsonData!=undefined && jsonData!='' && jsonData!=[]){
        return JSON.parse(jsonData)
      }else{
        return(jsonData)
      }
   }
   // Checkes if there is any empty cities returns bool 
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
            if(this.getRandomInt(6)>=4){
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
  saveData(latestGangData, destinationPath){
    fs.writeFileSync(destinationPath, JSON.stringify(latestGangData), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  }
   // Method
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
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
       //
       city = this.calculateIncome(city)
      });

      this.saveData(this.gangData, this.path)
      return outcome;
   }
   // Safe upgrade roll
   safeRoll(city){
     city.initiates += (1 + this.getRandomInt(6))
     return city
   }
   // rolls dice for each city
   roll(city){
     city.initiates -= this.getRandomInt(6)
     city.initiates += (1 + this.getRandomInt(6))
     city.upgrades = this.getRandomInt(3)
     return city
   }
   // rolls dice for each city
   calculateIncome(city){
     var income = (city.apprentices * 15)
      if(city.comms){//truthy
        this.gangData.budget += income 
      }else if((income+city.localBalance)>50){
        this.gangData.budget += (income + city.localBalance - 50)
        city.comms = 1
      }else{
        city.localBalance += (income)
      }
     return city
   }
   // rolls dice for each city
   smallReport(){
     var report = '';
     report = report.concat(JSON.stringify(this.gangData.name))
     report = report.concat(' budget is ', JSON.stringify(this.gangData.budget))
     this.gangData.cities.forEach(city => {
       report = report.concat(', ', JSON.stringify(city.name))
       report = report.concat(' is level ',JSON.stringify(city.leader))
     });
     return report
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
        chatRoom.sendMessage(JSON.stringify(this.gangData));
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
  
        this.saveData(this.gangData, this.path)
        chatRoom.sendMessage(`Added ${newName}`);
      }

      if(content.slice(0,9) === '!addGang '){
        var newName = content.slice(9, content.length)

        // this.gangData.gangs.push(
        //   {
        //     name:newName,
        //     initiates:0,
        //     apprentices:0,
        //     leader:0,
        //     comms:0,
        //     localBalance:0,
        //     upgrades:0,
        //     inTransit:true
        //   })

        // newName = this.gangData.cities[2].name
  
        this.saveData(this.gangData, this.path)
        //chatRoom.sendMessage(`Added ${newName}`);
        chatRoom.sendMessage(`Sorry, this feature is not impleminted yet.`);
      }
    
      if(content.slice(0,9) === '!withdraw '){
        var number = parseInt(content.slice(10, content.length))
        console.log(number)
  
        this.saveData(this.gangData, this.path)
        //chatRoom.sendMessage(`Added ${newName}`);
        chatRoom.sendMessage(`Sorry, this feature is not impleminted yet.`);
      }
    
      if(content === '!newWeek'){
        response = this.newWeek()

        chatRoom.sendMessage(response);
      }
 
      if(content === '!report'){
        chatRoom.sendMessage(this.smallReport());
      }

      if(content === '!cat'){
        
        //var searchName = content.slice(5, content.length)
        //where 
        // TODO
        chatRoom.sendMessage(this.gangData);
      }
    }
 }