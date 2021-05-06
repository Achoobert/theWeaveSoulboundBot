//Rolls initiative for SBound
let myBonus = game.actors.get(game.user.data.character).data.data.combat.initiative.total

var rollobj = new Roll(`1d6`).roll();
var DicePool = 9 // skill
var focusPool = 3  // any focus points
var testCount = 3 // make this 3 for extended tests
var targetNumber = 3
var successes = 0;
var reportPool = [];

for (let index = 0; index < testCount; index++) {
   let dice = DicePool
   while (dice >= 0) {
      let roll = new Roll(`1d6`).roll();
      //rollobj.push(roll)
   } 
}

console.log(this.roll)

let results_html = `I got ${successes} successes.`

ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: results_html
});
ChatMessage.create(rollobj);