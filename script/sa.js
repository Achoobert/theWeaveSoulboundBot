
var chants = [
(`Darkness blacker than black and darker than dark,
I beseech thee, combine with my deep crimson.
The time of awakening cometh.
Justice, fallen upon the infallible boundary,
appear now as an intangible distortions!
I desire for my torrent of power a destructive force:
a destructive force without equal!
Return all creation to cinders,
and come frome the abyss!
<h1>Explosion!</h1>`),

(`Oh, blackness shrouded in light,
Frenzied blaze clad in night,
In the name of the crimson demons,
let the collapse of thine origin manifest.
Summon before me the root of thy power hidden within the lands
of the kingdom of demise!
<h1>Explosion!</h1>`),

(`Crimson-black blaze, king of myriad worlds,
though I promulgate the laws of nature,
I am the alias of destruction incarnate
in accordance with the principles of all creation.
Let the hammer of eternity descend unto me!
<h1>Explosion!</h1>`),

(`Light in the end of the corners of the world,
come together I call upon the crimson realm,
my ultimate destruction magic!
<h1>Explosion!</h1>`)
]

function getRandomInt(max) {
    let min = Math.ceil(0);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



let results_html = `<em><u>Chanting:</u> ${chants[getRandomInt(chants.length)]} </em>`

ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: results_html
});