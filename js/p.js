addLayer("p", {
    name: "prestige",
    startData() {return {
        unlocked: true,
        points: decimalZero,
        spent: decimalZero
    }},
    color: "#31AEB0",
    row: 0,
    resource: "prestige points",
    hotkeys: [
        {
            key: "p",
            description: "P: Reset your points for prestige points",
            onPress() {doReset("p")}
        }
    ],

    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(10),
    exponent: 1,
    base: new Decimal(2),
    gainMult() {
        let mul = new Decimal(1)

        if (hasUpgrade("p", "0,1")) mul = mul.div(upgradeEffect("p", "0,1"))
        if (hasUpgrade("p", "1,0")) mul = mul.div(upgradeEffect("p", "1,0"))
        if (hasUpgrade("p", "1,2")) mul = mul.div(upgradeEffect("p", "1,2"))
        if (hasUpgrade("p", "2,0")) mul = mul.div(3)
        if (hasAchievement("p", 11)) mul = mul.div(4)

        return mul
    },
    canBuyMax: true,

    prestigeTokens() {
        let t = player.p.points.mul(player.p.points.add(1)).div(2).sub(player.p.spent)

        if (hasAchievement("p", 21)) t = t.add(player.p.points)

        return t
    },
    prestigeUpgradeCostMul() {
        let c = Decimal.pow(2, upgradeCount("p"))

        if (hasUpgrade("p", "1,2")) c = c.mul(2)
        if (hasUpgrade("p", "2,1")) c = c.mul(2)

        return c.round()
    },
    prestige() {return player.p.achievements.length},

    upgrades: {
        "0,0": {
            fullDisplay() {
                return `<h3>(0,0)</h3><br>
                Prestige points boost point generation.<br><br>
                Currently: x${format(upgradeEffect("p", "0,0"))}
                ${hasUpgrade("p", "0,0") ? "" : "<br><br>Cost: 1 prestige token"}`
            },
            effect() {return Decimal.pow(1.5, player.p.points.sqrt()).mul(2).sub(1)},
            canAfford() {return tmp.p.prestigeTokens.gte(1)},
            pay() {player.p.spent = player.p.spent.add(1)}
        },
        "0,1": {
            fullDisplay() {
                return `<h3>(0,1)</h3><br>
                Points reduce prestige point cost.<br><br>
                Currently: /${format(upgradeEffect("p", "0,1"))}
                ${hasUpgrade("p", "0,1") ? "" : `<br><br>Cost: ${format(tmp.p.prestigeUpgradeCostMul)} prestige tokens ${adjacentUpgrade("0,1") ? "" : "(LOCKED)"}`}`
            },
            effect() {return player.points.add(1).root(15).mul(7.5).sub(6.5)},
            canAfford() {return adjacentUpgrade("0,1") && tmp.p.prestigeTokens.gte(tmp.p.prestigeUpgradeCostMul)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.prestigeUpgradeCostMul)}
        },
        "0,2": {
            fullDisplay() {
                return `<h3>(0,2)</h3><br>
                Prestige tokens boost point generation.<br><br>
                Currently: x${format(upgradeEffect("p", "0,2"))}
                ${hasUpgrade("p", "0,2") ? "" : `<br><br>Cost: ${format(tmp.p.prestigeUpgradeCostMul)} prestige tokens ${adjacentUpgrade("0,2") ? "" : "(LOCKED)"}`}`
            },
            effect() {return Decimal.pow(1.5, tmp.p.prestigeTokens.sqrt().sqrt())},
            canAfford() {return adjacentUpgrade("0,2") && tmp.p.prestigeTokens.gte(tmp.p.prestigeUpgradeCostMul)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.prestigeUpgradeCostMul)}
        },
        "1,0": {
            fullDisplay() {
                return `<h3>(1,0)</h3><br>
                Prestige points reduce prestige point cost.<br><br>
                Currently: /${format(upgradeEffect("p", "1,0"))}
                ${hasUpgrade("p", "1,0") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["1,0"].value)} prestige tokens ${adjacentUpgrade("1,0") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(1.5)},
            effect() {return Decimal.pow(1.5, player.p.points.add(1).sqrt().sqrt().mul(2).sub(1))},
            canAfford() {return adjacentUpgrade("1,0") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["1,0"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["1,0"].value)}
        },
        "1,1": {
            fullDisplay() {
                return `<h3>(1,1)</h3><br>
                Points boost point generation.<br><br>
                Currently: x${format(upgradeEffect("p", "1,1"))}
                ${hasUpgrade("p", "1,1") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["1,1"].value)} prestige tokens ${adjacentUpgrade("1,1") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(1.5)},
            effect() {return player.points.add(1).pow(0.1).mul(2).sub(1)},
            canAfford() {return adjacentUpgrade("1,1") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["1,1"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["1,1"].value)}
        },
        "1,2": {
            fullDisplay() {
                return `<h3>(1,2)</h3><br>
                Prestige tokens reduce prestige point cost. Multiply upgrade costs by 2.<br><br>
                Currently: /${format(upgradeEffect("p", "1,2"))}
                ${hasUpgrade("p", "1,2") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["1,2"].value)} prestige tokens ${adjacentUpgrade("1,2") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(2)},
            effect() {return Decimal.pow(1.5, tmp.p.prestigeTokens.root(3)).mul(1.5).sub(0.5)},
            canAfford() {return adjacentUpgrade("1,2") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["1,2"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["1,2"].value)}
        },
        "2,0": {
            fullDisplay() {
                return `<h3>(2,0)</h3><br>
                Multiply point gain and divide prestige point cost by 3.
                ${hasUpgrade("p", "2,0") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["2,0"].value)} prestige tokens ${adjacentUpgrade("2,0") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(2)},
            canAfford() {return adjacentUpgrade("2,0") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["2,0"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["2,0"].value)}
        },
        "2,1": {
            fullDisplay() {
                return `<h3>(2,1)</h3><br>
                The number of grid spaces bought boosts point gain. Multiply upgrade costs by 2.<br><br>
                Currently: x${format(upgradeEffect("p", "2,1"))}
                ${hasUpgrade("p", "2,1") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["2,1"].value)} prestige tokens ${adjacentUpgrade("2,1") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(2.5)},
            effect() {return Decimal.pow(1.25, upgradeCount("p")).mul(2.5).sub(1.5)},
            canAfford() {return adjacentUpgrade("2,1") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["2,1"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["2,1"].value)}
        },
        "2,2": {
            fullDisplay() {
                return `<h3>(2,2)</h3><br>
                Unlock Prestigious Achievements.
                ${hasUpgrade("p", "2,2") ? "" : `<br><br>Cost: ${format(tmp.p.upgrades["2,2"].value)} prestige tokens ${adjacentUpgrade("2,2") ? "" : "(LOCKED)"}`}`
            },
            value() {return tmp.p.prestigeUpgradeCostMul.mul(5)},
            canAfford() {return adjacentUpgrade("2,2") && tmp.p.prestigeTokens.gte(tmp.p.upgrades["2,2"].value)},
            pay() {player.p.spent = player.p.spent.add(tmp.p.upgrades["2,2"].value)}
        }
    },
    clickables: {
        reset: {
            title: "Reset Grid",
            display: `Reset the grid, refunding all prestige tokens. This costs 1 prestige point and resets points.`,
            canClick() {return player.p.points.gt(0)},
            onClick() {
                player.p.spent = decimalZero
                player.p.upgrades = []
                player.points = decimalZero
                player.p.points = player.p.points.sub(1)
            }
        }
    },
    achievements: {
        11: {
            name: "Beginning",
            done() {return hasUpgrade("p", "2,2")},
            tooltip: "Reward: Point gain x4, prestige point cost /4."
        },
        21: {
            name: "Abundance",
            done() {return hasUpgrade("p", "2,2") && player.p.points.gte(25)},
            tooltip() {return `${hasAchievement("p", 21) ? "" : "Have 25 or more prestige points.<br><br>"}Reward: Prestige points now give an extra prestige token each.`}
        },
        22: {
            name: "Scarcity",
            done() {return hasUpgrade("p", "2,2") && tmp.p.prestigeTokens.eq(0)},
            tooltip() {return `${hasAchievement("p", 22) ? "" : "Have no prestige tokens.<br><br>"}Reward: Point gain x10. Every prestige point reduces the multiplier by 0.1, down to x2.`}
        },
        31: {
            name: "Rebirth",
            done() {return hasUpgrade("p", "2,2") && player.p.points.eq(18) && player.points.gt(250000)},
            tooltip() {return `${hasAchievement("p", 31) ? "" : "With exactly 18 prestige points, have more than 250,000 points.<br><br>"}Reward: Unlock [next update].`}
        }
    },
    infoboxes:{
        gridinfo: {
            title: "Info",
            body: "Spaces unlock adjacent spaces.<br>Each space doubles every other space's cost."
        },
        achinfo: {
            title: "Info",
            body: `Achievements require ${colorText("(2,2)", "#31AEB0", "inline")} to be achieved.<br>However, their effects are always active.`
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button"
            ]
        },
        "Grid": {
            content: [
                ["infobox", "gridinfo"],
                "blank",
                ["display-text", () => {return `You have ${colorText(format(tmp.p.prestigeTokens), "#31AEB0")} prestige tokens`}],
                "blank",
                ["row", [["upgrade", "0,0"], ["upgrade", "0,1"], ["upgrade", "0,2"]]],
                ["row", [["upgrade", "1,0"], ["upgrade", "1,1"], ["upgrade", "1,2"]]],
                ["row", [["upgrade", "2,0"], ["upgrade", "2,1"], ["upgrade", "2,2"]]],
                "blank",
                "blank",
                ["clickable", "reset"]
            ],
            unlocked() {return player.p.points.gt(0)}
        },
        "Achievements": {
            content: [
                ["infobox", "achinfo"],
                "blank",
                ["display-text", () => {return `You have ${colorText(format(tmp.p.prestige), "#31AEB0")} prestigiousness`}],
                "blank",
                "achievements"
            ],
            unlocked() {return tmp.p.prestige > 0}
        }
    }
})
