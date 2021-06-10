// Main functions.
function buyAt(n) {
    if (ExpantaNum.gte(player.currencies.atoms, player.generators.atomizers[n].cost)) {
        player.currencies.atoms = ExpantaNum.sub(player.currencies.atoms, player.generators.atomizers[n].cost)

        player.generators.atomizers[n].amount = ExpantaNum.add(player.generators.atomizers[n].amount, 1)
        player.generators.atomizers[n].bought = ExpantaNum.add(player.generators.atomizers[n].bought, 1)
        player.generators.atomizers[n].cost = ExpantaNum.mul(player.generators.atomizers[n].initCost, ExpantaNum.pow(ExpantaNum.mul(10, ExpantaNum.pow(10, n)), ExpantaNum.floor(ExpantaNum.div(player.generators.atomizers[n].bought, 10))))
    }
}

// Formatting.
function format(n) {
    if (ExpantaNum.lt(n.array[0][1], 1000) && !n.array[1]) {
        return n.array[0][1].toFixed(2)
    } else if (ExpantaNum.gte(n.array[0][1], 1000) && ExpantaNum.lte(n.array[0][1], ExpantaNum.MAX_SAFE_INTEGER) && !n.array[1]) {
        return ExpantaNum.div(n.array[0][1], ExpantaNum.pow(10, ExpantaNum.floor(ExpantaNum.log10(n.array[0][1])))).toFixed(2) + "e" + ExpantaNum.floor(ExpantaNum.log10(n.array[0][1]))
    } else if (n.array[1]) {
        return n.toHyperE()
    }
}

function format2(n) {
    if (ExpantaNum.gte(n.array[0][1], 1000) && ExpantaNum.lte(n.array[0][1], ExpantaNum.MAX_SAFE_INTEGER)) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return n.array[0][1]
    }
}

// Updating.
function update() {
    if (ExpantaNum.gt(player.currencies.atoms, player.currencies.bstat)) {
        player.currencies.bstat = player.currencies.atoms
    }

    document.getElementById("atcount").innerHTML = format(player.currencies.atoms)
    document.getElementById("atcountps").innerHTML = player.currencies.atps
    document.getElementById("atpps").innerHTML = player.currencies.atpps
    document.getElementById("atatcount").innerHTML = format(player.currencies.atgat)
    document.getElementById("bsatcount").innerHTML = format(player.currencies.bstat)

    for (let n = 1; n < 5; n++) {
        document.getElementById("at" + n + "mlt").innerHTML = "x" + format(player.generators.atomizers[n].mult)
        document.getElementById("at" + n + "amt").innerHTML =  format(player.generators.atomizers[n].amount)
        document.getElementById("at" + n + "bght").innerHTML = format2(player.generators.atomizers[n].bought)
        document.getElementById("at" + n + "cost").innerHTML = format(player.generators.atomizers[n].cost)
        document.getElementById("at" + n + "pps").innerText = "(+" + format(player.generators.atomizers[n].amtpps) + "%/s)"

        if (player.generators.atomizers[n].shown == true) {
            document.getElementById("atomizer" + n).style = "display: block"
        } else {
            document.getElementById("atomizer" + n).style = "display: none"
        }

        if (ExpantaNum.gte(player.currencies.atoms, ExpantaNum.div(player.generators.atomizers[n].initCost, 2))) {
            player.generators.atomizers[n].shown = true
        }

        if (ExpantaNum.gte(player.currencies.atoms, player.generators.atomizers[n].cost)) {
            document.getElementById("buyAzr" + n).className = "buyableThing"
        } else {
            document.getElementById("buyAzr" + n).className = "unbuyableThing"
        }

        player.generators.atomizers[n].mult = ExpantaNum.mul(1, ExpantaNum.pow(player.generators.atomizers[n].per10, ExpantaNum.floor(ExpantaNum.div(player.generators.atomizers[n].bought, 10))))
    }

    for (var a in player.other.currentTab) {
        if (player.other.currentTab[a]) {
            document.getElementById(a + "Tab").style.display = "block"
        } else if (player.other.currentTab[a] === false) {
            document.getElementById(a + "Tab").style.display = "none";
        } else {
            throw Error("TAB NOT FOUND.")
        }
    }
}

function changeTab(tab) {
    for (var a in player.other.currentTab) {
        if (a === tab) {
            player.other.currentTab[a] = true
        } else {
            player.other.currentTab[a] = false
        }
    }
}

function prodLoop() {
    for (let n = 1; n < 5; n++) {
        if (n != 1) {
            gnpr = ExpantaNum.div(ExpantaNum.mul(player.generators.atomizers[n].amount, player.generators.atomizers[n].mult), 300)
            player.generators.atomizers[n-1].amount = ExpantaNum.add(player.generators.atomizers[n-1].amount, gnpr)
            if (ExpantaNum.gt(player.generators.atomizers[n-1].amount, 0)) {
                player.generators.atomizers[n-1].amtpps = ExpantaNum.mul(ExpantaNum.div(gnpr, player.generators.atomizers[n-1].amount), 3000)
            }
        } else {
            g1pr = ExpantaNum.mul(ExpantaNum.div(player.generators.atomizers[1].amount, 30), player.generators.atomizers[1].mult)

            player.currencies.atoms = ExpantaNum.add(player.currencies.atoms, g1pr)
            player.currencies.atgat = ExpantaNum.add(player.currencies.atgat, g1pr)
            player.currencies.atps = format(ExpantaNum.mul(g1pr, 30))
            player.currencies.atpps = format(ExpantaNum.mul(ExpantaNum.div(g1pr, player.currencies.atoms), 3000)) // "3000" because g1pr is per frame and the game runs at 30FPS, so 30 and 100 because of percentages. 30 times 100 is 3000.
        }
    }
}
function gameLoop() {
    update()
    prodLoop()
}

setInterval(gameLoop, 1000/30)
