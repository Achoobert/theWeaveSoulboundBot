//Rocks Fall, everyone dies.

let targets = []
game.user.targets.forEach(i => {
let name = i.name;
targets.push(name);
})

if(targets.length === 0) {targets = "no one, this time"}

let roll = new Roll(`8d10+100`).roll();
console.log(this.roll)

let results_html = `The cave collapses from above, dealing ${roll.total} damage to ${targets}.`

ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: results_html
});