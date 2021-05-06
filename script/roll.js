//Rolls initiative for SBound
let myBonus = game.actors.get(game.user.data.character).data.data.combat.initiative.total
let roll = new Roll(`1d6+${myBonus}`).roll();

rollInitiative(game.user.data.character, (`1d6+${myBonus}`))

console.log(this.roll)

let results_html = `I got ${roll.total} initave. My base initiative is ${myBonus} `


ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: results_html
});

for (const actorK in game.data.combat[0].combatants) {
    //actorK.token.actorId
    actorK.initiative = 5
}