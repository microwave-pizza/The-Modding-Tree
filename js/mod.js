let modInfo = {
	name: "The Prestige Tree: NG?",
	id: "tptngm-#9472",
	author: "microwave pizza",
	pointsName: "points",
	modFiles: ["p.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0),
	offlineLimit: 0
}

let VERSION = {
	num: "0.1",
	name: "The Prestigious",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1 (The Prestigious)</h3><br>
		- Added prestige layer<br>`

let winText = `Congratulations! You win!`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

function getPointGen() {
	let gain = new Decimal(1)

	if (hasUpgrade("p", "0,0")) gain = gain.mul(upgradeEffect("p", "0,0"))
	if (hasUpgrade("p", "0,2")) gain = gain.mul(upgradeEffect("p", "0,2"))
	if (hasUpgrade("p", "1,1")) gain = gain.mul(upgradeEffect("p", "1,1"))
	if (hasUpgrade("p", "2,0")) gain = gain.mul(3)
	if (hasUpgrade("p", "2,1")) gain = gain.mul(upgradeEffect("p", "2,1"))
	if (hasAchievement("p", 11)) gain = gain.mul(4)
	if (hasAchievement("p", 22)) gain = gain.mul(Decimal.sub(10, player.p.points.div(10)).clampMin(2))
	return gain
}

function addedPlayerData() { return {
}}

var displayThings = [
]

function isEndgame() {
	return false
}

var backgroundStyle = {

}

function maxTickLength() {
	return(3600)
}

function fixOldSave(oldVersion){
}