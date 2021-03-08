# created from this guide
# https://www.freecodecamp.org/news/create-a-discord-bot-with-python/

import discord
import os
import requests
import json
import random
from replit import db

client = discord.Client()

sad_words = ["sad", "depressed", "unhappy", "angry", "miserable"]

cities = [
  "Anvilguard",
  "Hammerhall"
]

if "responding" not in db.keys():
  db["responding"] = True

def get_quote():
  response = requests.get("https://zenquotes.io/api/random")
  json_data = json.loads(response.text)
  quote = json_data[0]["q"] + " -" + json_data[0]["a"]
  return(quote)

# def update_encouragements(encouraging_message):
#   if "encouragements" in db.keys():
#     encouragements = db["encouragements"]
#     encouragements.append(encouraging_message)
#     db["encouragements"] = encouragements
#   else:
#     db["encouragements"] = [encouraging_message]
def calculateWeek():
  if "crimsonDaemons" in db.keys():
    # get each city
    crimsonDaemons = db["crimsonDaemons"]
    for(city in crimsonDaemons)
      # deaths
      death = math.random(1,6)
      # overflow hits apprentices
      if death > city.initiates
         city.apprentices -= (city.initiates-death)
      # add new initiates
      city.initiates = math.random(1,6) + 1
    db["crimsonDaemons"] = crimsonDaemons
  else:
    db["crimsonDaemons"] = [encouraging_message]

def delete_encouragment(index):
  encouragements = db["encouragements"]
  if len(encouragements) > index:
    del encouragements[index]
  db["encouragements"] = encouragements

@client.event
async def on_ready():
  print("We have logged in as {0.user}".format(client))

@client.event
async def on_message(message):
  if message.author == client.user:
    return

  msg = message.content

#   if msg.startswith("$inspire"):
#     quote = get_quote()
#     await message.channel.send(quote)

#   if db["responding"]:
#     options = starter_encouragements
#     if "encouragements" in db.keys():
#       options = options + db["encouragements"]
#     if any(word in msg for word in sad_words):
#       await message.channel.send(random.choice(options))

  if msg.startswith("$listStats"):
    crimsonDaemons = []
    if "crimsonDaemons" in db.keys():
      crimsonDaemons = db["crimsonDaemons"]
    await message.channel.send(crimsonDaemons)

   if msg.startswith("$help"):
    userhelp = "listStats to get list of crimsonDaemons members. "
    await message.channel.send(userhelp)

  if msg.startswith("$upgradeInitiate"):
    count = msg.split("$upgradeInitiate ",1)[1]
    city = msg.split("$upgradeInitiate ",2)[2]
    updateInitiate(city, data)

  if msg.startswith("$upgradeApprentice"):
    city = msg.split("$upgradeInitiate ",2)[2]
    count = msg.split("$upgradeApprentice ",1)[1]
    updateApprentice(city, count)
    await message.channel.send("New Leader added.")

  if msg.startswith("$newCity"):
    cityName = msg.split("$newCity ",1)[1]
    updateCities(cityName)
    await message.channel.send("New city added: "+ cityName)

  if msg.startswith("$oneWeek"):
    calculateWeek()
    crimsonDaemons = []
    if "crimsonDaemons" in db.keys():
      crimsonDaemons = db["crimsonDaemons"]
    await message.channel.send(crimsonDaemons)


#   if msg.startswith("$responding"):
#     value = msg.split("$responding ",1)[1]
#     if value.lower() == "true":
#       db["responding"] = True
#       await message.channel.send("Responding is on.")
#     else:
#       db["responding"] = False
#       await message.channel.send("Responding is off.")


client.run(os.getenv("TOKEN"))