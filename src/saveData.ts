class saveGameData {
    name: string;
  
    options: {
      standardNotation: number;
      logNotBase: number;
    };
  
    world: {
      timeElapsed: number;
      paused: boolean;
      currentTickLength: number;
      ticksLeftOver: number;
      nextSaveGameTime: Date;
      lastProcessTick: Date;
      currentWave: number;
      currentTier: number;
      tierUnlocked: number;
      highestWaveCompleted: number;
      enemiesToSpawn: number;
      ticksToNextSpawn: number;
      fastEnemiesToSpawn: number;
      tankEnemiesToSpawn: number;
      rangedEnemiesToSpawn: number;
      cannonEnemiesToSpawn: number;
      bradleyEnemiesToSpawn: number;
      triremeEnemiesToSpawn: number;
      cavalierEnemiesToSpwan: number;
      scorpionEnemiesToSpawn: number;
      paladinEnemiesToSpawn: number;
      bossEnemiesToSpawn: number;
      deathlevel: number;
    };
  
    tower: Tower;
  
    enemies: Enemy[];
  
    resources: {
      metal: Resource;
      dust: Resource;
      pebbles: Resource;
      rocks: Resource;
      particles: Resource;
      boulders: Resource;
      timeparticles: Resource;
    };
  
    upgrades: Upgrade[];
  
    rockUpgrades: Upgrade[];

    boulderUpgrades: Upgrade[];
  
    dummyUpgrade: Upgrade;
  
    dummyChallenge: Challenge;
  
    producer: Producer;
  
    derivatives: Derivative[];
  
    speedDerivatives: Derivative[];

    timeDerivatives: Derivative[];
  
    equipment: Equipment[];
  
    achievements: achievement[];
    
    tier1Feats: achievement[];

    tier2Feats: achievement[];

    challenges: Challenge[];
  
    stats: {
      prestige1: number;
      prestige2: number;
      prestige3: number;
      prestige1ticks: number;
      prestige2ticks: number
      prestige3ticks: number
      bestPrestige1Rate: JBDecimal;
      bestPrestige2Rate: JBDecimal;
      bestPrestige3Rate: JBDecimal;
      highestEverWave: number;
      last10Prestige1times: number[]; 
      last10Prestige1amounts: number[];
      last10Prestige1waves: number[];
      last10Prestige1tier: number[];
      last10Prestige2times: number[]; 
      last10Prestige2amounts: number[]; 
      last10Prestige3times: number[]; 
      last10Prestige3amounts: number[]; 
    }
  
    automation: Automation[];
  
    constructor(name: string) {
      this.name = name;
  
      this.dummyChallenge = new Challenge('d,', 'd', 0, 0);
      this.dummyUpgrade = new Upgrade('d', 'd', 0, 1, new Resource('d'), document.getElementById("btnBuyUpgrade0"), 0, 1)
  
      this.stats = {
        prestige1: 0,
        prestige2: 0,
        prestige3: 0,
        prestige1ticks: 0,
        prestige2ticks: 0,
        prestige3ticks: 0,
        bestPrestige1Rate: new JBDecimal(0),
        bestPrestige2Rate: new JBDecimal(0),
        bestPrestige3Rate: new JBDecimal(0),
        highestEverWave: 0,
        last10Prestige1amounts: [],
        last10Prestige1times: [],
        last10Prestige1tier: [],
        last10Prestige1waves: [],
        last10Prestige2amounts: [],
        last10Prestige2times: [],
        last10Prestige3amounts: [],
        last10Prestige3times: []
      }
  
      this.tower = new Tower();
  
      this.enemies = [];
  
      this.options = {
        logNotBase: 1,
        standardNotation: 1
      };
      this.resources = {
        metal: new Resource('Metal'),
        dust: new Resource('Dust'),
        pebbles: new Resource('Pebbles'),
        rocks: new Resource('Rocks'),
        particles: new Resource('Particles'),
        boulders: new Resource('Boulders'),
        timeparticles: new Resource('TimeParticles')
      };
  
      this.resources.metal.amount = new JBDecimal(10);
  
      this.world = {
        timeElapsed: 0,
        paused: false,
        currentTickLength: 0,
        ticksLeftOver: 0,
        lastProcessTick: new Date(),
        nextSaveGameTime: new Date(),
        currentWave: 0,
        currentTier: 1,
        tierUnlocked: 1,
        highestWaveCompleted: 0,
        enemiesToSpawn: 0,
        ticksToNextSpawn: 1000,
        fastEnemiesToSpawn: 0,
        tankEnemiesToSpawn: 0,
        rangedEnemiesToSpawn: 0,
        cannonEnemiesToSpawn: 0,
        bradleyEnemiesToSpawn: 0,
        triremeEnemiesToSpawn: 0,
        cavalierEnemiesToSpwan: 0,
        scorpionEnemiesToSpawn: 0,
        paladinEnemiesToSpawn: 0,
        bossEnemiesToSpawn: 0,
        deathlevel: 0
      };
      this.world.nextSaveGameTime.setMilliseconds(this.world.nextSaveGameTime.getMilliseconds() + 1000 * 60 *5)
  
      this.automation = [];
  
      for (let index = 0; index < 23; index++) {
        var newRule = new Automation(0,0);
        this.automation.push(newRule);        
      }
  
      this.upgrades = [];
      this.upgrades.push(new Upgrade("Upgrade0",'Miners double productivity', 1, 1.4, this.resources.pebbles, document.getElementById("btnBuyUpgrade0"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade1",'Supervisors double productivity', 2, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade1"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade2",'Foremen double productivity', 4, 1.6, this.resources.pebbles, document.getElementById("btnBuyUpgrade2"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade3",'Adds .1 to base Attack<br />', 1, 1.4, this.resources.pebbles, document.getElementById("btnBuyUpgrade3"), 10, 6));
      this.upgrades.push(new Upgrade("Upgrade4",'Adds 5 to base Hull<br />', 1, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade4"), 10, 6));
      this.upgrades.push(new Upgrade("Upgrade5",'Each metal producer bought increases production by 1%', 1, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade5"), 10, 7));
      this.upgrades.push(new Upgrade("Upgrade6",'Loot + 10% additive', 1, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade6"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade7",'Managers double productivity', 10, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade7"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade8",'Middle Managers double productivity', 100, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade8"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade9",'Upper Managers double productivity', 1000, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade9"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade10",'Vice Presidents double productivity', 10000, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade10"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade11",'Presidents double productivity', 100000, 1.5, this.resources.pebbles, document.getElementById("btnBuyUpgrade11"), 10, 2));
      this.upgrades.push(new Upgrade("Upgrade12",'Unlock new Metal Producer', 10, 10, this.resources.pebbles, document.getElementById("btnBuyUpgrade12"), 5, 2));
      this.upgrades.push(new Upgrade("Upgrade13",'Bonus to production from current run time', 1, 1, this.resources.pebbles, document.getElementById("btnBuyUpgrade13"), 1, 5));
      this.upgrades.push(new Upgrade("Upgrade14",'Bonus from unspent pebbles', 5, 1, this.resources.pebbles, document.getElementById("btnBuyUpgrade14"), 1, 3));
      this.upgrades.push(new Upgrade("Upgrade15",'Bonus from prestiging', 1, 1, this.resources.pebbles, document.getElementById("btnBuyUpgrade15"), 1, 1));
      this.upgrades.push(new Upgrade("Upgrade16",'Double bonus from Production Challenges', 100, 1, this.resources.pebbles, document.getElementById("btnBuyUpgrade16"), 1, 1));
      this.upgrades.push(new Upgrade("Upgrade17",'Each attack or hull bought increases strength by 1%', 10, 10, this.resources.pebbles, document.getElementById("btnBuyUpgrade17"), 1, 7));
  
      this.rockUpgrades = [];
      this.rockUpgrades.push(new Upgrade("Upgrade0",'Increase Effectiveness of Inflation Challenges', 1, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade0"), 10, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade1",'Reduce cost of pebbles by one Dust<br />', 1, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade1"), 8, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade2",'Increase automation slots<br />', 1, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade2"), 1, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade3",'Double bonus from Production Challenges<br />', 1, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade3"), 1, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade4",'Double bonus from Attack bonuses<br />', 1, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade4"), 10, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade5",'Increase upgrade limits on certain pebble upgrades', 10, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade5"), 1, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade6",'Double bonus from Loot pebble upgrade<br />', 100, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade6"), 1, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade7",'Reduce Cost Multiplier of Producer<br />', 10, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade7"), 8, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade8",'Double bonus from Health bonuses<br />', 1, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade8"), 10, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade9",'Double bonus from Heal bonuses<br />', 5, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade9"), 10, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade10",'Double bonus from Shield bonuses<br />', 10, 10, this.resources.rocks, document.getElementById("btnBuyRockUpgrade10"), 10, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade11",'Each unlocked Metal producer begins with 1 owned per rock prestige', 1, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade11"), 1, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade12",'Each wave contains one fewer drone<br />', 1, 0, this.resources.rocks, document.getElementById("btnBuyRockUpgrade12"), 100, 2));
      this.rockUpgrades.push(new Upgrade("Upgrade13",'Dummy%<br />', 10, 1, this.resources.rocks, document.getElementById("btnBuyRockUpgrade13"), 1, 7));

      this.boulderUpgrades = [];
      this.boulderUpgrades.push(new Upgrade("Upgrade0",'Lower Challenge Limit by 1<br />', 1, 10, this.resources.boulders, document.getElementById("btnBuyBoulderUpgrade0"), 1, 2));
      this.boulderUpgrades.push(new Upgrade("Upgrade1",'Reduce cost of rocks by one hundred pebbles', 10, 10, this.resources.boulders, document.getElementById("btnBuyBoulderUpgrade1"), 8, 2));
      this.boulderUpgrades.push(new Upgrade("Upgrade2",'Increase automation slots<br />', 1, 1, this.resources.boulders, document.getElementById("btnBuyBoulderUpgrade2"), 1, 2));
      this.boulderUpgrades.push(new Upgrade("Upgrade3",'Increase upgrade limits on certain pebble upgrades', 10, 1, this.resources.boulders, document.getElementById("btnBuyBoulderUpgrade3"), 1, 2));
      this.boulderUpgrades.push(new Upgrade("Upgrade4",'Double Production of all metal producers', 1, 1, this.resources.boulders, document.getElementById("btnBuyBoulderUpgrade4"), 1, 2));
  
      var miner = new Derivative("Miner", 0, 10, 1.5, this.resources.metal, this.resources.dust, document.getElementById("btnBuyMiner"), document.getElementById("btnBuyMinerDustUpgrade"), this.upgrades[0], 20, 1, true);
      var supervisor = new Derivative("Supervisor", 1, 100, 1.6, this.resources.metal, this.resources.dust, document.getElementById("btnBuySupervisor"), document.getElementById("btnBuySupervisorDustUpgrade"), this.upgrades[1], 20, 1, true);
      var foreman = new Derivative("Foreman", 2, 10000, 1.7, this.resources.metal, this.resources.dust, document.getElementById("btnBuyForeman"), document.getElementById("btnBuyForemanDustUpgrade"), this.upgrades[2], 20, 1, true);
      var manager = new Derivative("Manager", 3, 10000000, 1.8, this.resources.metal, this.resources.dust, document.getElementById("btnBuyManager"), document.getElementById("btnBuyManagerDustUpgrade"), this.upgrades[7], 20, 1, true);
      var middlemanagement = new Derivative("Middle Management", 4, 10000000000, 1.9, this.resources.metal, this.resources.dust, document.getElementById("btnBuyMiddleManagement"), document.getElementById("btnBuyMiddleManagerDustUpgrade"), this.upgrades[8], 20, 1, true);
      var uppermanagement = new Derivative("Upper Management", 5, 10000000000000, 2.0, this.resources.metal, this.resources.dust, document.getElementById("btnBuyUpperManagement"), document.getElementById("btnBuyUpperManagementDustUpgrade"), this.upgrades[9], 20, 1, true);
      var vicepresident = new Derivative("Vice President", 6, 1e16, 2.1, this.resources.metal, this.resources.dust, document.getElementById("btnBuyVicePresident"), document.getElementById("btnBuyVicePresidentDustUpgrade"), this.upgrades[10], 20, 1, true);
      var president = new Derivative("President", 7, 1e19, 2.2, this.resources.metal, this.resources.dust, document.getElementById("btnBuyPresident"), document.getElementById("btnBuyPresidentDustUpgrade"), this.upgrades[11], 20, 1, true);
  
      this.producer = new Producer('Production Multiplier', 0, 1000, 10,  this.resources.metal, this.resources.dust, document.getElementById("btnBuyProduction"), document.getElementById("btnBuyProductionDustUpgrade"), this.dummyUpgrade, 20)
  
      this.derivatives = [];
      this.derivatives.push(miner);
      this.derivatives.push(supervisor);
      this.derivatives.push(foreman);
      this.derivatives.push(manager);
      this.derivatives.push(middlemanagement);
      this.derivatives.push(uppermanagement);
      this.derivatives.push(vicepresident);
      this.derivatives.push(president);
  
      this.speedDerivatives = [];
      this.speedDerivatives.push( new Derivative2('Speed', 0, 1, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuySpeed"), document.getElementById("btnBuySpeed"), this.dummyUpgrade, 0, 1, false))
      this.speedDerivatives.push( new Derivative2('Acceleration', 0, 10, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuyAcceleration"), document.getElementById("btnBuyAcceleration"), this.dummyUpgrade, 0, 1, false))
      this.speedDerivatives.push( new Derivative2('Jerk', 0, 100, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuyJerk"), document.getElementById("btnBuyJerk"), this.dummyUpgrade, 0, 1, false))
      this.speedDerivatives.push( new Derivative2('Snap', 0, 1e4, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuySnap"), document.getElementById("btnBuySnap"), this.dummyUpgrade, 0, 1, false))
      this.speedDerivatives.push( new Derivative2('Crackle', 0, 1e7, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuyCrackle"), document.getElementById("btnBuyMiner"), this.dummyUpgrade, 0, 1, false))
      this.speedDerivatives.push( new Derivative2('Pop', 0, 1e11, 2, this.resources.rocks, new Resource('dummy'), document.getElementById("btnBuyPop"), document.getElementById("btnBuyMiner"), this.dummyUpgrade, 0, 1, false))

      this.timeDerivatives = [];
      this.timeDerivatives.push( new Derivative2('Time1', 0, 1, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime1"), document.getElementById("btnBuyTime1"), this.dummyUpgrade, 0, 1, false))
      this.timeDerivatives.push( new Derivative2('Time2', 0, 10, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime2"), document.getElementById("btnBuyTime2"), this.dummyUpgrade, 0, 1, false))
      this.timeDerivatives.push( new Derivative2('Time3', 0, 100, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime3"), document.getElementById("btnBuyTime3"), this.dummyUpgrade, 0, 1, false))
      this.timeDerivatives.push( new Derivative2('Time4', 0, 1e4, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime4"), document.getElementById("btnBuyTime4"), this.dummyUpgrade, 0, 1, false))
      this.timeDerivatives.push( new Derivative2('Time5', 0, 1e7, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime5"), document.getElementById("btnBuyTime5"), this.dummyUpgrade, 0, 1, false))
      this.timeDerivatives.push( new Derivative2('Time6', 0, 1e11, 2, this.resources.boulders, new Resource('dummy'), document.getElementById("btnBuyTime6"), document.getElementById("btnBuyTime6"), this.dummyUpgrade, 0, 1, false))

      this.challenges = [];
      this.challenges.push(new Challenge('Inflation', 'Inflation starts 5 percent later per completion', 5, 5));
      this.challenges.push(new Challenge('Shields', 'Unlock and improve Tower Defenses', 20, 10));
      this.challenges.push(new Challenge('Heal', 'Unlock and improve Tower Healing', 10, 5));
      this.challenges.push(new Challenge('Production Bonus', 'Add .01 to production bonus', 10, 5));
      this.challenges.push(new Challenge('Tower Range', 'Add 1 to Tower Range', 20, 10));
      this.challenges.push(new Challenge('Shooting Speed', 'Increase shooting speed', 10, 5));
      this.challenges.push(new Challenge('Critical Attacks', 'Unlock and improve critical hits', 30, 5));
  
      var attackequipment = new Equipment('Attack', 0, 100, 1.5, this.resources.metal, this.resources.dust, document.getElementById("btnBuyAttack"), document.getElementById("btnBuyAttackDustUpgrade"), 1, 2, this.upgrades[3], this.dummyChallenge, 20);
      var hullequipment = new Equipment('Hull', 1, 100, 1.4, this.resources.metal, this.resources.dust, document.getElementById("btnBuyHull"), document.getElementById("btnBuyHullDustUpgrade"), 1, 2, this.upgrades[4], this.dummyChallenge, 20);
      // var shieldequipment = new Equipment('Shield', 2, 10000, 1.8, this.resources.metal, this.resources.dust, document.getElementById("btnBuyShield"), document.getElementById("btnBuyShield"), 1, 2, this.dummyUpgrade, this.challenges[1], 20);
      // var healequipment = new Equipment('Heal', 3, 1000, 1.6, this.resources.metal, this.resources.dust, document.getElementById("btnBuyHeal"), document.getElementById("btnBuyHeal"), 1, 2, this.dummyUpgrade, this.challenges[2], 20);
      // var speedequipment = new Equipment('Firing Computer', 4, 1000, 1.7, this.resources.metal, this.resources.dust, document.getElementById("btnBuyShootingSpeed"), document.getElementById("btnBuyShootingSpeed"), 1, 2, this.dummyUpgrade, this.challenges[5], 20);
      // var rangeequipment = new Equipment('Range Computer', 5, 10000, 1.9, this.resources.metal, this.resources.dust, document.getElementById("btnBuyRange"), document.getElementById("btnBuyRange"), 1, 2, this.dummyUpgrade, this.challenges[4], 20);
      // var critequipment = new Equipment('Critical Computer', 5, 100000, 2.0, this.resources.metal, this.resources.dust, document.getElementById("btnBuyCrit"), document.getElementById("btnBuyCrit"), 1, 2, this.dummyUpgrade, this.challenges[6], 20);
  
      this.equipment = [];
      this.equipment.push(attackequipment);
      this.equipment.push(hullequipment);
      // this.equipment.push(shieldequipment);
      // this.equipment.push(healequipment);
      // this.equipment.push(rangeequipment);
      // this.equipment.push(speedequipment);
      // this.equipment.push(critequipment);
  
      this.achievements = [];
  
      this.achievements.push(
        new achievement(1, "Miner1", "Buy first Miner", 0, 1)
      );
      this.achievements.push(
        new achievement(2, "Miner10", "Buy tenth Miner", 0, 10)
      );
      this.achievements.push(
        new achievement(3, "Miner25", "Buy twenty fifth Miner", 0, 25)
      );
      this.achievements.push(
        new achievement(4, "Miner50", "Buy fiftieth Miner", 0, 50)
      );
      this.achievements.push(
        new achievement(5, "Miner100", "Buy hundredth Miner", 0, 100)
      );
  
      this.achievements.push(
        new achievement(6, "Supervisor1", "Buy first Supervisor", 1, 1)
      );
      this.achievements.push(
        new achievement(7, "Supervisor10", "Buy tenth Supervisor", 1, 10)
      );
      this.achievements.push(
        new achievement(8, "Supervisor25", "Buy twenty fifth Supervisor", 1, 25)
      );
      this.achievements.push(
        new achievement(9, "Supervisor50", "Buy fiftieth Supervisor", 1, 50)
      );
      this.achievements.push(
        new achievement(10, "Supervisor100", "Buy hundredth Supervisor", 1, 100)
      );
  
      this.achievements.push(
        new achievement(11, "Foreman1", "Buy first Foreman", 2, 1)
      );
      this.achievements.push(
        new achievement(12, "Foreman10", "Buy tenth Foreman", 2, 10)
      );
      this.achievements.push(
        new achievement(13, "Foreman25", "Buy twenty fifth Foreman", 2, 25)
      );
      this.achievements.push(
        new achievement(14, "Foreman50", "Buy fiftieth Foreman", 2, 50)
      );
      this.achievements.push(
        new achievement(15, "Foreman100", "Buy hundredth Foreman", 2, 100)
      );
  
      this.achievements.push(
        new achievement(16, "Manager1", "Buy first Manager", 3, 1)
      );
      this.achievements.push(
        new achievement(17, "Manager10", "Buy tenth Manager", 3, 10)
      );
      this.achievements.push(
        new achievement(18, "Manager25", "Buy twenty fifth Manager", 3, 25)
      );
      this.achievements.push(
        new achievement(19, "Manager50", "Buy fiftieth Manager", 3, 50)
      );
      this.achievements.push(
        new achievement(20, "Manager100", "Buy hundredth Manager", 3, 100)
      );
  
      this.achievements.push(
        new achievement(21, "Middle Management1", "Buy first Middle Management", 4, 1)
      );
      this.achievements.push(
        new achievement(22, "Middle Management10", "Buy tenth Middle Management", 4, 10)
      );
      this.achievements.push(
        new achievement(23, "Middle Management25", "Buy twenty fifth Middle Management", 4, 25)
      );
      this.achievements.push(
        new achievement(24, "Middle Management50", "Buy fiftieth Middle Management", 4, 50)
      );
      this.achievements.push(
        new achievement(25, "Middle Management100", "Buy hundredth Middle Management", 4, 100)
      );
  
      this.achievements.push(
        new achievement(26, "Upper Management1", "Buy first Upper Management", 5, 1)
      );
      this.achievements.push(
        new achievement(27, "Upper Management10", "Buy tenth Upper Management", 5, 10)
      );
      this.achievements.push(
        new achievement(28, "Upper Management25", "Buy twenty fifth Upper Management", 5, 25)
      );
      this.achievements.push(
        new achievement(29, "Upper Management50", "Buy fiftieth Upper Management", 5, 50)
      );
      this.achievements.push(
        new achievement(30, "Upper Management100", "Buy hundredth Upper Management", 5, 100)
      );
  
      this.achievements.push(
        new achievement(31, "Vice President1", "Buy first Vice President", 6, 1)
      );
      this.achievements.push(
        new achievement(32, "Vice President10", "Buy tenth Vice President", 6, 10)
      );
      this.achievements.push(
        new achievement(33, "Vice President25", "Buy twenty fifth Vice President", 6, 25)
      );
      this.achievements.push(
        new achievement(34, "Vice President50", "Buy fiftieth Vice President", 6, 50)
      );
      this.achievements.push(
        new achievement(35, "Vice President100", "Buy hundredth Vice President", 6, 100)
      );
  
      this.achievements.push(
        new achievement(36, "President1", "Buy first President", 7, 1)
      );
      this.achievements.push(
        new achievement(37, "President10", "Buy tenth President", 7, 10)
      );
      this.achievements.push(
        new achievement(38, "President25", "Buy twenty fifth President", 7, 25)
      );
      this.achievements.push(
        new achievement(39, "President50", "Buy fiftieth President", 7, 50)
      );
      this.achievements.push(
        new achievement(40, "President100", "Buy hundredth President", 7, 100)
      );
  
      
      this.achievements.push(
        new achievement(41, "Challenge1", "Complete first Challenge", 1, 1)
      );
      this.achievements.push(
        new achievement(42, "Challenge2", "Complete two Challenges", 1, 2)
      );
      this.achievements.push(
        new achievement(43, "Challenge4", "Complete four Challenges", 1, 4)
      );
      this.achievements.push(
        new achievement(44, "Challenge8", "Complete eight Challenges", 1, 8)
      );
      this.achievements.push(
        new achievement(45, "Challenge16", "Complete sixteen Challenges", 1, 16)
      );
  
      this.achievements.push(
        new achievement(46, "Wave1", "Complete Wave 1", 1, 1)
      );
      this.achievements.push(
        new achievement(47, "Wave10", "Complete Wave 10", 1, 10)
      );
      this.achievements.push(
        new achievement(48, "Wave20", "Complete Wave 20", 1, 20)
      );
      this.achievements.push(
        new achievement(49, "Wave30", "Complete Wave 30", 1, 30)
      );
      this.achievements.push(
        new achievement(50, "Wave40", "Complete Wave 40", 1, 40)
      );
  
      this.achievements.push(
        new achievement(51, "Challenge25", "Complete twenty five Challenges", 1, 25)
      );
      this.achievements.push(
        new achievement(52, "Challenge50", "Complete fifty Challenges", 1, 50)
      );
      this.achievements.push(
        new achievement(53, "Challenge100", "Complete one hundred Challenges", 1, 100)
      );
      this.achievements.push(
        new achievement(54, "Challenge200", "Complete two hundred Challenges", 1, 200)
      );
      this.achievements.push(
        new achievement(55, "Challenge500", "Complete five hundred Challenges", 1, 500)
      );
  
      this.achievements.push(
        new achievement(56, "Wave50", "Complete Wave 50", 1, 50)
      );
      this.achievements.push(
        new achievement(57, "Wave60", "Complete Wave 60", 1, 60)
      );
      this.achievements.push(
        new achievement(58, "Wave70", "Complete Wave 70", 1, 70)
      );
      this.achievements.push(
        new achievement(59, "Wave80", "Complete Wave 80", 1, 80)
      );
      this.achievements.push(
        new achievement(60, "Wave90", "Complete Wave 90", 1, 90)
      );
  
      this.achievements.push(
        new achievement(61, "Attack10", "Have attack of 10", 1, 10)
      );
      this.achievements.push(
        new achievement(62, "Attack50", "Have attack of 50", 1, 50)
      );
      this.achievements.push(
        new achievement(63, "Attack100", "Have attack of 100", 1, 100)
      );
      this.achievements.push(
        new achievement(64, "Attack500", "Have attack of 500", 1, 500)
      );
      this.achievements.push(
        new achievement(65, "Attack1000", "Have attack of 1000", 1, 1000)
      );
  
      this.achievements.push(
        new achievement(66, "Attack5000", "Have attack of 5000", 1, 5000)
      );
      this.achievements.push(
        new achievement(67, "Attack10000", "Have attack of 10000", 1, 10000)
      );
      this.achievements.push(
        new achievement(68, "Attack50000", "Have attack of 50000", 1, 50000)
      );
      this.achievements.push(
        new achievement(69, "Attack100000", "Have attack of 100000", 1, 100000)
      );
      this.achievements.push(
        new achievement(70, "Attack500000", "Have attack of 500000", 1, 500000)
      );
  
      this.achievements.push(
        new achievement(71, "1Prestige10", "Pebble Prestige 1 times", 1, 1)
      );
      this.achievements.push(
        new achievement(72, "1Prestige50", "Pebble Prestige 10 times", 1, 10)
      );
      this.achievements.push(
        new achievement(73, "1Prestige100", "Pebble Prestige 50 times", 1, 50)
      );
      this.achievements.push(
        new achievement(74, "1Prestige500", "Pebble Prestige 100 times", 1, 100)
      );
      this.achievements.push(
        new achievement(75, "1Prestige1000", "Pebble Prestige 500 times", 1, 500)
      );

      this.achievements.push(
        new achievement(76, "2Prestige10", "Rock Prestige 1 times", 1, 1)
      );
      this.achievements.push(
        new achievement(77, "2Prestige50", "Rock Prestige 10 times", 1, 10)
      );
      this.achievements.push(
        new achievement(78, "2Prestige100", "Rock Prestige 50 times", 1, 50)
      );
      this.achievements.push(
        new achievement(79, "2Prestige500", "Rock Prestige 100 times", 1, 100)
      );
      this.achievements.push(
        new achievement(80, "2Prestige1000", "Rock Prestige 500 times", 1, 500)
      );

      this.achievements.push(
        new achievement(81, "PebblesPer10", "Pebble Gain 10 per hour", 1, 10)
      );
      this.achievements.push(
        new achievement(82, "PebblesPer100", "Pebble Gain 100 per hour", 1, 100)
      );
      this.achievements.push(
        new achievement(83, "PebblesPer1000", "Pebble Gain 1000 per hour", 1, 1000)
      );
      this.achievements.push(
        new achievement(84, "PebblesPer10000", "Pebble Gain 1e4 per hour", 1, 1e4)
      );
      this.achievements.push(
        new achievement(85, "PebblesPer100000", "Pebble Gain 1e5 per hour", 1, 1e5)
      );

      this.achievements.push(
        new achievement(86, "3Prestige10", "Boulder Prestige 1 times", 1, 1)
      );
      this.achievements.push(
        new achievement(87, "3Prestige50", "Boulder Prestige 10 times", 1, 10)
      );
      this.achievements.push(
        new achievement(88, "3Prestige100", "Boulder Prestige 50 times", 1, 50)
      );
      this.achievements.push(
        new achievement(89, "3Prestige500", "Boulder Prestige 100 times", 1, 100)
      );
      this.achievements.push(
        new achievement(90, "3Prestige1000", "Boulder Prestige 500 times", 1, 500)
      );

      this.tier1Feats = [];
      this.tier1Feats.push(
        new achievement(1, 'CompleteTier1', 'Complete Tier 1', 1, 1)
      );
      this.tier1Feats.push(
        new achievement(2, 'TierNoPresidents1', 'Complete Tier 1 with no Presidents', 1, 1)
      );
      this.tier1Feats.push(
        new achievement(3, 'TierChallenge1', 'Complete Tier 1 with a challenge active', 1, 1)
      );

      this.tier2Feats = [];
      this.tier2Feats.push(
        new achievement(1, 'CompleteTier1', 'Complete Tier 1', 1, 2)
      );
      this.tier2Feats.push(
        new achievement(2, 'TierNoPresidents1', 'Complete Tier 1 with no Presidents', 1, 2)
      );
      this.tier2Feats.push(
        new achievement(3, 'TierChallenge1', 'Complete Tier 1 with a challenge active', 1, 2)
      );

    }
  }  
  
  function saveGame(currentTime: Date) {
    localStorage.setItem("save", JSON.stringify(gameData));
    addToDisplay("Game Saved", "gameSave");
    gameData.world.nextSaveGameTime.setMilliseconds(currentTime.getMilliseconds() + 1000*60*5);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById("result").innerHTML = xhr.responseText;
      }
    };
    xhr.open("GET", "version.txt");
    xhr.send();
  }
  