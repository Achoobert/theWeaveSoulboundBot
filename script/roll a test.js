//Rolls initiative for SBound
let myBonus = game.actors.get(game.user.data.character).data.data.combat.initiative.total

let roll = new Roll(`1d6`).roll();
var DicePool = 9 // skill
var focusPool = 3  // any focus points
var testCount = 3 // make this 3 for extended tests
var targetNumber = 3
var successes = 0;
var reportPool = [];

for (let index = 0; index < testCount; index++) {
   var failPool = []
   let dice = DicePool
   let focus = focusPool
   while (dice >= 0) {
      let roll = new Roll(`1d6`).roll();
      reportPool.push(roll)
      if (roll.total>=targetNumber) {
         successes++
      }else if (roll.total+1==targetNumber && focus>0) {
         successes++
         focus--
      } else {
         failPool.push(roll)
      }
      dice--
   } 
   failPool.forEach(die => {
      if(focus>1 && die.total+2==targetNumber){
         successes++
      }
   });
}

console.log(this.roll)

let results_html = `I got ${successes} successes.`

ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: results_html
});