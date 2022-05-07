class Purchasable {
    baseCost: JBDecimal;
  
    costMultiplier: number;
  
    baseResource: Resource;
  
    upgradeCost: JBDecimal;
  
    upgradeCostMultiplier: number;
  
    upgradeResource: Resource;
  
    inflationFloor: number;
  
    owned: JBDecimal;
  
    bought: number;
  
    limit: number;
  
    addedlimit: number;
  
    buyButton: HTMLElement;
  
    upgradeable: boolean;
  
    upgradeLevel: number;
  
    upgradeButton: HTMLElement;
  
    constructor(baseCost: number, costMultiplier: number, baseResource: Resource, upgradeCost: number, upgradeCostMultiplier: number, upgradeResource: Resource, inflationFloor: number, limit: number, buyButton: HTMLElement, upgradeable: boolean, upgradeButton: HTMLElement) {
      this.baseCost = new JBDecimal(baseCost);
      this.costMultiplier = costMultiplier;
      this.baseResource = baseResource
      this.inflationFloor = inflationFloor;
      this.limit = limit;
      this.owned = new JBDecimal(0);
      this.bought = 0;
      this.buyButton = buyButton;
      this.upgradeable = upgradeable;
      this.upgradeCost = new JBDecimal(upgradeCost);
      this.upgradeCostMultiplier = upgradeCostMultiplier;
      this.upgradeResource = upgradeResource
      this.upgradeLevel = 0;
      this.upgradeButton = upgradeButton;
      this.addedlimit = 0;
    }
  
    currentInflationFloor() {
      if (gameData.challenges[0].active) {
        return 1;
      }
  
      var ret = this.inflationFloor
  
      if(gameData.challenges[0].completed > 0) {
        const bonus = 1.05 + (gameData.rockUpgrades[0].bought * 0.05)
        ret *= Math.pow(bonus, gameData.challenges[0].completed);
      }
      return ret
    }
  
    buyUpgradeCost(amt: JBDecimal = new JBDecimal(1)) {
      var count = 0;
      var ret = new JBDecimal(0);
  
      while (amt.greaterThan(count)) {
        var unitno = this.upgradeLevel;
        var unitMultiplier = new JBDecimal(this.upgradeCostMultiplier).pow(unitno);
        let costTemp = this.upgradeCost.multiply(unitMultiplier)
        ret = ret.add(costTemp);
        count++;
      }
      return ret;
    }
  
    internalInflationCost(increase: number) {
      if (internalInflationArray.length < increase) {
        addToDisplay('Consider upping the initial internalinflationarray', 'story')
        internalInflationArray = [];
        var total = 0;
        for (let index = 1; index <= increase; index++) {
          total += Math.ceil(Math.sqrt(index));
          internalInflationArray.push(total);        
        }
      }
      return internalInflationArray[increase];
    }
  
    buyCost(amt: JBDecimal = new JBDecimal(1)) {
      if(this.baseCost.equals(0)) {
        return new JBDecimal(0);
      }
      if( this.costMultiplier === 0) {
        return new JBDecimal(this.bought + 1);
      }
      var count = 0;
      var qtyToUse = 0;
      while (amt.greaterThan(count)) {
        count++;
        var itemQty = this.bought + count;
        if(this.inflationFloor > 0) {
          if (itemQty > this.currentInflationFloor()) {
            var increase = Math.ceil(itemQty - this.currentInflationFloor());
            itemQty += this.internalInflationCost(increase);
          }
        }
        qtyToUse += itemQty;
      }
      count = this.bought;
      var ret = new JBDecimal(this.baseCost.multiply(new JBDecimal(this.costMultiplier).pow(qtyToUse-1)));
      return ret;
    }
  
    affordBuy(amt: JBDecimal = new JBDecimal(1)) {
      if(this.limit > 0 && this.bought >= (this.limit + this.addedlimit)) {
        return false;
      } else if(this.buyCost(amt).greaterThan(this.baseResource.amount)) {
        return false;
      }
      return true;
    }
  
    afforUpgradeBuy(amt: JBDecimal = new JBDecimal(1)) {
      if(this.buyUpgradeCost(amt).greaterThan(this.upgradeResource.amount)) {
        return false;
      }
      return true;
    }
  
    buyUpgrade(amt: JBDecimal = new JBDecimal(1)) {
      var count = 0;
      while (this.afforUpgradeBuy() && amt.greaterThan(count)) {
        this.upgradeResource.subtract(this.buyUpgradeCost());
        this.upgradeLevel++;
        //this.bought = new JBDecimal(1);
        //this.owned = new JBDecimal(1);
        count++
      }
    }
  
    buy(amt: JBDecimal = new JBDecimal(1)) {
      var count = 0;
      while (this.affordBuy() && amt.greaterThan(count)) {
        if(this.limit > 0 && this.bought > (this.limit + this.addedlimit)) {
          return;
        }
  
        this.baseResource.subtract(this.buyCost())
  
        this.bought++;
        this.owned = this.owned.add(1);
        count++

        CheckAchievementCompletions()
      }
    }
  
    updateDisplay() {
      var amt = new JBDecimal(1);
      // if(this.multiBuyEligible) {
      //   amt = gameData.options.MultiBuys;
      // }
      if (this.limit > 0 && this.bought >= (this.limit + this.addedlimit)) {
        this.buyButton.classList.add("btn-success");
        this.buyButton.classList.remove("btn-danger");
        this.buyButton.classList.remove("btn-primary");
      } else if (this.affordBuy(amt)) {
        this.buyButton.classList.add("btn-primary");
        this.buyButton.classList.remove("btn-danger");
        this.buyButton.classList.remove("btn-success");
      } else {
        this.buyButton.classList.add("btn-danger");
        this.buyButton.classList.remove("btn-primary");
        this.buyButton.classList.remove("btn-success");
      }
  
      try {
        this.buyButton.innerHTML = this.baseResource.name + ': ' + this.buyCost().ToString() + '</br>'
  
        if(this.upgradeable) {
          amt = new JBDecimal(1);
          if (this.afforUpgradeBuy(amt)) {
            this.upgradeButton.classList.add("btn-primary");
            this.upgradeButton.classList.remove("btn-danger");
            this.upgradeButton.classList.remove("btn-success");
          } else {
            this.upgradeButton.classList.add("btn-danger");
            this.upgradeButton.classList.remove("btn-primary");
            this.upgradeButton.classList.remove("btn-success");
          }
          this.upgradeButton.innerHTML = this.upgradeResource.name + ': ' + this.buyUpgradeCost().ToString()
        }
  
      } catch (error) {
        logMyErrors(error);
      }
  
    }
  }