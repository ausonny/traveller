class Derivative extends Purchasable {
  name: string;

  index: number;

  buyButton: HTMLElement;

  //lastProduction: JBDecimal;

  basicUpgrade: Upgrade;

  productionMultiplier: number;

  constructor(
    name: string,
    index: number,
    cost: number,
    costMultiplier: number,
    resource: Resource,
    upgradeResource: Resource,
    buyButton: HTMLElement,
    upgradeButton: HTMLElement,
    basicUpgrade: Upgrade,
    inflationFloor: number,
    productionMultiplier: number,
    upgradeable: boolean,
  ) {
    super(cost, costMultiplier, resource, 1, 2, upgradeResource, inflationFloor, 0, buyButton, upgradeable, upgradeButton);
    this.name = name;
    this.index = index;
    //this.lastProduction = new JBDecimal(0);
    this.basicUpgrade = basicUpgrade
    this.productionMultiplier = productionMultiplier;
  }

  production(ticks:number = gameData.world.currentTickLength) {
    var val = this.owned.floor().add(this.basicUpgrade.owned).add(this.upgradeLevel);
    if(val.equals(0)) {
      return new JBDecimal(0); 
    }
    val = val.multiply(this.basicUpgrade.getBonus());
    val = val.multiply(new JBDecimal(2).pow(this.upgradeLevel));
    var modifiedticks = getTimeParticleBonus().multiply(ticks)
    val = val.multiply(modifiedticks.divide(1000));

    val = val.multiply(gameData.producer.production())
    val = val.multiply(gameData.upgrades[13].getBonus())
    val = val.multiply(gameData.upgrades[14].getBonus())
    val = val.multiply(gameData.upgrades[15].getBonus())
    val = val.multiply(this.productionMultiplier);

    val = val.multiply(getParticleBonus());

    val = val.multiply(Math.pow(2, gameData.boulderUpgrades[4].bought))

    if(gameData.upgrades[5].owned.greaterThan(0)){
      var perlevel = gameData.upgrades[5].getBonus()
      var qtymult = new JBDecimal(perlevel).multiply(this.bought)
      qtymult = qtymult.add(1);
      val = val.multiply(qtymult)
    }
    return val;
  }

  productionPerSecDisplay() {
    var val = new JBDecimal(this.production(1000))
    return val;
  }

  // percentageIncrease() {
  //   if (this.lastProduction.mantissa === 0) {
  //     return new JBDecimal(0);
  //   }
  //   var val = new JBDecimal(this.owned.subtract(this.lastProduction));
  //   val = val.divide(this.lastProduction).multiply(gameData.world.currentTickLength).multiply(1000);
  //   return val;
  // }

  // percentageIncreaseDisplay() {
  //   var val = new JBDecimal(this.percentageIncrease());
  //   return val;
  // }
}
  
  class Producer extends Purchasable {
    name: string;
  
    index: number;
  
    buyButton: HTMLElement;
  
    lastProduction: JBDecimal;
  
    basicUpgrade: Upgrade;
  
    productionMultiplier: number
  
    constructor(
      name: string,
      index: number,
      cost: number,
      costMultiplier: number,
      resource: Resource,
      upgradeResource: Resource,
      buyButton: HTMLElement,
      upgradeButton: HTMLElement,
      basicUpgrade: Upgrade,
      inflationFloor: number
    ) {
      super(cost, costMultiplier, resource, 1, 2, upgradeResource, inflationFloor, 0, buyButton, true, upgradeButton);
      this.name = name;
      this.index = index;
      this.lastProduction = new JBDecimal(0);
      this.basicUpgrade = basicUpgrade;
    }
  
    production() {
      var val = this.owned.floor().add(this.basicUpgrade.owned).add(this.upgradeLevel);
      val = val.multiply(2);
      if (gameData.challenges[3].active) {
        return new JBDecimal(1);
      }
      var base = .01;
      if(gameData.upgrades[16].bought > 0) {
        base *= 2;
      }
      if(gameData.rockUpgrades[3].bought > 0) {
        base *= 2;
      }
  
  
      var challengebonus = 1.1 + (base * ((gameData.challenges[3].completed/4) + this.upgradeLevel))
      var ret = new JBDecimal(challengebonus).pow(val.ToNumber());
      return ret;
    }
  
    productionPerSecDisplay() {
      var val = new JBDecimal(this.production())
      return val;
    }
  
    percentageIncrease() {
      if (this.lastProduction.mantissa === 0) {
        return new JBDecimal(0);
      }
      var val = new JBDecimal(this.owned.subtract(this.lastProduction));
      val = val.divide(this.lastProduction).multiply(gameData.world.currentTickLength);
      return val;
    }
  
    percentageIncreaseDisplay() {
      var val = new JBDecimal(this.percentageIncrease());
      return val;
    }
  }

  class Derivative2 extends Purchasable {
    name: string;
  
    index: number;
  
    buyButton: HTMLElement;
  
    // lastProduction: JBDecimal;
  
    basicUpgrade: Upgrade;
  
    productionMultiplier: number;
  
    constructor(
      name: string,
      index: number,
      cost: number,
      costMultiplier: number,
      resource: Resource,
      upgradeResource: Resource,
      buyButton: HTMLElement,
      upgradeButton: HTMLElement,
      basicUpgrade: Upgrade,
      inflationFloor: number,
      productionMultiplier: number,
      upgradeable: boolean,
    ) {
      super(cost, costMultiplier, resource, 1, 2, upgradeResource, inflationFloor, 0, buyButton, upgradeable, upgradeButton);
      this.name = name;
      this.index = index;
      //this.lastProduction = new JBDecimal(0);
      this.basicUpgrade = basicUpgrade
      this.productionMultiplier = productionMultiplier;
    }
  
    production(ticks:number = gameData.world.currentTickLength) {
      var val = this.owned.floor().add(this.basicUpgrade.owned).add(this.upgradeLevel);
      if(val.equals(0)) {
        return new JBDecimal(0); 
      }
      //val = val.multiply(this.basicUpgrade.getBonus());
      //val = val.multiply(new JBDecimal(2).pow(this.upgradeLevel));
      val = val.multiply(ticks / 1000);
  
      // val = val.multiply(gameData.upgrades[13].getBonus())
      // val = val.multiply(gameData.upgrades[14].getBonus())
      // val = val.multiply(gameData.upgrades[15].getBonus())

      val = val.multiply(this.productionMultiplier);
  
      if(gameData.upgrades[5].owned.greaterThan(0)){
        var perlevel = gameData.upgrades[5].getBonus()
        var qtymult = new JBDecimal(perlevel).multiply(this.bought)
        qtymult = qtymult.add(1);
        val = val.multiply(qtymult)
      }
      return val;
    }
  
    productionPerSecDisplay() {
      var val = new JBDecimal(this.production(1000))
      return val;
    }
  
    // percentageIncrease() {
    //   if (this.lastProduction.mantissa === 0) {
    //     return new JBDecimal(0);
    //   }
    //   var val = new JBDecimal(this.owned.subtract(this.lastProduction));
    //   val = val.divide(this.lastProduction).multiply(gameData.world.currentTickLength).multiply(1000);
    //   return val;
    // }
  
    // percentageIncreaseDisplay() {
    //   var val = new JBDecimal(this.percentageIncrease());
    //   return val;
    // }
  }