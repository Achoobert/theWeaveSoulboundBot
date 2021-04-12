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
import gangData from './crimsonGang.js'
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
      cities:[
         {name:'Anvilguard',
         initiates:1,
         apprentices:1,
         leader:1,
         comms:0},
         {name:'Hammerhall',
          initiates:1,
          apprentices:1,
          leader:1,
          comms:0}
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
                  leader:0,
                  comms:0};
    // The message sent should be 'true'
    expect(bot.addToEmptyCity()).toBe(iWant);
  });
  
  test('!newweek message Bot should do math and return report', () => {
    const messageContent = '!newWeek';
    const expectedResponse = 'Moved leader to Chiang Mai';
    
    const message = new Message(chatRoom, messageContent);

    bot.handleMessage(message);

    // Only one message should be sent
    expect(chatRoom.sendMessage).toBeCalledTimes(1);
    // The message sent should be ''
    expect(chatRoom.sendMessage).toBeCalledWith(expectedResponse);
  });

  test('Bot should not have empty city', () => {
    // Make sure it returns false
    let iWant = false;
    // The message sent should be 'false'
    expect(bot.isEmptyCity()).toBe(iWant);
  });
  
})
