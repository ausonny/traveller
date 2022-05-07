class Equipment extends Purchasable {
    constructor(name, index, cost, costMultiplier, resource, upgraderesource, buyButton, dustUpgradeButton, dustUpgradeBaseCost, dustUpgradeCostMultiplier, basicUpgrade, basicChallenge, inflationFloor) {
        var upgradeable = true;
        if (basicUpgrade.name == 'd') {
            upgradeable = false;
        }
        super(cost, costMultiplier, resource, dustUpgradeBaseCost, dustUpgradeCostMultiplier, upgraderesource, inflationFloor, 0, buyButton, upgradeable, dustUpgradeButton);
        this.name = name;
        this.index = index;
        this.basicUpgrade = basicUpgrade;
        this.basiChallenge = basicChallenge;
    }
    productionPerUnit() {
        var ret = new JBDecimal(this.basicUpgrade.owned);
        ret = ret.add(this.upgradeLevel);
        if (this.basiChallenge.completed > 0) {
            ret = ret.add(this.basiChallenge.completed);
        }
        if (gameData.rockUpgrades[4].bought > 0 && this.index === 0) {
            ret = ret.multiply(new JBDecimal(2).pow(gameData.rockUpgrades[4].bought));
        }
        if (gameData.rockUpgrades[8].bought > 0 && this.index === 1) {
            ret = ret.multiply(new JBDecimal(2).pow(gameData.rockUpgrades[8].bought));
        }
        // if(gameData.rockUpgrades[9].bought > 0 && this.index === 3) {
        //   ret = ret.multiply(new JBDecimal(2).pow(gameData.rockUpgrades[9].bought))
        // }
        // if(gameData.rockUpgrades[10].bought > 0 && this.index === 2) {
        //   ret = ret.multiply(new JBDecimal(2).pow(gameData.rockUpgrades[10].bought))
        // }
        ret = ret.add(1);
        ret = ret.multiply(getAchievementBonus());
        if (gameData.upgrades[17].owned.greaterThan(0)) {
            var perlevel = gameData.upgrades[17].owned.ToNumber() / 100;
            var qtymult = new JBDecimal(perlevel).multiply(this.bought);
            qtymult = qtymult.add(1);
            ret = ret.multiply(qtymult);
        }
        ret = ret.multiply(0.1);
        return ret;
    }
    production() {
        var ret = this.productionPerUnit().multiply(this.owned.add(this.basiChallenge.completed + this.basicUpgrade.bought));
        return ret;
    }
}
//# sourceMappingURL=Equipment.js.map