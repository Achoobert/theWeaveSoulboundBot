# The Weave's Soulbound Bot
## discord-gang-bot

Based on tdd-discord-music-bot


Goal is to admin my RPG gang, track its growth, and calculate my income.
New cities will be added as empty objects, and as the gang gets big enough in smaller cities, they will send leaders to start a new chapter in a random empty city.
This is a bot built using test/documentation driven development.

Based on tdd-discord-music-bot
 https://github.com/ashindlecker/tdd-discord-music-botzs

### Commands
`!oneweek` 
1. for each city rolls numbers to calculate lost/added/upgraded 
2. For each city, efficiently upgrade. 
 - for each 20 followers in a city, have a leader (upgrade apprentice)
 - if there is an empty city, upgrade apprentice and send them 
 - Upgrade initiates to apprentices
3. calculate Aqua Gyranis in a given city 
 - if city has enough money saved up, purchase magic-messaging like
 - If city has magic messaging line, empty aqua gyranis into gang's pooled bank account

`!ping` Responds with "pong"

`!help`
replies with list of commands

`!newcity </name of new city>`
ex: `!newcity Chiang Mai`
adds an empty new city. It needs another city to sent it a leader.

`!cat </gang name>`
ex. `!cat Crimson Daemons`
Lists basic city information

`!cat cities`
Lists basic city information

`!cat cities -v`
Lists full city information

resetdata




## Project Structure and TDD
The project structure consists of just 2 main folders:

`/src` Source code of the bot

`/tests` Collection of test files to test the bot's functionality

### Discord Chat Abstraction
To make testing easier, we abstract all the functionality of what Discord.js can do into smaller interfaces that we care about. These interfaces are:

`ChatRoom` Represents a Chat Room. Bot only needs a chat room that lets us send a message `sendMessage`, and join a voice channel `joinVoiceChannel`

`Message` Represents a Chat Message. Bot only cares about reading the contents of a message `content`, and the ability to send a message back to the channel which it came from `chatRoom`

`VoiceChannel` Represents a Voice Channel. Bot only cares about streaming audio `streamAudio` to this channel.

Using these abstractions, we can begin to write tests to handle these classes, without needing to have a discord bot in the first place!

### Sample bot command, !ping
A common command to ensure that the bot hasn't died, a **!ping** message should respond with a **pong** response.

In `/tests/Bot.test.js`, **line 41**, a test has been written to ensure that this happens.

The code to pass this test is written in `/src/MusicBot.js` **line 15**


### Discord Chat Adapter
In the end, we'd like to actually have this discord bot work with...discord. To do so, a wrapper / adapter class has been made in `/src/Integrations/DiscordWrapper.js`

This class is responsible for transforming native discord.js messages, and **adapting** them to our interface. 

This is the only code that is not tested as it involves actually launching a bot. Luckily, the only important code is in `_messageFactory`, which is easy to review and fix if needed. As long as this class correctly adapts messages, the rest of the code will run as intended, thanks to the tests!



### Conclusion
Hopefully this example helps better understand TDD in more "real world" applications. This project involves asynchronous calls, dealing with network requests, streaming live data, and more!

