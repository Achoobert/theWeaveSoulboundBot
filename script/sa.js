//Rolls initiative for SBound
let myBonus = game.actors.get(game.user.data.character).data.data.combat.initiative.total

var rollobj = new Roll(`1d6`).roll();

ChatMessage.create(rollobj);