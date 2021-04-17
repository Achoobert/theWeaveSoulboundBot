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
import gangData from './testGang.js'
describe("GangBot", () => {
  let bot;
  let chatRoom;

  // Runs before each test. Used for cleaning up mocks and setting up variables that are often used
  beforeEach(() => {
    // Resets the mocks (clears all calls to functions, etc)
    ChatRoom.mockClear();

    // // clear file
    let readyToSpread = { 
      name:'Test Daemons',
      budget:100,
      cities:[
         {name:'Anvilguard',
         initiates:12,
         apprentices:12,
         leader:1,
         comms:0},
         {name:'Hammerhall',
          initiates:12,
          apprentices:12,
          leader:1,
          comms:0},
         {name:'World Club',
          initiates:0,
          apprentices:0,
          leader:0,
          comms:0}
      ]
    };
    let notifyUser = { 
      name:'Test Daemons',
      cities:[
         {name:'Anvilguard',
         initiates:12,
         apprentices:12,
         leader:1,
         comms:0},
         {name:'Hammerhall',
          initiates:12,
          apprentices:1,
          leader:1,
          comms:0}
      ]
    };
    let moveLeader = { 
      name:'Test Daemons',
      cities:[
         {name:'Anvilguard',
         initiates:7,
         apprentices:4,
         leader:1,
         comms:0},
         {name:'Hammerhall',
          initiates:50,
          apprentices:0,
          leader:1,
          comms:0}
      ]
    };
    let noLeaders = { 
      name:'Test Daemons',
      cities:[
         {name:'Anvilguard',
         initiates:0,
         apprentices:0,
         leader:0,
         comms:0},
         {name:'Hammerhall',
          initiates:0,
          apprentices:0,
          leader:0,
          comms:0}
      ]
    };
    // fs.writeFile(`./crimsonGang.js`, output, function(err) {
    //   if (err) {
    //      console.log(err);
    //   }
    // });
    

    bot = new GangBot(gangData);
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

  test('!data message should respond with some json', () => {
    const messageContent = '!data';
    const expectedResponse = { 
      name:'Test Daemons',
      budget:100,
      cities:[
         {name:'Anvilguard',
         initiates:1,
         apprentices:1,
         leader:1,
         comms:0,
         localBalance:0,
         upgrades:0},
         {name:'Hammerhall',
          initiates:1,
          apprentices:1,
          leader:1,
          comms:0,
          localBalance:0,
          upgrades:0}
      ]
    };

    const message = new Message(chatRoom, messageContent);
    
    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be 'pong'
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
    let iWantTrue = true;
    // The message sent should be 'true'
    expect(bot.isEmptyCity()).toBe(iWantTrue);
  });
  
  test('Bot should be able to addToEmptyCity', () => {
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
    const expectedResponse = gangData;
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be ''
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
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
