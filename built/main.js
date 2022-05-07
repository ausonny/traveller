/* globals $, localStorage, location, Decimal */
var notationDisplayOptions = ["Scientific Notation", "Standard Formatting", "Engineering Notation", "Alphabetic Notation", "Hybrid Notation", "Logarithmic Notation"];
var textToDisplay;
var textToDisplaygamesave;
var textToDisplayachievement;
var textToDisplayloot;
var textToDisplaychallenge;
var textToDisplaystory;
var displayindex;
var initted = false;
var gameData;
var internalInflationArray;
internalInflationArray = [];
var lastachievementcount;
lastachievementcount = 0;
var achievementbonusarray;
achievementbonusarray = [];
const isFixedString = (s) => !isNaN(+s) && isFinite(+s) && !/e/i.test(s);
function getCurrentPebbleRate() {
    return pebblesFromPrestige().multiply(3600000).divide(gameData.stats.prestige1ticks);
}
function getCurrentRockRate() {
    return rocksFromPrestige().multiply(3600000).divide(gameData.stats.prestige2ticks);
}
function getCurrentBoulderRate() {
    return bouldersFromPrestige().multiply(3600000).divide(gameData.stats.prestige3ticks);
}
function processStuff(ticks) {
    gameData.stats.prestige1ticks += ticks;
    gameData.stats.prestige2ticks += ticks;
    gameData.stats.prestige3ticks += ticks;
    gameData.world.currentTickLength = ticks;
    gameData.world.ticksToNextSpawn -= ticks;
    gameData.producer.costMultiplier = 10 - gameData.rockUpgrades[7].bought;
    var currentPebbleRate = getCurrentPebbleRate();
    if (currentPebbleRate.greaterThan(gameData.stats.bestPrestige1Rate)) {
        gameData.stats.bestPrestige1Rate = new JBDecimal(currentPebbleRate);
    }
    var currentRockRate = getCurrentRockRate();
    if (currentRockRate.greaterThan(gameData.stats.bestPrestige2Rate)) {
        gameData.stats.bestPrestige2Rate = new JBDecimal(currentRockRate);
    }
    var currentBoulderRate = getCurrentBoulderRate();
    if (currentBoulderRate.greaterThan(gameData.stats.bestPrestige3Rate)) {
        gameData.stats.bestPrestige3Rate = new JBDecimal(currentBoulderRate);
    }
    gameData.resources.metal.add(gameData.derivatives[0].production());
    gameData.derivatives[0].owned = gameData.derivatives[0].owned.add(gameData.derivatives[1].production());
    gameData.derivatives[1].owned = gameData.derivatives[1].owned.add(gameData.derivatives[2].production());
    gameData.derivatives[2].owned = gameData.derivatives[2].owned.add(gameData.derivatives[3].production());
    gameData.derivatives[3].owned = gameData.derivatives[3].owned.add(gameData.derivatives[4].production());
    gameData.derivatives[4].owned = gameData.derivatives[4].owned.add(gameData.derivatives[5].production());
    gameData.derivatives[5].owned = gameData.derivatives[5].owned.add(gameData.derivatives[6].production());
    gameData.derivatives[6].owned = gameData.derivatives[6].owned.add(gameData.derivatives[7].production());
    gameData.resources.particles.add(gameData.speedDerivatives[0].production());
    gameData.speedDerivatives[0].owned = gameData.speedDerivatives[0].owned.add(gameData.speedDerivatives[1].production());
    gameData.speedDerivatives[1].owned = gameData.speedDerivatives[1].owned.add(gameData.speedDerivatives[2].production());
    gameData.speedDerivatives[2].owned = gameData.speedDerivatives[2].owned.add(gameData.speedDerivatives[3].production());
    gameData.speedDerivatives[3].owned = gameData.speedDerivatives[3].owned.add(gameData.speedDerivatives[4].production());
    gameData.speedDerivatives[4].owned = gameData.speedDerivatives[4].owned.add(gameData.speedDerivatives[5].production());
    gameData.resources.timeparticles.add(gameData.timeDerivatives[0].production());
    gameData.timeDerivatives[0].owned = gameData.timeDerivatives[0].owned.add(gameData.timeDerivatives[1].production());
    gameData.timeDerivatives[1].owned = gameData.timeDerivatives[1].owned.add(gameData.timeDerivatives[2].production());
    gameData.timeDerivatives[2].owned = gameData.timeDerivatives[2].owned.add(gameData.timeDerivatives[3].production());
    gameData.timeDerivatives[3].owned = gameData.timeDerivatives[3].owned.add(gameData.timeDerivatives[4].production());
    gameData.timeDerivatives[4].owned = gameData.timeDerivatives[4].owned.add(gameData.timeDerivatives[5].production());
    gameData.tower.act();
    for (let index = 0; index < 12; index++) {
        const element = gameData.upgrades[index];
        element.addedlimit = 0;
    }
    if (gameData.rockUpgrades[5].bought > 0) {
        for (let index = 0; index < 12; index++) {
            const element = gameData.upgrades[index];
            element.addedlimit += 10;
        }
    }
    if (gameData.boulderUpgrades[3].bought > 0) {
        for (let index = 0; index < 12; index++) {
            const element = gameData.upgrades[index];
            element.addedlimit += 10;
        }
    }
    for (var index = gameData.enemies.length - 1; index >= 0; index--) {
        const e = gameData.enemies[index];
        e.act();
        if (e.CurrentHitPoints().lessThanOrEqualTo(0)) {
            if (gameData.world.currentWave >= gameData.world.highestWaveCompleted) {
                var dustGained = new JBDecimal(0);
                var lootupgrade = new JBDecimal(0.1).multiply(gameData.upgrades[6].bought).multiply(gameData.rockUpgrades[6].getBonus()).add(1);
                if (e.type != "") {
                    dustGained = new JBDecimal(1.05).pow(gameData.world.currentWave);
                    dustGained = dustGained.multiply(lootupgrade);
                    dustGained = dustGained.multiply(new JBDecimal(2).pow(gameData.world.currentTier - 1));
                    if (e.type === "Boss") {
                        dustGained = dustGained.multiply(5);
                    }
                    if (dustGained.greaterThan(0)) {
                        gameData.resources.dust.add(dustGained);
                        addToDisplay(dustGained.ToString() + " dust gained", "loot");
                    }
                }
            }
            else {
                var metalGained = new JBDecimal(0);
                var lootupgrade = new JBDecimal(0.1).multiply(gameData.upgrades[6].bought).add(1);
                if (e.type != "") {
                    metalGained = new JBDecimal(gameData.derivatives[0].production(10000));
                    metalGained = metalGained.multiply(lootupgrade);
                    metalGained = metalGained.multiply(new JBDecimal(2).pow(gameData.world.currentTier - 1));
                    if (e.type === "Boss") {
                        metalGained = metalGained.multiply(5);
                    }
                    if (metalGained.greaterThan(0)) {
                        gameData.resources.metal.add(metalGained);
                        addToDisplay(metalGained.ToString() + " metal gained", "loot");
                    }
                }
            }
            gameData.enemies.splice(index, 1);
        }
    }
    if (gameData.world.ticksToNextSpawn <= 0) {
        if (gameData.world.enemiesToSpawn > 0) {
            var enemyindex = gameData.world.currentWave + 10 - gameData.world.enemiesToSpawn; // keeps visual index from counting down.
            var newEnemy = new Enemy(gameData.world.currentWave, enemyindex);
            if (Math.random() * gameData.world.enemiesToSpawn < getSpecialsCount()) {
                var choicesArr = getSpecialsArray();
                var i = Math.floor(Math.random() * choicesArr.length);
                if (choicesArr[i] === "F") {
                    gameData.world.fastEnemiesToSpawn -= 1;
                    newEnemy.movementPerSec *= 3;
                    newEnemy.type = "Fast";
                }
                else if (choicesArr[i] === "T") {
                    gameData.world.tankEnemiesToSpawn -= 1;
                    newEnemy.baseMaxHitPoints = newEnemy.baseMaxHitPoints.multiply(3);
                    newEnemy.type = "Tank";
                }
                else if (choicesArr[i] === "R") {
                    gameData.world.rangedEnemiesToSpawn -= 1;
                    newEnemy.type = "Ranged";
                    newEnemy.baseRange = 10;
                }
                else if (choicesArr[i] === "C") {
                    gameData.world.cannonEnemiesToSpawn -= 1;
                    newEnemy.type = "Cannon";
                    newEnemy.baseAttack = newEnemy.baseAttack.multiply(3);
                }
                else if (choicesArr[i] === "b") {
                    gameData.world.bradleyEnemiesToSpawn -= 1;
                    newEnemy.type = "Bradley";
                    newEnemy.movementPerSec = newEnemy.movementPerSec *= 3;
                    newEnemy.baseMaxHitPoints = newEnemy.baseMaxHitPoints.multiply(3);
                }
                else if (choicesArr[i] === "t") {
                    gameData.world.triremeEnemiesToSpawn -= 1;
                    newEnemy.type = "Trireme";
                    newEnemy.baseRange = 10;
                    newEnemy.baseMaxHitPoints = newEnemy.baseMaxHitPoints.multiply(3);
                }
                else if (choicesArr[i] === "c") {
                    gameData.world.cavalierEnemiesToSpwan -= 1;
                    newEnemy.type = "Cavalier";
                    newEnemy.baseMaxHitPoints = newEnemy.baseMaxHitPoints.multiply(3);
                    newEnemy.baseAttack = newEnemy.baseAttack.multiply(3);
                }
                else if (choicesArr[i] === "S") {
                    gameData.world.scorpionEnemiesToSpawn -= 1;
                    newEnemy.type = "Scorpion";
                    newEnemy.movementPerSec = newEnemy.movementPerSec *= 3;
                    newEnemy.baseAttack = newEnemy.baseAttack.multiply(3);
                }
                else if (choicesArr[i] === "P") {
                    gameData.world.paladinEnemiesToSpawn -= 1;
                    newEnemy.type = "Paladin";
                    newEnemy.baseRange = 10;
                    newEnemy.baseAttack = newEnemy.baseAttack.multiply(3);
                }
                else if (choicesArr[i] === "B") {
                    gameData.world.bossEnemiesToSpawn -= 1;
                    newEnemy.type = "Boss";
                    newEnemy.baseAttack = newEnemy.baseAttack.multiply(5);
                    newEnemy.baseMaxHitPoints = newEnemy.baseMaxHitPoints.multiply(5);
                }
            }
            gameData.enemies.push(newEnemy);
            gameData.world.ticksToNextSpawn += 1000 - gameData.world.currentWave * 5;
            gameData.world.enemiesToSpawn -= 1;
        }
    }
    var autoprestige1 = document.getElementById("autoprestige1");
    if (gameData.tower.CurrentHitPoints().lessThanOrEqualTo(0)) {
        gameData.tower.damagetaken = new JBDecimal(0);
        for (let index = 0; index < gameData.challenges.length; index++) {
            const element = gameData.challenges[index];
            element.active = false;
        }
        if (autoprestige1.checked && pebblesFromPrestige().greaterThan(0)) {
            init(1);
            addToDisplay("Dust. But I still need more.", "story");
        }
        else {
            gameData.world.currentWave -= 11;
            if (gameData.world.currentWave < 0) {
                gameData.world.currentWave = 0;
            }
            gameData.world.deathlevel++;
            resetSpawns(true);
            addToDisplay("You have been overcome.  The pressure lessens.", "story");
        }
    }
    if (gameData.world.enemiesToSpawn === 0 && gameData.enemies.length < 1) {
        if (gameData.world.currentWave >= gameData.stats.highestEverWave) {
            gameData.stats.highestEverWave = gameData.world.currentWave;
        }
        if (gameData.world.currentWave > gameData.world.highestWaveCompleted) {
            gameData.world.highestWaveCompleted = gameData.world.currentWave;
        }
        resetSpawns(false);
    }
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            element.checkForCompletion();
        }
    }
    if (gameData.stats.highestEverWave >= 20) {
        if (autoprestige1.checked) {
            gameData.automation[0].item = 1;
        }
        else {
            gameData.automation[0].item = 0;
        }
        var highestwavemultiplier = 5 - (gameData.rockUpgrades[2].bought + gameData.boulderUpgrades[2].bought);
        for (let index = 1; index < gameData.automation.length; index++) {
            const element = gameData.automation[index];
            var itemName = "automation" + index + "item";
            var valueName = "automation" + index + "value";
            const autoitem = document.getElementById(itemName);
            const autovalue = document.getElementById(valueName);
            element.item = parseFloat(autoitem.options[autoitem.selectedIndex].value);
            element.value = parseFloat(autovalue.options[autovalue.selectedIndex].value);
            if (gameData.stats.highestEverWave >= index * highestwavemultiplier) {
                if (element.item === 1 && gameData.challenges[3].completed > 0) {
                    runAutomationRule(element, gameData.producer, gameData.resources.metal, true);
                }
                else if (element.item === 2) {
                    runAutomationRule(element, gameData.derivatives[0], gameData.resources.metal, true);
                }
                else if (element.item === 3) {
                    runAutomationRule(element, gameData.derivatives[1], gameData.resources.metal, true);
                }
                else if (element.item === 4) {
                    runAutomationRule(element, gameData.derivatives[2], gameData.resources.metal, true);
                }
                else if (element.item === 5 && gameData.upgrades[12].bought > 0) {
                    runAutomationRule(element, gameData.derivatives[3], gameData.resources.metal, true);
                }
                else if (element.item === 6 && gameData.upgrades[12].bought > 1) {
                    runAutomationRule(element, gameData.derivatives[4], gameData.resources.metal, true);
                }
                else if (element.item === 7 && gameData.upgrades[12].bought > 2) {
                    runAutomationRule(element, gameData.derivatives[5], gameData.resources.metal, true);
                }
                else if (element.item === 8 && gameData.upgrades[12].bought > 3) {
                    runAutomationRule(element, gameData.derivatives[6], gameData.resources.metal, true);
                }
                else if (element.item === 9 && gameData.upgrades[12].bought > 4) {
                    runAutomationRule(element, gameData.derivatives[7], gameData.resources.metal, true);
                }
                else if (element.item === 10 && gameData.challenges[3].completed > 0) {
                    runAutomationRule(element, gameData.producer, gameData.resources.dust, false);
                }
                else if (element.item === 11) {
                    runAutomationRule(element, gameData.derivatives[0], gameData.resources.dust, false);
                }
                else if (element.item === 12) {
                    runAutomationRule(element, gameData.derivatives[1], gameData.resources.dust, false);
                }
                else if (element.item === 13) {
                    runAutomationRule(element, gameData.derivatives[2], gameData.resources.dust, false);
                }
                else if (element.item === 14 && gameData.upgrades[12].bought > 0) {
                    runAutomationRule(element, gameData.derivatives[3], gameData.resources.dust, false);
                }
                else if (element.item === 15 && gameData.upgrades[12].bought > 1) {
                    runAutomationRule(element, gameData.derivatives[4], gameData.resources.dust, false);
                }
                else if (element.item === 16 && gameData.upgrades[12].bought > 2) {
                    runAutomationRule(element, gameData.derivatives[5], gameData.resources.dust, false);
                }
                else if (element.item === 17 && gameData.upgrades[12].bought > 3) {
                    runAutomationRule(element, gameData.derivatives[6], gameData.resources.dust, false);
                }
                else if (element.item === 18 && gameData.upgrades[12].bought > 4) {
                    runAutomationRule(element, gameData.derivatives[7], gameData.resources.dust, false);
                }
                else if (element.item === 19) {
                    runAutomationRule(element, gameData.equipment[0], gameData.resources.metal, true);
                }
                else if (element.item === 20) {
                    runAutomationRule(element, gameData.equipment[1], gameData.resources.metal, true);
                }
                else if (element.item === 21) {
                    runAutomationRule(element, gameData.equipment[0], gameData.resources.dust, false);
                }
                else if (element.item === 22) {
                    runAutomationRule(element, gameData.equipment[1], gameData.resources.dust, false);
                }
            }
        }
    }
}
function runAutomationRule(rule, actioner, resource, notupgrade = true) {
    var cost = new JBDecimal(0);
    if (notupgrade) {
        cost = new JBDecimal(actioner.buyCost());
    }
    else {
        cost = new JBDecimal(actioner.buyUpgradeCost());
    }
    if (rule.value === 0) {
        cost = cost.multiply(1000);
    }
    else if (rule.value === 1) {
        cost = cost.multiply(100);
    }
    else if (rule.value === 2) {
        cost = cost.multiply(10);
    }
    else if (rule.value === 3) {
        cost = cost.multiply(4);
    }
    else if (rule.value === 4) {
        cost = cost.multiply(2);
    }
    if (resource.amount.greaterThanOrEqualTo(cost)) {
        if (notupgrade) {
            actioner.buy();
        }
        else {
            actioner.buyUpgrade();
        }
    }
}
function getParticleBonus() {
    var particlebonus = new JBDecimal(gameData.resources.particles.amount.exponent + (gameData.resources.particles.amount.mantissa / 10)).pow(2);
    if (particlebonus.lessThan(1)) {
        particlebonus = new JBDecimal(1);
    }
    return particlebonus;
}
function getTimeParticleBonus() {
    var particlebonus = new JBDecimal(gameData.resources.timeparticles.amount.exponent + (gameData.resources.timeparticles.amount.mantissa / 10)).pow(2);
    if (particlebonus.lessThan(1)) {
        particlebonus = new JBDecimal(1);
    }
    return particlebonus;
}
function updateGUI() {
    document.getElementById("dust").innerHTML = gameData.resources.dust.amount.ToString();
    document.getElementById("metal").innerHTML = gameData.resources.metal.amount.ToString();
    document.getElementById("pebbles").innerHTML = gameData.resources.pebbles.amount.ToString();
    document.getElementById("rocks").innerHTML = gameData.resources.rocks.amount.ToString();
    document.getElementById("boulders").innerHTML = gameData.resources.boulders.amount.ToString();
    document.getElementById("particlesamount").innerHTML = gameData.resources.particles.amount.ToString();
    document.getElementById("particlesb").innerHTML = getParticleBonus().ToString();
    document.getElementById("timeparticles").innerHTML = gameData.resources.timeparticles.amount.ToString();
    document.getElementById("timeparticlesbonus").innerHTML = getTimeParticleBonus().ToString();
    if (gameData.challenges[3].active || gameData.challenges[3].completed < 1) {
        $("#productionderivative").addClass("hidden");
    }
    else {
        $("#productionderivative").removeClass("hidden");
    }
    if (gameData.derivatives[0].owned.greaterThan(0)) {
        $("#supervisorderivative").removeClass("hidden");
    }
    else {
        $("#supervisorderivative").addClass("hidden");
    }
    if (gameData.derivatives[1].owned.greaterThan(0)) {
        $("#foremanderivative").removeClass("hidden");
    }
    else {
        $("#foremanderivative").addClass("hidden");
    }
    $("#managerderivative").addClass("hidden");
    $("#btnBuyUpgrade7").addClass("hidden");
    if (gameData.upgrades[12].owned.greaterThan(0)) {
        $("#btnBuyUpgrade7").removeClass("hidden");
        if (gameData.derivatives[2].owned.greaterThan(0)) {
            $("#managerderivative").removeClass("hidden");
        }
    }
    $("#middlemanagementderivative").addClass("hidden");
    $("#btnBuyUpgrade8").addClass("hidden");
    if (gameData.upgrades[12].owned.greaterThan(1)) {
        $("#btnBuyUpgrade8").removeClass("hidden");
        if (gameData.derivatives[3].owned.greaterThan(0)) {
            $("#middlemanagementderivative").removeClass("hidden");
        }
    }
    $("#uppermanagementderivative").addClass("hidden");
    $("#btnBuyUpgrade9").addClass("hidden");
    if (gameData.upgrades[12].owned.greaterThan(2)) {
        $("#btnBuyUpgrade9").removeClass("hidden");
        if (gameData.derivatives[4].owned.greaterThan(0)) {
            $("#uppermanagementderivative").removeClass("hidden");
        }
    }
    $("#vicepresidentderivative").addClass("hidden");
    $("#btnBuyUpgrade10").addClass("hidden");
    if (gameData.upgrades[12].owned.greaterThan(3)) {
        $("#btnBuyUpgrade10").removeClass("hidden");
        if (gameData.derivatives[5].owned.greaterThan(0)) {
            $("#vicepresidentderivative").removeClass("hidden");
        }
    }
    $("#presidentderivative").addClass("hidden");
    $("#btnBuyUpgrade11").addClass("hidden");
    if (gameData.upgrades[12].owned.greaterThan(4)) {
        $("#btnBuyUpgrade11").removeClass("hidden");
        if (gameData.derivatives[6].owned.greaterThan(0)) {
            $("#presidentderivative").removeClass("hidden");
        }
    }
    $("#particles").addClass("hidden");
    $("#accelerationderivative").addClass("hidden");
    $("#jerkderivative").addClass("hidden");
    $("#snapderivative").addClass("hidden");
    $("#cracklederivative").addClass("hidden");
    $("#popderivative").addClass("hidden");
    if (gameData.stats.prestige2 > 0) {
        $("#particles").removeClass("hidden");
        if (gameData.speedDerivatives[0].owned.greaterThan(0)) {
            $("#accelerationderivative").removeClass("hidden");
        }
        if (gameData.speedDerivatives[1].owned.greaterThan(0)) {
            $("#jerkderivative").removeClass("hidden");
        }
        if (gameData.speedDerivatives[2].owned.greaterThan(0)) {
            $("#snapderivative").removeClass("hidden");
        }
        if (gameData.speedDerivatives[3].owned.greaterThan(0)) {
            $("#cracklederivative").removeClass("hidden");
        }
        if (gameData.speedDerivatives[4].owned.greaterThan(0)) {
            $("#popderivative").removeClass("hidden");
        }
    }
    $("#time").addClass("hidden");
    $("#time2derivative").addClass("hidden");
    $("#time3derivative").addClass("hidden");
    $("#time4derivative").addClass("hidden");
    $("#time5derivative").addClass("hidden");
    $("#time6derivative").addClass("hidden");
    if (gameData.stats.prestige3 > 0) {
        $("#time").removeClass("hidden");
        if (gameData.timeDerivatives[0].owned.greaterThan(0)) {
            $("#time2derivative").removeClass("hidden");
        }
        if (gameData.timeDerivatives[1].owned.greaterThan(0)) {
            $("#time3derivative").removeClass("hidden");
        }
        if (gameData.timeDerivatives[2].owned.greaterThan(0)) {
            $("#time4derivative").removeClass("hidden");
        }
        if (gameData.timeDerivatives[3].owned.greaterThan(0)) {
            $("#time5derivative").removeClass("hidden");
        }
        if (gameData.timeDerivatives[4].owned.greaterThan(0)) {
            $("#time6derivative").removeClass("hidden");
        }
    }
    document.getElementById("producitonproduction").innerHTML = gameData.producer.productionPerSecDisplay().ToString();
    document.getElementById("productionbought").innerHTML = gameData.producer.bought.toString();
    document.getElementById("productionowned").innerHTML = gameData.producer.owned.ToString();
    document.getElementById("minerbought").innerHTML = gameData.derivatives[0].bought.toString();
    document.getElementById("minerowned").innerHTML = gameData.derivatives[0].owned.ToString();
    document.getElementById("minerproduction").innerHTML = gameData.derivatives[0].productionPerSecDisplay().ToString();
    document.getElementById("supervisorbought").innerHTML = gameData.derivatives[1].bought.toString();
    document.getElementById("supervisorowned").innerHTML = gameData.derivatives[1].owned.ToString();
    document.getElementById("supervisorproduction").innerHTML = gameData.derivatives[1].productionPerSecDisplay().ToString();
    document.getElementById("foremanbought").innerHTML = gameData.derivatives[2].bought.toString();
    document.getElementById("foremanowned").innerHTML = gameData.derivatives[2].owned.ToString();
    document.getElementById("foremanproduction").innerHTML = gameData.derivatives[2].productionPerSecDisplay().ToString();
    document.getElementById("managerbought").innerHTML = gameData.derivatives[3].bought.toString();
    document.getElementById("managerowned").innerHTML = gameData.derivatives[3].owned.ToString();
    document.getElementById("managerproduction").innerHTML = gameData.derivatives[3].productionPerSecDisplay().ToString();
    document.getElementById("middlemanagementbought").innerHTML = gameData.derivatives[4].bought.toString();
    document.getElementById("middlemanagementowned").innerHTML = gameData.derivatives[4].owned.ToString();
    document.getElementById("middlemanagementproduction").innerHTML = gameData.derivatives[4].productionPerSecDisplay().ToString();
    document.getElementById("uppermanagementbought").innerHTML = gameData.derivatives[5].bought.toString();
    document.getElementById("uppermanagementowned").innerHTML = gameData.derivatives[5].owned.ToString();
    document.getElementById("uppermanagementproduction").innerHTML = gameData.derivatives[5].productionPerSecDisplay().ToString();
    document.getElementById("vicepresidentbought").innerHTML = gameData.derivatives[6].bought.toString();
    document.getElementById("vicepresidentowned").innerHTML = gameData.derivatives[6].owned.ToString();
    document.getElementById("vicepresidentproduction").innerHTML = gameData.derivatives[6].productionPerSecDisplay().ToString();
    document.getElementById("presidentbought").innerHTML = gameData.derivatives[7].bought.toString();
    document.getElementById("presidentowned").innerHTML = gameData.derivatives[7].owned.ToString();
    document.getElementById("presidentproduction").innerHTML = gameData.derivatives[7].productionPerSecDisplay().ToString();
    document.getElementById("speedbought").innerHTML = gameData.speedDerivatives[0].bought.toString();
    document.getElementById("speedowned").innerHTML = gameData.speedDerivatives[0].owned.ToString();
    document.getElementById("speedproduction").innerHTML = gameData.speedDerivatives[0].productionPerSecDisplay().ToString();
    document.getElementById("accelerationbought").innerHTML = gameData.speedDerivatives[1].bought.toString();
    document.getElementById("accelerationowned").innerHTML = gameData.speedDerivatives[1].owned.ToString();
    document.getElementById("accelerationproduction").innerHTML = gameData.speedDerivatives[1].productionPerSecDisplay().ToString();
    document.getElementById("jerkbought").innerHTML = gameData.speedDerivatives[2].bought.toString();
    document.getElementById("jerkowned").innerHTML = gameData.speedDerivatives[2].owned.ToString();
    document.getElementById("jerkproduction").innerHTML = gameData.speedDerivatives[2].productionPerSecDisplay().ToString();
    document.getElementById("snapbought").innerHTML = gameData.speedDerivatives[3].bought.toString();
    document.getElementById("snapowned").innerHTML = gameData.speedDerivatives[3].owned.ToString();
    document.getElementById("snapproduction").innerHTML = gameData.speedDerivatives[3].productionPerSecDisplay().ToString();
    document.getElementById("cracklebought").innerHTML = gameData.speedDerivatives[4].bought.toString();
    document.getElementById("crackleowned").innerHTML = gameData.speedDerivatives[4].owned.ToString();
    document.getElementById("crackleproduction").innerHTML = gameData.speedDerivatives[4].productionPerSecDisplay().ToString();
    document.getElementById("popbought").innerHTML = gameData.speedDerivatives[5].bought.toString();
    document.getElementById("popowned").innerHTML = gameData.speedDerivatives[5].owned.ToString();
    document.getElementById("popproduction").innerHTML = gameData.speedDerivatives[5].productionPerSecDisplay().ToString();
    document.getElementById("time1bought").innerHTML = gameData.timeDerivatives[0].bought.toString();
    document.getElementById("time1owned").innerHTML = gameData.timeDerivatives[0].owned.ToString();
    document.getElementById("time1production").innerHTML = gameData.timeDerivatives[0].productionPerSecDisplay().ToString();
    document.getElementById("time2bought").innerHTML = gameData.timeDerivatives[1].bought.toString();
    document.getElementById("time2owned").innerHTML = gameData.timeDerivatives[1].owned.ToString();
    document.getElementById("time2production").innerHTML = gameData.timeDerivatives[1].productionPerSecDisplay().ToString();
    document.getElementById("time3bought").innerHTML = gameData.timeDerivatives[2].bought.toString();
    document.getElementById("time3owned").innerHTML = gameData.timeDerivatives[2].owned.ToString();
    document.getElementById("time3production").innerHTML = gameData.timeDerivatives[2].productionPerSecDisplay().ToString();
    document.getElementById("time4bought").innerHTML = gameData.timeDerivatives[3].bought.toString();
    document.getElementById("time4owned").innerHTML = gameData.timeDerivatives[3].owned.ToString();
    document.getElementById("time4production").innerHTML = gameData.timeDerivatives[3].productionPerSecDisplay().ToString();
    document.getElementById("time5bought").innerHTML = gameData.timeDerivatives[4].bought.toString();
    document.getElementById("time5owned").innerHTML = gameData.timeDerivatives[4].owned.ToString();
    document.getElementById("time5production").innerHTML = gameData.timeDerivatives[4].productionPerSecDisplay().ToString();
    document.getElementById("time6bought").innerHTML = gameData.timeDerivatives[5].bought.toString();
    document.getElementById("time6owned").innerHTML = gameData.timeDerivatives[5].owned.ToString();
    document.getElementById("time6production").innerHTML = gameData.timeDerivatives[5].productionPerSecDisplay().ToString();
    document.getElementById("totalachievementbonus").innerHTML = new JBDecimal(getAchievementBonus()).ToString();
    document.getElementById("achievementbonus").innerHTML = new JBDecimal(getAchievementsOnlyBonus()).ToString();
    document.getElementById("tier1bonus").innerHTML = new JBDecimal(getTier1FeatBonus()).ToString();
    document.getElementById("tier2bonus").innerHTML = new JBDecimal(getTier2FeatBonus()).ToString();
    document.getElementById("attackbought").innerHTML = gameData.equipment[0].bought.toString();
    //var temp = gameData.equipment[0].production();
    // temp = temp.divide(gameData.equipment[0].bought);
    document.getElementById("attackproducing").innerHTML = gameData.equipment[0].productionPerUnit().multiply(gameData.tower.baseAttack).ToString();
    document.getElementById("hullbought").innerHTML = gameData.equipment[1].bought.toString();
    document.getElementById("hullproducing").innerHTML = gameData.equipment[1].productionPerUnit().multiply(gameData.tower.baseMaxHitPoints).ToString();
    // if (gameData.challenges[1].active) {
    //   $("#shieldequipment").addClass("hidden");
    // } else if (gameData.challenges[1].completed > 0) {
    //   $("#shieldequipment").removeClass("hidden");
    //   document.getElementById("shieldbought").innerHTML = gameData.equipment[2].bought.toString();
    //   document.getElementById("shieldproducing").innerHTML = gameData.equipment[2].productionPerUnit().multiply(3.0).ToString();
    // } else {
    //   $("#shieldequipment").addClass("hidden");
    // }
    // if (gameData.challenges[2].active) {
    //   $("#healequipment").addClass("hidden");
    // } else if (gameData.challenges[2].completed > 0) {
    //   $("#healequipment").removeClass("hidden");
    //   document.getElementById("healbought").innerHTML = gameData.equipment[3].bought.toString();
    //   document.getElementById("healproducing").innerHTML = gameData.equipment[3].productionPerUnit().multiply(2.0).ToString();
    // } else {
    //   $("#healequipment").addClass("hidden");
    // }
    // if (gameData.challenges[4].active) {
    //   $("#rangeequipment").addClass("hidden");
    // } else if (gameData.challenges[4].completed > 0) {
    //   $("#rangeequipment").removeClass("hidden");
    //   document.getElementById("rangebought").innerHTML = gameData.equipment[4].bought.toString();
    //   document.getElementById("rangeproducing").innerHTML = gameData.equipment[4].productionPerUnit().multiply(0.5).ToString();
    // } else {
    //   $("#rangeequipment").addClass("hidden");
    // }
    // if (gameData.challenges[5].active) {
    //   $("#speedequipment").addClass("hidden");
    // } else if (gameData.challenges[5].completed > 0) {
    //   $("#speedequipment").removeClass("hidden");
    //   document.getElementById("speedequipmentbought").innerHTML = gameData.equipment[5].bought.toString();
    //   document.getElementById("speedequipmentproducing").innerHTML = gameData.equipment[5].productionPerUnit().multiply(10).ToString();
    // } else {
    //   $("#speedequipment").addClass("hidden");
    // }
    document.getElementById("textToDisplay").innerHTML = getDisplayText();
    for (let index = 0; index < gameData.derivatives.length; index++) {
        const element = gameData.derivatives[index];
        element.updateDisplay();
    }
    for (let index = 0; index < gameData.speedDerivatives.length; index++) {
        const element = gameData.speedDerivatives[index];
        element.updateDisplay();
    }
    for (let index = 0; index < gameData.timeDerivatives.length; index++) {
        const element = gameData.timeDerivatives[index];
        element.updateDisplay();
    }
    gameData.producer.updateDisplay();
    for (let index = 0; index < gameData.equipment.length; index++) {
        const element = gameData.equipment[index];
        element.updateDisplay();
    }
    var enemyinfo = new Enemy(gameData.world.currentWave, 0);
    document.getElementById("enemyHitPoints").innerHTML = enemyinfo.baseMaxHitPoints.ToString();
    document.getElementById("enemyAttack").innerHTML = enemyinfo.baseAttack.ToString();
    document.getElementById("towerHitPoints").innerHTML = gameData.tower.CurrentHitPoints().ToString() + "/" + gameData.tower.MaxHitPoints().ToString();
    document.getElementById("towerAttack").innerHTML = gameData.tower.Attack().ToString();
    document.getElementById("towerRange").innerHTML = gameData.tower.Range().toFixed(3);
    document.getElementById("towerDefense").innerHTML = gameData.tower.Defense().toFixed(3);
    document.getElementById("towerHeal").innerHTML = gameData.tower.Heal().toFixed(3);
    document.getElementById("towerticks").innerHTML = (1000 / gameData.tower.TicksPerBullet()).toFixed(3);
    //document.getElementById("currentwave").innerHTML = gameData.world.currentWave.toFixed(0);
    document.getElementById("tierinfo").classList.add("hidden");
    var btndown = document.getElementById("btntierdown");
    btndown.disabled = false;
    var btnup = document.getElementById("btntierup");
    btnup.disabled = false;
    if (gameData.world.tierUnlocked > 1) {
        document.getElementById("currenttier").innerHTML = gameData.world.currentTier.toFixed(0);
        document.getElementById("tierinfo").classList.remove("hidden");
        if (gameData.world.currentTier === 1) {
            btndown.disabled = true;
        }
        if (gameData.world.currentTier === gameData.world.tierUnlocked) {
            btnup.disabled = true;
        }
    }
    // document.getElementById("currenttick").innerHTML = gameData.world.currentTickLength.toFixed(0);
    //document.getElementById("leftovertick").innerHTML = gameData.world.ticksLeftOver.toFixed(0);
    //document.getElementById("unspawned").innerHTML = gameData.world.enemiesToSpawn.toString();
    //document.getElementById("unspawnedspecials").innerHTML = getSpecialsCount().toString();
    //document.getElementById("attacking").innerHTML = gameData.enemies.length.toString();
    document.getElementById("particles-tab").classList.add("hidden");
    document.getElementById("rockupgrades-tab").classList.add("hidden");
    if (gameData.stats.prestige2 > 0) {
        document.getElementById("particles-tab").classList.remove("hidden");
        document.getElementById("rockupgrades-tab").classList.remove("hidden");
    }
    document.getElementById("time-tab").classList.add("hidden");
    document.getElementById("boulderupgrades-tab").classList.add("hidden");
    if (gameData.stats.prestige3 > 0) {
        document.getElementById("time-tab").classList.remove("hidden");
        document.getElementById("boulderupgrades-tab").classList.remove("hidden");
    }
    for (let index = 0; index < gameData.upgrades.length; index++) {
        const element = gameData.upgrades[index];
        element.updateDisplay();
    }
    for (let index = 0; index < gameData.rockUpgrades.length; index++) {
        const element = gameData.rockUpgrades[index];
        element.updateDisplay();
    }
    for (let index = 0; index < gameData.boulderUpgrades.length; index++) {
        const element = gameData.boulderUpgrades[index];
        element.updateDisplay();
    }
    if (pebblesFromPrestige().greaterThan(0)) {
        $("#btnPrestige1").removeClass("hidden");
        document.getElementById("btnPrestige1").innerHTML = "Prestige for " + pebblesFromPrestige().ToString() + " pebbles<br>Current:" + getCurrentPebbleRate().ToString() + " /hr<br>Best:" + gameData.stats.bestPrestige1Rate.ToString() + "/hr";
    }
    else {
        $("#btnPrestige1").addClass("hidden");
    }
    if (rocksFromPrestige().greaterThan(0)) {
        $("#btnPrestige2").removeClass("hidden");
        document.getElementById("btnPrestige2").innerHTML = "Ascend for " + rocksFromPrestige().ToString() + " rocks<br>Current:" + getCurrentRockRate().ToString() + " /hr<br>Best:" + gameData.stats.bestPrestige2Rate.ToString() + "/hr";
    }
    else {
        $("#btnPrestige2").addClass("hidden");
    }
    if (bouldersFromPrestige().greaterThan(0)) {
        $("#btnPrestige3").removeClass("hidden");
        document.getElementById("btnPrestige3").innerHTML =
            "Transform for " + bouldersFromPrestige().ToString() + " boulders<br>Current:" + getCurrentBoulderRate().ToString() + " /hr<br>Best:" + gameData.stats.bestPrestige3Rate.ToString() + "/hr";
    }
    else {
        $("#btnPrestige3").addClass("hidden");
    }
    for (let index = 0; index < gameData.achievements.length; index++) {
        const element = gameData.achievements[index];
        const elementName = "btnAchievement" + (index + 1).toString();
        if (element.completed) {
            document.getElementById(elementName).classList.remove("btn-danger");
            document.getElementById(elementName).classList.add("btn-success");
        }
        else {
            document.getElementById(elementName).classList.add("btn-danger");
            document.getElementById(elementName).classList.remove("btn-success");
        }
    }
    for (let index = 0; index < gameData.tier1Feats.length; index++) {
        const element = gameData.tier1Feats[index];
        const elementName = "btn1Tier" + (index + 1).toString();
        if (element.completed) {
            document.getElementById(elementName).classList.remove("btn-danger");
            document.getElementById(elementName).classList.add("btn-success");
        }
        else {
            document.getElementById(elementName).classList.add("btn-danger");
            document.getElementById(elementName).classList.remove("btn-success");
        }
    }
    for (let index = 0; index < gameData.tier2Feats.length; index++) {
        const element = gameData.tier2Feats[index];
        const elementName = "btn2Tier" + (index + 1).toString();
        if (element.completed) {
            document.getElementById(elementName).classList.remove("btn-danger");
            document.getElementById(elementName).classList.add("btn-success");
        }
        else {
            document.getElementById(elementName).classList.add("btn-danger");
            document.getElementById(elementName).classList.remove("btn-success");
        }
    }
    if (gameData.stats.prestige2 < 1) {
        document.getElementById("shieldchallenge").classList.add("hidden");
        document.getElementById("rangechallenge").classList.add("hidden");
    }
    else {
        document.getElementById("shieldchallenge").classList.remove("hidden");
        document.getElementById("rangechallenge").classList.remove("hidden");
    }
    if (gameData.stats.prestige3 < 1) {
        document.getElementById("critchallenge").classList.add("hidden");
    }
    else {
        document.getElementById("critchallenge").classList.remove("hidden");
    }
    document.getElementById("tier1div").classList.add("hidden");
    if (gameData.world.tierUnlocked > 0) {
        document.getElementById("tier1div").classList.remove("hidden");
    }
    document.getElementById("tier2div").classList.add("hidden");
    if (gameData.world.tierUnlocked > 1) {
        document.getElementById("tier2div").classList.remove("hidden");
    }
    var canvas = document.getElementById("gameBoard");
    if (canvas.getContext) {
        const originalHeight = canvas.height;
        const originalWidth = canvas.width;
        let dimensions = getObjectFitSize(true, canvas.clientWidth, canvas.clientHeight, canvas.width, canvas.height);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        let ratio = Math.min(canvas.clientWidth / originalWidth, canvas.clientHeight / originalHeight);
        var ctx = canvas.getContext("2d");
        ctx.scale(ratio * dpr * 1.5, ratio * dpr * 1.5); //adjust this!
        const squareSize = 520;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, squareSize, squareSize);
        ctx.globalAlpha = gameData.tower.CurrentHitPoints().divide(gameData.tower.MaxHitPoints()).ToNumber();
        if (ctx.globalAlpha < 0.1) {
            ctx.globalAlpha = 0.1;
        }
        DrawSolidEnemy(ctx, gameData.tower.CurrentHitPoints(), gameData.tower.MaxHitPoints(), squareSize, 20, 0, 0, "green");
        for (let index = 0; index < gameData.tower.bullets.length; index++) {
            const b = gameData.tower.bullets[index];
            DrawSolidEnemy(ctx, new JBDecimal(100), new JBDecimal(100), squareSize, 4, b.pos.x, b.pos.y, "white");
        }
        for (let index = 0; index < gameData.enemies.length; index++) {
            const e = gameData.enemies[index];
            for (let index2 = 0; index2 < e.bullets.length; index2++) {
                const b = e.bullets[index2];
                DrawSolidEnemy(ctx, new JBDecimal(100), new JBDecimal(100), squareSize, 4, b.pos.x, b.pos.y, "white");
            }
            let s = 10;
            if (e.type === "") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "white");
            }
            else if (e.type === "Fast") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "purple");
            }
            else if (e.type === "Ranged") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "orange");
            }
            else if (e.type === "Cannon") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "blue");
            }
            else if (e.type === "Bradley") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 20, e.pos.x, e.pos.y, "purple");
            }
            else if (e.type === "Trireme") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 20, e.pos.x, e.pos.y, "orange");
            }
            else if (e.type === "Tank") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 20, e.pos.x, e.pos.y, "white");
            }
            else if (e.type === "Cavalier") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 20, e.pos.x, e.pos.y, "blue");
            }
            else if (e.type === "Scorpion") {
                DrawHalfColorEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "blue", "purple");
            }
            else if (e.type === "Paladin") {
                DrawHalfColorEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 12, e.pos.x, e.pos.y, "blue", "orange");
            }
            else if (e.type === "Boss") {
                DrawSolidEnemy(ctx, e.CurrentHitPoints(), e.MaxHitPoints(), squareSize, 30, e.pos.x, e.pos.y, "red");
            }
            // ctx.globalAlpha =(e.CurrentHitPoints().divide(e.baseMaxHitPoints).ToNumber())
            // if(ctx.globalAlpha < 0.1) {
            //   ctx.globalAlpha = 0.1
            // }
            // ctx.fillRect(((e.pos.x + 10) * (squareSize/20)) - s/2, ((e.pos.y + 10) * (squareSize/20)) -s/2, s, s);
        }
        ctx.globalAlpha = 1;
        ctx.font = "10px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(gameData.world.currentTickLength + "ms", 10, 510);
        if (gameData.world.ticksLeftOver > 50) {
            ctx.fillText(getPrettyTimeFromMilliSeconds(gameData.world.ticksLeftOver) + " banked", 10, 500);
        }
        ctx.font = "15px Arial";
        ctx.fillText("Wave: " + gameData.world.currentWave, 10, 15);
        ctx.fillText("Unspawned: " + gameData.world.enemiesToSpawn.toString() + "(" + getSpecialsCount().toString() + ")", 10, 30);
        if (gameData.world.ticksToNextSpawn > 1000) {
            ctx.fillStyle = "red";
            ctx.fillText("Time to next enemy: " + getPrettyTimeFromMilliSeconds(gameData.world.ticksToNextSpawn), 10, 45);
        }
    }
    document.getElementById("auto1").classList.add("hidden");
    document.getElementById("auto2").classList.add("hidden");
    document.getElementById("auto3").classList.add("hidden");
    document.getElementById("auto4").classList.add("hidden");
    document.getElementById("auto5").classList.add("hidden");
    document.getElementById("auto6").classList.add("hidden");
    document.getElementById("auto7").classList.add("hidden");
    document.getElementById("auto8").classList.add("hidden");
    document.getElementById("auto9").classList.add("hidden");
    document.getElementById("auto10").classList.add("hidden");
    document.getElementById("auto11").classList.add("hidden");
    document.getElementById("auto12").classList.add("hidden");
    document.getElementById("auto13").classList.add("hidden");
    document.getElementById("auto14").classList.add("hidden");
    document.getElementById("auto15").classList.add("hidden");
    document.getElementById("auto16").classList.add("hidden");
    document.getElementById("auto17").classList.add("hidden");
    document.getElementById("auto18").classList.add("hidden");
    document.getElementById("auto19").classList.add("hidden");
    document.getElementById("auto20").classList.add("hidden");
    document.getElementById("auto21").classList.add("hidden");
    document.getElementById("auto22").classList.add("hidden");
    var highestwavemultiplier = 5 - gameData.rockUpgrades[2].bought - gameData.boulderUpgrades[2].bought;
    if (gameData.stats.highestEverWave >= 4 * highestwavemultiplier) {
        document.getElementById("auto1").classList.remove("hidden");
        document.getElementById("auto2").classList.remove("hidden");
        document.getElementById("auto3").classList.remove("hidden");
        document.getElementById("auto4").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 5 * highestwavemultiplier) {
        document.getElementById("auto5").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 6 * highestwavemultiplier) {
        document.getElementById("auto6").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 7 * highestwavemultiplier) {
        document.getElementById("auto7").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 8 * highestwavemultiplier) {
        document.getElementById("auto8").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 9 * highestwavemultiplier) {
        document.getElementById("auto9").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 10 * highestwavemultiplier) {
        document.getElementById("auto10").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 11 * highestwavemultiplier) {
        document.getElementById("auto11").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 12 * highestwavemultiplier) {
        document.getElementById("auto12").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 13 * highestwavemultiplier) {
        document.getElementById("auto13").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 14 * highestwavemultiplier) {
        document.getElementById("auto14").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 15 * highestwavemultiplier) {
        document.getElementById("auto15").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 16 * highestwavemultiplier) {
        document.getElementById("auto16").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 17 * highestwavemultiplier) {
        document.getElementById("auto17").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 18 * highestwavemultiplier) {
        document.getElementById("auto18").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 19 * highestwavemultiplier) {
        document.getElementById("auto19").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 20 * highestwavemultiplier) {
        document.getElementById("auto20").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 21 * highestwavemultiplier) {
        document.getElementById("auto21").classList.remove("hidden");
    }
    if (gameData.stats.highestEverWave >= 22 * highestwavemultiplier) {
        document.getElementById("auto22").classList.remove("hidden");
    }
    // for (let index = 5; index <= 26; index++) {
    //   if (gameData.stats.highestEverWave >= index * highestwavemultiplier) {
    //     document.getElementById("auto" + index).classList.remove('hidden');
    //   }
    // }
    document.getElementById("activeChallengeDescription").innerHTML = "";
    document.getElementById("btnChallengeQuit").classList.add("hidden");
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            document.getElementById("activeChallengeDescription").innerHTML += element.description + " - Wave Needed:" + element.waveRequiredforCompletion().toString() + "<br />";
            document.getElementById("btnChallengeQuit").classList.remove("hidden");
        }
        var spanName = "challenge" + index.toString() + "Description";
        document.getElementById(spanName).innerHTML = element.description;
        spanName = "challenge" + index.toString() + "Bonus";
        document.getElementById(spanName).innerHTML = element.bonusDescription;
        spanName = "challenge" + index.toString() + "Completed";
        document.getElementById(spanName).innerHTML = element.completed.toString();
        spanName = "challenge" + index.toString() + "DustNeeded";
        document.getElementById(spanName).innerHTML = element.waveRequiredforCompletion().toString();
        var startName = "btnChallenge" + index.toString() + "Start";
        if (element.active) {
            document.getElementById(startName).classList.add("hidden");
        }
        else {
            document.getElementById(startName).classList.remove("hidden");
        }
    }
    document.getElementById("prestige1count").innerHTML = gameData.stats.prestige1.toString();
    document.getElementById("prestige1time").innerHTML = getPrettyTimeFromMilliSeconds(gameData.stats.prestige1ticks);
    document.getElementById("prestige2count").innerHTML = gameData.stats.prestige2.toString();
    document.getElementById("prestige2time").innerHTML = getPrettyTimeFromMilliSeconds(gameData.stats.prestige2ticks);
    document.getElementById("prestige3count").innerHTML = gameData.stats.prestige3.toString();
    document.getElementById("prestige3time").innerHTML = getPrettyTimeFromMilliSeconds(gameData.stats.prestige3ticks);
    document.getElementById("highestwavereached").innerHTML = gameData.stats.highestEverWave.toString();
    var prestige1history = "<br />";
    for (let index = 0; index < gameData.stats.last10Prestige1amounts.length; index++) {
        const amt = gameData.stats.last10Prestige1amounts[index];
        const ticks = gameData.stats.last10Prestige1times[index];
        const tier = gameData.stats.last10Prestige1tier[index];
        const waves = gameData.stats.last10Prestige1waves[index];
        const rate = (amt / ticks) * 60 * 60 * 1000;
        var newline = index.toString() +
            " reached tier " +
            tier.toString() +
            " wave " +
            waves.toString() +
            " took " +
            getPrettyTimeFromMilliSeconds(ticks) +
            " and gave " +
            new JBDecimal(amt).ToString() +
            " for an average of: " +
            new JBDecimal(rate).ToString() +
            "/hr";
        prestige1history += newline + "</br />";
    }
    document.getElementById("prestige1history").innerHTML = prestige1history;
    var prestige2history = "<br />";
    for (let index = 0; index < gameData.stats.last10Prestige2amounts.length; index++) {
        const amt = gameData.stats.last10Prestige2amounts[index];
        const ticks = gameData.stats.last10Prestige2times[index];
        const rate = (amt / ticks) * 60 * 60 * 1000;
        var newline = index.toString() + " took " + getPrettyTimeFromMilliSeconds(ticks) + " and gave " + new JBDecimal(amt).ToString() + " for an average of: " + new JBDecimal(rate).ToString() + "/hr";
        prestige2history += newline + "</br />";
    }
    document.getElementById("prestige2history").innerHTML = prestige2history;
    var prestige3history = "<br />";
    for (let index = 0; index < gameData.stats.last10Prestige3amounts.length; index++) {
        const amt = gameData.stats.last10Prestige3amounts[index];
        const ticks = gameData.stats.last10Prestige3times[index];
        const rate = (amt / ticks) * 60 * 60 * 1000;
        var newline = index.toString() + " took " + getPrettyTimeFromMilliSeconds(ticks) + " and gave " + new JBDecimal(amt).ToString() + " for an average of: " + new JBDecimal(rate).ToString() + "/hr";
        prestige3history += newline + "</br />";
    }
    document.getElementById("prestige3history").innerHTML = prestige3history;
}
function changeTier(value) {
    CheckAchievementCompletions();
    if (value === "Down") {
        gameData.world.currentTier--;
        if (gameData.world.currentTier < 1) {
            gameData.world.currentTier = 1;
        }
    }
    if (value === "Up") {
        gameData.world.currentTier++;
        if (gameData.world.currentTier > gameData.world.tierUnlocked) {
            gameData.world.tierUnlocked = gameData.world.currentTier;
        }
    }
    init(2);
}
// adapted from: https://www.npmjs.com/package/intrinsic-scale
function getObjectFitSize(contains /* true = contain, false = cover */, containerWidth, containerHeight, width, height) {
    var doRatio = width / height;
    var cRatio = containerWidth / containerHeight;
    var targetWidth = 0;
    var targetHeight = 0;
    var test = contains ? doRatio > cRatio : doRatio < cRatio;
    if (test) {
        targetWidth = containerWidth;
        targetHeight = targetWidth / doRatio;
    }
    else {
        targetHeight = containerHeight;
        targetWidth = targetHeight * doRatio;
    }
    return {
        width: targetWidth,
        height: targetHeight,
        x: (containerWidth - targetWidth) / 2,
        y: (containerHeight - targetHeight) / 2,
    };
}
// function fix_dpi(canvas: HTMLCanvasElement, dpi: number) {
//   //create a style object that returns width and height
//     let style = {
//       height() {
//         return Number(+getComputedStyle(canvas).getPropertyValue('height').slice(0,-2));
//       },
//       width() {
//         return Number(+getComputedStyle(canvas).getPropertyValue('width').slice(0,-2));
//       }
//     }
//   //set the correct attributes for a crystal clear image!
//     canvas.setAttribute('width', (style.width() * dpi).toString());
//     canvas.setAttribute('height', (style.height() * dpi).toString());
//   }
function DrawSolidEnemy(ctx, CurrentHitPoints, MaxHitPoints, squareSize, enemysize, x, y, enemycolor) {
    ctx.globalAlpha = CurrentHitPoints.divide(MaxHitPoints).ToNumber();
    if (ctx.globalAlpha < 0.1) {
        ctx.globalAlpha = 0.1;
    }
    ctx.fillStyle = enemycolor;
    ctx.fillRect((x + 10) * (squareSize / 20) - enemysize / 2, (y + 10) * (squareSize / 20) - enemysize / 2, enemysize, enemysize);
}
function DrawHalfColorEnemy(ctx, CurrentHitPoints, MaxHitPoints, squareSize, enemysize, x, y, leftcolor, rightcolor) {
    ctx.globalAlpha = CurrentHitPoints.divide(MaxHitPoints).ToNumber();
    if (ctx.globalAlpha < 0.1) {
        ctx.globalAlpha = 0.1;
    }
    ctx.fillStyle = leftcolor;
    ctx.fillRect((x + 10) * (squareSize / 20) - enemysize / 2, (y + 10) * (squareSize / 20) - enemysize / 2, enemysize / 2, enemysize);
    ctx.fillStyle = rightcolor;
    ctx.fillRect((x + 10) * (squareSize / 20), (y + 10) * (squareSize / 20) - enemysize / 2, enemysize / 2, enemysize);
}
function quitChallenges() {
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            element.quit();
        }
    }
}
function pebblesFromPrestige() {
    var divisor = 10 - gameData.rockUpgrades[1].bought;
    var ret = gameData.resources.dust.amount.divide(divisor).floor();
    return ret;
}
function rocksFromPrestige() {
    var divisor = 1000 - (gameData.boulderUpgrades[1].bought * 10);
    var ret = gameData.resources.pebbles.amount;
    ret = ret.add(pebblesFromPrestige());
    ret = ret.divide(divisor).floor();
    return ret;
}
function bouldersFromPrestige() {
    var divisor = 1000 - (gameData.boulderUpgrades[1].bought * 10);
    var ret = gameData.resources.rocks.amount;
    ret = ret.add(rocksFromPrestige());
    ret = ret.divide(divisor).floor();
    return ret;
}
function prestige1() {
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            element.quit();
        }
    }
    init(1);
}
function prestige2() {
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            element.quit();
        }
    }
    init(2);
}
function prestige3() {
    for (let index = 0; index < gameData.challenges.length; index++) {
        const element = gameData.challenges[index];
        if (element.active) {
            element.quit();
        }
    }
    init(3);
}
function resetGame() {
    // eslint-disable-line no-unused-vars
    localStorage.clear();
    location.reload();
}
function getSpecialsCount() {
    return (gameData.world.bossEnemiesToSpawn +
        gameData.world.cannonEnemiesToSpawn +
        gameData.world.fastEnemiesToSpawn +
        gameData.world.rangedEnemiesToSpawn +
        gameData.world.tankEnemiesToSpawn +
        gameData.world.bradleyEnemiesToSpawn +
        gameData.world.triremeEnemiesToSpawn +
        gameData.world.cavalierEnemiesToSpwan +
        gameData.world.scorpionEnemiesToSpawn +
        gameData.world.paladinEnemiesToSpawn);
}
function getSpecialsArray() {
    var choicesArr = [];
    for (let index = 0; index < gameData.world.fastEnemiesToSpawn; index++) {
        choicesArr.push("F");
    }
    for (let index = 0; index < gameData.world.tankEnemiesToSpawn; index++) {
        choicesArr.push("T");
    }
    for (let index = 0; index < gameData.world.rangedEnemiesToSpawn; index++) {
        choicesArr.push("R");
    }
    for (let index = 0; index < gameData.world.bossEnemiesToSpawn; index++) {
        choicesArr.push("B");
    }
    for (let index = 0; index < gameData.world.cannonEnemiesToSpawn; index++) {
        choicesArr.push("C");
    }
    for (let index = 0; index < gameData.world.bradleyEnemiesToSpawn; index++) {
        choicesArr.push("b");
    }
    for (let index = 0; index < gameData.world.triremeEnemiesToSpawn; index++) {
        choicesArr.push("t");
    }
    for (let index = 0; index < gameData.world.cavalierEnemiesToSpwan; index++) {
        choicesArr.push("c");
    }
    for (let index = 0; index < gameData.world.scorpionEnemiesToSpawn; index++) {
        choicesArr.push("S");
    }
    for (let index = 0; index < gameData.world.paladinEnemiesToSpawn; index++) {
        choicesArr.push("P");
    }
    return choicesArr;
}
function getNumberOfEnemies(wave) {
    var tier = gameData.world.currentTier - 1;
    var div = wave - tier;
    if (div < 1) {
        div = 1;
    }
    return Math.floor(gameData.world.currentWave / div);
}
function resetSpawns(killexistingenemies = true) {
    gameData.world.currentWave++;
    if (gameData.world.currentWave > 100) {
        CheckAchievementCompletions(); //check before resetting to new tier
        if (gameData.world.currentTier === gameData.world.tierUnlocked) {
            changeTier("Up");
        }
        else {
            init(1);
        }
    }
    gameData.world.enemiesToSpawn = 9 + gameData.world.currentWave - gameData.rockUpgrades[12].bought;
    gameData.world.fastEnemiesToSpawn = getNumberOfEnemies(5);
    gameData.world.tankEnemiesToSpawn = getNumberOfEnemies(10);
    gameData.world.rangedEnemiesToSpawn = getNumberOfEnemies(15);
    gameData.world.cannonEnemiesToSpawn = getNumberOfEnemies(20);
    gameData.world.bradleyEnemiesToSpawn = getNumberOfEnemies(25);
    gameData.world.triremeEnemiesToSpawn = getNumberOfEnemies(30);
    gameData.world.cavalierEnemiesToSpwan = getNumberOfEnemies(35);
    gameData.world.scorpionEnemiesToSpawn = getNumberOfEnemies(40);
    gameData.world.paladinEnemiesToSpawn = getNumberOfEnemies(45);
    if (gameData.world.currentWave % 10 === 0) {
        gameData.world.bossEnemiesToSpawn = 1;
    }
    else {
        gameData.world.bossEnemiesToSpawn = 0;
    }
    if (killexistingenemies) {
        gameData.enemies = [];
        gameData.tower.damagetaken = new JBDecimal(0);
        gameData.tower.bullets = [];
        gameData.world.ticksToNextSpawn = 100000 * gameData.world.deathlevel;
    }
    else {
        addToDisplay("Wave " + (gameData.world.currentWave - 1) + " completed!", "story");
        gameData.world.ticksToNextSpawn = 1000;
    }
    if (gameData.world.enemiesToSpawn < getSpecialsCount()) {
        gameData.world.enemiesToSpawn = getSpecialsCount();
    }
    CheckAchievementCompletions();
}
function CheckAchievementCompletions() {
    lastachievementcount = 0;
    for (let index = 0; index < gameData.achievements.length; index++) {
        const element = gameData.achievements[index];
        element.checkforCompletion();
        if (element.completed) {
            lastachievementcount++;
        }
    }
    for (let index = 0; index < gameData.tier1Feats.length; index++) {
        const element = gameData.tier1Feats[index];
        element.checkforCompletion();
    }
    for (let index = 0; index < gameData.tier2Feats.length; index++) {
        const element = gameData.tier2Feats[index];
        element.checkforCompletion();
    }
}
function getAchievementCompletedCount() {
    var achievementcompleted = 0;
    for (let index = 0; index < gameData.achievements.length; index++) {
        const achievement = gameData.achievements[index];
        if (achievement.completed) {
            achievementcompleted++;
        }
    }
    return achievementcompleted;
}
function init(prestigelevel = 0) {
    if (typeof textToDisplay === "undefined") {
        textToDisplay = [];
        textToDisplayachievement = [];
        textToDisplaychallenge = [];
        textToDisplaygamesave = [];
        textToDisplayloot = [];
        textToDisplaystory = [];
        displayindex = 0;
    }
    if (prestigelevel >= 1) {
        textToDisplaygamesave = [];
        textToDisplayloot = [];
        textToDisplaystory = [];
        if (pebblesFromPrestige().greaterThan(0)) {
            gameData.stats.last10Prestige1amounts.unshift(pebblesFromPrestige().ToNumber());
            gameData.stats.last10Prestige1amounts.splice(10);
            gameData.stats.last10Prestige1times.unshift(gameData.stats.prestige1ticks);
            gameData.stats.last10Prestige1times.splice(10);
            gameData.stats.last10Prestige1waves.unshift(gameData.world.currentWave - 1);
            gameData.stats.last10Prestige1waves.splice(10);
            gameData.stats.last10Prestige1tier.unshift(gameData.world.currentTier);
            gameData.stats.last10Prestige1tier.splice(10);
        }
        gameData.stats.prestige1ticks = 0;
        gameData.stats.prestige1 += 1;
        gameData.stats.bestPrestige1Rate = new JBDecimal(0.00000000001);
        gameData.resources.pebbles.add(pebblesFromPrestige());
        gameData.resources.metal.amount = new JBDecimal(10);
        gameData.resources.dust.amount = new JBDecimal(0);
        gameData.resources.particles.amount = new JBDecimal(0);
        gameData.world.deathlevel = 0;
        gameData.world.currentWave = 0;
        gameData.world.highestWaveCompleted = 0;
        resetSpawns(true);
        for (let index = 0; index < gameData.derivatives.length; index++) {
            const element = gameData.derivatives[index];
            element.bought = 0;
            element.owned = new JBDecimal(0);
            if (gameData.rockUpgrades[11].bought) {
                if (index - 3 < gameData.upgrades[12].bought) {
                    //ehich derivatives recieve intial invnetory is controlled by which are unlocked
                    element.owned = new JBDecimal(gameData.stats.prestige2);
                }
            }
            element.upgradeLevel = 0;
        }
        for (let index = 0; index < gameData.speedDerivatives.length; index++) {
            const element = gameData.speedDerivatives[index];
            element.owned = new JBDecimal(element.bought);
        }
        gameData.producer.bought = 0;
        gameData.producer.owned = new JBDecimal(0);
        gameData.producer.upgradeLevel = 0;
        for (let index = 0; index < gameData.equipment.length; index++) {
            const element = gameData.equipment[index];
            element.bought = 0;
            element.owned = new JBDecimal(0);
            element.upgradeLevel = 0;
        }
        // gameData.equipment[0].bought = 0;
        // gameData.equipment[0].owned = new JBDecimal(0);
        // gameData.equipment[1].bought = 0;
        // gameData.equipment[1].owned = new JBDecimal(0);
    }
    if (prestigelevel >= 2) {
        if (rocksFromPrestige().greaterThan(0)) {
            gameData.stats.last10Prestige2amounts.unshift(rocksFromPrestige().ToNumber());
            gameData.stats.last10Prestige2amounts.splice(10);
            gameData.stats.last10Prestige2times.unshift(gameData.stats.prestige2ticks);
            gameData.stats.last10Prestige2times.splice(10);
        }
        textToDisplaychallenge = [];
        gameData.stats.bestPrestige2Rate = new JBDecimal(0.0000000001);
        gameData.stats.prestige2 += 1;
        gameData.stats.prestige2ticks = 0;
        gameData.stats.prestige1 = 0;
        gameData.resources.rocks.add(rocksFromPrestige());
        gameData.resources.pebbles.amount = new JBDecimal(0);
        for (let index = 0; index < gameData.challenges.length; index++) {
            const element = gameData.challenges[index];
            element.completed = 0;
        }
        for (let index = 0; index < gameData.upgrades.length; index++) {
            const element = gameData.upgrades[index];
            element.bought = 0;
            element.owned = new JBDecimal(0);
        }
    }
    if (prestigelevel >= 3) {
        if (bouldersFromPrestige().greaterThan(0)) {
            gameData.stats.last10Prestige3amounts.unshift(bouldersFromPrestige().ToNumber());
            gameData.stats.last10Prestige3amounts.splice(10);
            gameData.stats.last10Prestige3times.unshift(gameData.stats.prestige3ticks);
            gameData.stats.last10Prestige3times.splice(10);
        }
        gameData.stats.bestPrestige3Rate = new JBDecimal(0.0000000001);
        gameData.stats.prestige3 += 1;
        gameData.stats.prestige3ticks = 0;
        gameData.stats.prestige2 = 0;
        gameData.resources.boulders.add(bouldersFromPrestige());
        gameData.resources.rocks.amount = new JBDecimal(0);
        for (let index = 0; index < gameData.rockUpgrades.length; index++) {
            const element = gameData.rockUpgrades[index];
            element.bought = 0;
            element.owned = new JBDecimal(0);
        }
        for (let index = 0; index < gameData.derivatives.length; index++) {
            const element = gameData.derivatives[index];
            element.bought = 0;
            element.owned = new JBDecimal(0);
            element.upgradeLevel = 0;
        }
        for (let index = 0; index < gameData.speedDerivatives.length; index++) {
            const element = gameData.speedDerivatives[index];
            element.owned = new JBDecimal(0);
            element.bought = 0;
        }
        gameData.world.currentTier = 1;
    }
    if (prestigelevel === 0) {
        gameData = new saveGameData("new");
        var total = 0;
        for (let index = 1; index <= 1000; index++) {
            total += Math.ceil(Math.sqrt(index));
            internalInflationArray.push(total);
        }
        total = 0;
        for (let index = 0; index <= 100; index++) {
            total += index;
            achievementbonusarray.push(total);
        }
        var savegame = JSON.parse(localStorage.getItem("save"));
        if (savegame !== null) {
            gameData.name = savegame.name;
            if (typeof savegame.stats.prestige2 != "undefined") {
                gameData.stats.prestige2ticks = savegame.stats.prestige2ticks;
            }
            if (typeof savegame.stats.prestige3 != "undefined") {
                gameData.stats.bestPrestige3Rate.mantissa = savegame.stats.bestPrestige3Rate.mantissa;
                gameData.stats.bestPrestige3Rate.exponent = savegame.stats.bestPrestige3Rate.exponent;
                gameData.stats.last10Prestige3amounts = savegame.stats.last10Prestige3amounts;
                gameData.stats.last10Prestige3times = savegame.stats.last10Prestige3times;
                gameData.stats.prestige3 = savegame.stats.prestige3;
                gameData.stats.prestige3ticks = savegame.stats.prestige3ticks;
            }
            gameData.stats.prestige2 = savegame.stats.prestige2;
            gameData.stats.prestige1 = savegame.stats.prestige1;
            gameData.stats.prestige1ticks = savegame.stats.prestige1ticks;
            if (typeof savegame.stats.bestPrestige2Rate != "undefined") {
                gameData.stats.bestPrestige2Rate.mantissa = savegame.stats.bestPrestige2Rate.mantissa;
                gameData.stats.bestPrestige2Rate.exponent = savegame.stats.bestPrestige2Rate.exponent;
            }
            gameData.stats.bestPrestige1Rate.mantissa = savegame.stats.bestPrestige1Rate.mantissa;
            gameData.stats.bestPrestige1Rate.exponent = savegame.stats.bestPrestige1Rate.exponent;
            gameData.stats.highestEverWave = savegame.stats.highestEverWave;
            if (typeof savegame.stats.last10Prestige1tier != "undefined") {
                gameData.stats.last10Prestige1amounts = savegame.stats.last10Prestige1amounts;
                gameData.stats.last10Prestige1times = savegame.stats.last10Prestige1times;
                gameData.stats.last10Prestige1tier = savegame.stats.last10Prestige1tier;
                gameData.stats.last10Prestige1waves = savegame.stats.last10Prestige1waves;
            }
            if (typeof savegame.stats.last10Prestige2tier != "undefined") {
                gameData.stats.last10Prestige2amounts = savegame.stats.last10Prestige2amounts;
                gameData.stats.last10Prestige2times = savegame.stats.last10Prestige2times;
            }
            gameData.options.standardNotation = savegame.options.standardNotation;
            gameData.options.logNotBase = savegame.options.logNotBase;
            gameData.world.timeElapsed = savegame.world.timeElapsed;
            gameData.world.deathlevel = savegame.world.deathlevel;
            gameData.world.paused = savegame.world.paused;
            gameData.world.currentWave = savegame.world.currentWave;
            gameData.world.enemiesToSpawn = savegame.world.enemiesToSpawn;
            gameData.world.fastEnemiesToSpawn = savegame.world.fastEnemiesToSpawn;
            gameData.world.highestWaveCompleted = savegame.world.highestWaveCompleted;
            gameData.world.rangedEnemiesToSpawn = savegame.world.rangedEnemiesToSpawn;
            gameData.world.tankEnemiesToSpawn = savegame.world.tankEnemiesToSpawn;
            gameData.world.bradleyEnemiesToSpawn = savegame.world.bradleyEnemiesToSpawn;
            gameData.world.cannonEnemiesToSpawn = savegame.world.cannonEnemiesToSpawn;
            gameData.world.cavalierEnemiesToSpwan = savegame.world.cavalierEnemiesToSpwan;
            gameData.world.scorpionEnemiesToSpawn = savegame.world.scorpionEnemiesToSpawn;
            gameData.world.tierUnlocked = savegame.world.tierUnlocked;
            gameData.world.currentTier = savegame.world.currentTier;
            if (typeof savegame.world.paladinEnemiesToSpawn != "undefined") {
                gameData.world.paladinEnemiesToSpawn = savegame.world.paladinEnemiesToSpawn;
            }
            gameData.world.triremeEnemiesToSpawn = savegame.world.triremeEnemiesToSpawn;
            gameData.world.timeElapsed = savegame.world.timeElapsed;
            gameData.world.ticksToNextSpawn = savegame.world.ticksToNextSpawn;
            for (let index = 0; index < savegame.enemies.length; index++) {
                const element = savegame.enemies[index];
                var newEnemy = new Enemy(element.wave, element.enemycount);
                newEnemy.pos.x = element.pos.x;
                newEnemy.pos.y = element.pos.y;
                newEnemy.baseAttack.mantissa = element.baseAttack.mantissa;
                newEnemy.baseAttack.exponent = element.baseAttack.exponent;
                newEnemy.baseDefense.mantissa = element.baseDefense.mantissa;
                newEnemy.baseDefense.exponent = element.baseDefense.exponent;
                newEnemy.baseHeal.mantissa = element.baseHeal.mantissa;
                newEnemy.baseHeal.exponent = element.baseHeal.exponent;
                newEnemy.baseMaxHitPoints.mantissa = element.baseMaxHitPoints.mantissa;
                newEnemy.baseMaxHitPoints.exponent = element.baseMaxHitPoints.exponent;
                newEnemy.baseRange = element.baseRange;
                newEnemy.baseTickPerBullet = element.baseTickPerBullet;
                newEnemy.damagetaken.mantissa = element.damagetaken.mantissa;
                newEnemy.damagetaken.exponent = element.damagetaken.exponent;
                newEnemy.movementPerSec = element.movementPerSec;
                newEnemy.player = false;
                newEnemy.target.x = 0;
                newEnemy.target.y = 0;
                newEnemy.ticksToNextBullet = element.ticksToNextBullet;
                newEnemy.type = element.type;
                for (let index = 0; index < element.bullets.length; index++) {
                    const b = element.bullets[index];
                    var newBullet = new bullet(b.pos.x, b.pos.y, 0, 0, b.damage);
                    newEnemy.bullets.push(newBullet);
                }
                gameData.enemies.push(newEnemy);
            }
            gameData.tower.damagetaken.exponent = savegame.tower.damagetaken.exponent;
            gameData.tower.damagetaken.mantissa = savegame.tower.damagetaken.mantissa;
            gameData.tower.ticksToNextBullet = 0;
            gameData.resources.dust.amount.mantissa = savegame.resources.dust.amount.mantissa;
            gameData.resources.dust.amount.exponent = savegame.resources.dust.amount.exponent;
            gameData.resources.metal.amount.mantissa = savegame.resources.metal.amount.mantissa;
            gameData.resources.metal.amount.exponent = savegame.resources.metal.amount.exponent;
            gameData.resources.pebbles.amount.mantissa = savegame.resources.pebbles.amount.mantissa;
            gameData.resources.pebbles.amount.exponent = savegame.resources.pebbles.amount.exponent;
            gameData.resources.rocks.amount.mantissa = savegame.resources.rocks.amount.mantissa;
            gameData.resources.rocks.amount.exponent = savegame.resources.rocks.amount.exponent;
            if (typeof savegame.resources.boulders != "undefined") {
                gameData.resources.boulders.amount.mantissa = savegame.resources.boulders.amount.mantissa;
                gameData.resources.boulders.amount.exponent = savegame.resources.boulders.amount.exponent;
            }
            if (typeof savegame.resources.particles != "undefined") {
                gameData.resources.particles.amount.mantissa = savegame.resources.particles.amount.mantissa;
                gameData.resources.particles.amount.exponent = savegame.resources.particles.amount.exponent;
            }
            if (typeof savegame.resources.timeparticles != "undefined") {
                gameData.resources.timeparticles.amount.mantissa = savegame.resources.timeparticles.amount.mantissa;
                gameData.resources.timeparticles.amount.exponent = savegame.resources.timeparticles.amount.exponent;
            }
            for (let index = 0; index < savegame.upgrades.length; index++) {
                const element = savegame.upgrades[index];
                gameData.upgrades[index].bought = element.bought;
                gameData.upgrades[index].owned.exponent = element.owned.exponent;
                gameData.upgrades[index].owned.mantissa = element.owned.mantissa;
            }
            if (typeof savegame.rockUpgrades != "undefined") {
                for (let index = 0; index < savegame.rockUpgrades.length; index++) {
                    const element = savegame.rockUpgrades[index];
                    gameData.rockUpgrades[index].bought = element.bought;
                    gameData.rockUpgrades[index].owned.exponent = element.owned.exponent;
                    gameData.rockUpgrades[index].owned.mantissa = element.owned.mantissa;
                }
            }
            if (typeof savegame.boulderUpgrades != "undefined") {
                for (let index = 0; index < savegame.boulderUpgrades.length; index++) {
                    const element = savegame.boulderUpgrades[index];
                    gameData.boulderUpgrades[index].bought = element.bought;
                    gameData.boulderUpgrades[index].owned.exponent = element.owned.exponent;
                    gameData.boulderUpgrades[index].owned.mantissa = element.owned.mantissa;
                }
            }
            for (let index = 0; index < savegame.derivatives.length; index++) {
                const element = gameData.derivatives[index];
                element.bought = savegame.derivatives[index].bought;
                element.owned.mantissa = savegame.derivatives[index].owned.mantissa;
                element.owned.exponent = savegame.derivatives[index].owned.exponent;
                element.upgradeLevel = savegame.derivatives[index].upgradeLevel;
                //element.updateDisplay();
            }
            for (let index = 0; index < savegame.speedDerivatives.length; index++) {
                const element = gameData.speedDerivatives[index];
                element.bought = savegame.speedDerivatives[index].bought;
                element.owned.mantissa = savegame.speedDerivatives[index].owned.mantissa;
                element.owned.exponent = savegame.speedDerivatives[index].owned.exponent;
                element.upgradeLevel = savegame.speedDerivatives[index].upgradeLevel;
                //element.updateDisplay();
            }
            if (typeof savegame.timeDerivatives != "undefined") {
                for (let index = 0; index < savegame.timeDerivatives.length; index++) {
                    const element = gameData.timeDerivatives[index];
                    element.bought = savegame.timeDerivatives[index].bought;
                    element.owned.mantissa = savegame.timeDerivatives[index].owned.mantissa;
                    element.owned.exponent = savegame.timeDerivatives[index].owned.exponent;
                    element.upgradeLevel = savegame.timeDerivatives[index].upgradeLevel;
                    //element.updateDisplay();
                }
            }
            gameData.producer.bought = savegame.producer.bought;
            gameData.producer.owned.mantissa = savegame.producer.owned.mantissa;
            gameData.producer.owned.exponent = savegame.producer.owned.exponent;
            gameData.producer.upgradeLevel = savegame.producer.upgradeLevel;
            for (let index = 0; index < gameData.equipment.length; index++) {
                const element = gameData.equipment[index];
                element.bought = savegame.equipment[index].bought;
                element.owned.mantissa = savegame.equipment[index].owned.mantissa;
                element.owned.exponent = savegame.equipment[index].owned.exponent;
                element.upgradeLevel = savegame.equipment[index].upgradeLevel;
                //element.updateDisplay();
            }
            for (let index = 0; index < savegame.challenges.length; index++) {
                const element = gameData.challenges[index];
                element.active = savegame.challenges[index].active;
                element.completed = savegame.challenges[index].completed;
            }
            for (let index = 0; index < savegame.achievements.length; index++) {
                const element = savegame.achievements[index];
                gameData.achievements[index].completed = element.completed;
            }
            for (let index = 0; index < savegame.tier1Feats.length; index++) {
                const element = savegame.tier1Feats[index];
                gameData.tier1Feats[index].completed = element.completed;
            }
            if (typeof savegame.tier2Feats != "undefined") {
                for (let index = 0; index < savegame.tier2Feats.length; index++) {
                    const element = savegame.tier2Feats[index];
                    gameData.tier2Feats[index].completed = element.completed;
                }
            }
            if (typeof savegame.automation != "undefined") {
                for (let index = 0; index < savegame.automation.length; index++) {
                    const element = savegame.automation[index];
                    if (index === 0) {
                        const autoprestige1 = document.getElementById("autoprestige1");
                        if (element.item === 0) {
                            autoprestige1.checked = false;
                        }
                        else {
                            autoprestige1.checked = true;
                        }
                    }
                    else {
                        var itemName = "automation" + index + "item";
                        var valueName = "automation" + index + "value";
                        const autoitem = document.getElementById(itemName);
                        const autovalue = document.getElementById(valueName);
                        autoitem.selectedIndex = element.item;
                        autovalue.selectedIndex = element.value;
                    }
                }
            }
        }
    }
    CheckAchievementCompletions();
    initted = true;
}
function getAchievementsOnlyBonus() {
    if (achievementbonusarray.length < lastachievementcount) {
        addToDisplay("Consider upping the initial achievementbonusarray", "story");
        achievementbonusarray = [];
        var total = 0;
        for (let index = 0; index <= lastachievementcount; index++) {
            total += index;
            achievementbonusarray.push(total);
        }
    }
    return (achievementbonusarray[lastachievementcount] + 100) / 100;
}
function getTier1FeatBonus() {
    var tier1completed = 1; //no completions gives a multiplier of 1, 1 gives 2, etc.
    for (let index = 0; index < gameData.tier1Feats.length; index++) {
        const element = gameData.tier1Feats[index];
        if (element.completed) {
            tier1completed++;
        }
    }
    return tier1completed;
}
function getTier2FeatBonus() {
    var tier2completed = 1; //no completions gives a multiplier of 1, 1 gives 2, etc.
    for (let index = 0; index < gameData.tier2Feats.length; index++) {
        const element = gameData.tier2Feats[index];
        if (element.completed) {
            tier2completed++;
        }
    }
    return tier2completed;
}
function getAchievementBonus() {
    var value = getAchievementsOnlyBonus();
    return (value * getTier1FeatBonus() * getTier2FeatBonus());
}
// var average = 0;
// var cycles = 0
// var totalticks = 0
window.setInterval(function () {
    try {
        if (!initted) {
            if (document.readyState === "complete") {
                init(); // this seeds the init function, which will overwrite this data with the save if there is one
            }
            return; // still waiting on pageload
        }
        if (gameData.world.paused) {
            return;
        }
        var currentTime = new Date();
        var ticksForCurrentTick = currentTime.getTime() - gameData.world.lastProcessTick.getTime() + gameData.world.ticksLeftOver;
        if (ticksForCurrentTick > 50) {
            gameData.world.ticksLeftOver = ticksForCurrentTick - 50;
            ticksForCurrentTick = 50;
        }
        else {
            gameData.world.ticksLeftOver = 0;
        }
        gameData.world.lastProcessTick = Object.assign(currentTime);
        if (currentTime > gameData.world.nextSaveGameTime) {
            // displays latest uploaded version
            saveGame(currentTime);
        }
        processStuff(ticksForCurrentTick);
        updateGUI();
        // totalticks += ticksForCurrentTick;
        // cycles++;
        // average = totalticks/cycles;
        // if(cycles%1000 === 0) {
        //   addToDisplay(average.toFixed(2), 'story')
        //   cycles = 0;
        //   totalticks = 0;
        // }
    }
    catch (error) {
        logMyErrors(error);
    }
}, 1);
//# sourceMappingURL=main.js.map