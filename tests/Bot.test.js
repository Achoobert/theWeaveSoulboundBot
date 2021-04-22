// Our main application, the bot
import GangBot from '../src/GangBot'
// Object/Class representing a message from a user
import Message from '../src/Message'
// Object/Class representing a chat room.
import ChatRoom from '../src/ChatRoom'

var fs = require('fs');

// Jest automatic class mocks
jest.mock('../src/ChatRoom');

// Our test specific implementation of a ChatRoom instance
ChatRoom.mockImplementation(() => {
  return {
    // sendMessage method
    // set to a mock function so we can inspect how it's being interacted with (calls, arguments, etc)
    sendMessage: jest.fn()
  }
})
var gangDatapath = `./testGang.json`
describe("GangBot", () => {
  let bot;
  let chatRoom;

  // Runs before each test. Used for cleaning up mocks and setting up variables that are often used
  beforeEach(() => {
    // Resets the mocks (clears all calls to functions, etc)
    ChatRoom.mockClear();

    // clear file
    let staticGangVersion = { 
      name:'Test Daemons',
      budget:100,
      cities:[
         {name:'Anvilguard',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0},
         {name:'Hammerhall',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0}
      ]
    };

    fs.writeFileSync(`./testGang.json`, JSON.stringify(staticGangVersion), function(err) {
      if (err) {
          console.log(err);
      }
    });
    

    bot = new GangBot(gangDatapath);
    chatRoom = new ChatRoom(); // This will create our mock implementation as an instance
  })
  
  test('!ping message should respond with "pong"', () => {
    const messageContent = '!ping';
    const expectedResponse = 'pong';

    const message = new Message(chatRoom, messageContent);
    
    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be 'pong'
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  })

  test('import test, should respond with json', () => {
    let testPath = './testGang.json'
    let testData =  { 
      name:'Test Daemons',
      budget:100,
      cities:[
         {name:'Anvilguard',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0},
         {name:'Hammerhall',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0}
      ]
    };
    // should be same as test data
    expect(bot.getGangData(testPath)).toEqual(testData);
  });

  test('import test, should behave like object', () => {
    bot.gangData.cities.push({name:"Chiang Mai"})
    // should be same as string test data
    expect(bot.gangData.cities).toContainEqual({name:"Chiang Mai"});
  });

  test('!data message should respond with stringify json', () => {
    const messageContent = '!data';
    const expectedResponse = JSON.stringify({ 
      name:'Test Daemons',
      budget:100,
      cities:[
         {name:'Anvilguard',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0},
         {name:'Hammerhall',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0}
      ]
   });

    const message = new Message(chatRoom, messageContent);
    
    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be '{ name:'Test Daemons',budget:100,cities:[{name:'Anvilguard',initiates:1,apprentices:1,leader:1,upgrades:0,localBalance:0,comms:0},{name:'Hammerhall',initiates:1,apprentices:1,leader:1,upgrades:0,localBalance:0,comms:0}]}
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  })

  test('Bot should NOT send a response if message is not a valid command', () => {
   const messageContent = 'Squad down for some CSGO tonight?';
   const message = new Message(chatRoom, messageContent);

   bot.handleMessage(message);

   // No messages should be sent
   expect(chatRoom.sendMessage).toBeCalledTimes(0);
  });

  test('Bot should add new city', () => {
    const messageContent = '!addCity Chiang Mai';
    const expectedResponse = 'Added Chiang Mai';
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be 'Added Chiang Mai'
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);    
  });
  
  test('Bot should have new city', () => {
    // Make sure it was actually added
    bot.gangData.cities.push(
      {
        name:'Chiang Mai',
        initiates:0,
        apprentices:0,
        leader:0,
        comms:0,
        localBalance:0,
        upgrades:0,
        inTransit:true
      })
    const messageContent = '!listCities';
    const expectedResponse = 'Anvilguard, Hammerhall, Chiang Mai, ';
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be 'Anvilguard, Hammerhall, Chiang Mai, '
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  });

  test('Bot should have empty city', () => {
    bot.gangData.cities.push(
      {
        name:'Chiang Mai',
        initiates:0,
        apprentices:0,
        leader:0,
        comms:0,
        localBalance:0,
        upgrades:0,
        inTransit:true
      })
    let iWantTrue = true;
    // The message sent should be 'true'
    expect(bot.isEmptyCity()).toBe(iWantTrue);
  });
  
  test('Bot should be able to addToEmptyCity', () => {
    bot.gangData.cities.push(
      {
        name:'Chiang Mai',
        initiates:0,
        apprentices:0,
        leader:0,
        comms:0,
        localBalance:0,
        upgrades:0,
        inTransit:true
      })
    let iWant = {name:'Chiang Mai',
                  initiates:0,
                  apprentices:0,
                  leader:1,
                  comms:0,
                  localBalance:0,
                  upgrades:0,
                  inTransit:true};
    // The message sent should be 'true'
    expect(bot.addToEmptyCity(1,iWant)).toEqual(iWant);
  });
  
  test('Bot should roll', () => {
    const protoCity = {
      name:'Bangkok',
      initiates:6,
      apprentices:1,
      leader:1,
      comms:0,
      localBalance:0,
      upgrades:0,
      inTransit:false
    }
    var result = bot.roll(protoCity);

    // should be in range
    expect((result.initiates >= 1) && (result.initiates <= 12)).toBe(true);
    expect(result.apprentices == 1).toBe(true);
    expect(result.leader == 1).toBe(true);
    expect(result.upgrades > 0 && result.upgrades < 4).toBe(true);
  });
   test('Bot should upgrade', () => {
    const protoCity = {
      name:'Bangkok',
      initiates:23,
      apprentices:1,
      leader:1,
      comms:0,
      upgrades:2,
      inTransit:false,
      budget:0
    }
    const expectCity = {
      name:'Bangkok',
      initiates:22,
      apprentices:1,
      leader:2,
      comms:0,
      upgrades:0,
      inTransit:false,
      budget:0
    }
    var result = bot.spendUpgrades(protoCity);

    // should be in range
    expect(bot.spendUpgrades(protoCity)).toEqual(expectCity);
  });
  
  test('Bot should not have empty city', () => {
    // The message sent should be 'false'
    expect(bot.isEmptyCity()).toBe(false);
  });

  test('!newweek message Bot should do math and return awk', () => {
    const messageContent = '!newWeek';
    const expectedResponse = 'done';
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be ''
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  });
  
  
  test('!cat Crimson Daemons should return overall data', () => {
    // 
    const messageContent = '!cat';
    const expectedResponse = bot.gangData;
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be ''
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  });
  
  
  test('should write a new file', () => {
    // clear old
    fs.writeFileSync('./testWrite.json','')
    // test data
    const protoGang = { 
      name:'Test',
      budget:1,
      cities:[
         {name:'A',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0},
         {name:'B',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0}
      ]
    }
    bot.saveData(protoGang, './testWrite.json');
    // should be in range
    let testWroteGang = fs.readFileSync('./testWrite.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err)
          return
      }
      console.log('File data:', jsonString) 
      return jsonString;
     });
    expect(JSON.parse(testWroteGang)).toEqual(protoGang);
  });
  
  test('!report message should respond with string', () => {
    const messageContent = '!report';
    // const expectedResponse = bot.gangData;
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be ''
    expect(chatRoom.sendMessage).toBeDefined();
  });

  test('local balance', () => {
    // 
    json = {name:'A',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:0}
    outJson = {name:'A',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:15,
            comms:0}
    expect(bot.calculateIncome(json)).toEqual(outJson)
  });
  
  test('has comms', () => {
    // 
    json = {name:'A',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:1}
    outJson = {name:'A',
            initiates:1,
            apprentices:1,
            leader:1,
            upgrades:0,
            localBalance:0,
            comms:1}
    expect(bot.calculateIncome(json)).toEqual(outJson)
  });
  
  /*
  test('!cat cities- should return overall cities with tier of', () => {
    // 
  });
  
  test('!cat cities -v - should return all the data', () => {
    // 
  });

  test('!help should respond with list of commands', () => {
    // 

  });
  */
})
