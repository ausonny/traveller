class movingObject {
    pos: vector;
  
    target: vector
  
    movementPerSec: number
  
    isBullet: boolean
  
    constructor(pos: vector, target: vector, movementPerSec: number, isbullet: boolean = false) {
        this.pos = Object.assign(pos)
        this.updateTarget(target);
        this.movementPerSec = movementPerSec;
        this.isBullet = isbullet
      }
  
      updateTarget(target: vector) {
        this.target = Object.assign(target);
      }
  
      getDistanceToTarget() {
        var length = this.pos.getLength(this.target.x, this.target.y);
        return length;
      }
      
      timeToTarget() {
          return this.getDistanceToTarget() / this.movementPerSec
      }
  
      move() {
        var tickmovement = this.movementPerSec * gameData.world.currentTickLength / 1000;
        var length = this.getDistanceToTarget();
  
        if (this.isBullet) {
            if ((length < tickmovement)) {
                this.pos.x = this.target.x;
                this.pos.y = this.target.y;
            } else {
                var xdif = this.pos.x - this.target.x;
                var ydif = this.pos.y - this.target.y;
                var movex = (xdif / length) * tickmovement;
                var movey = (ydif / length) * tickmovement;
                this.pos.x -= movex;
                this.pos.y -= movey;
            }
        } else {
            if (length < 1) {
                this.pos.x = this.pos.getNormalizedX(this.target.x, this.target.y) * 0.99
                this.pos.y = this.pos.getNormalizedY(this.target.x, this.target.y) * 0.99
                // sit still
            } else {
                var xdif = this.pos.x - this.target.x;
                var ydif = this.pos.y - this.target.y;
                var movex = (xdif / length) * tickmovement;
                var movey = (ydif / length) * tickmovement;
                this.pos.x -= movex;
                this.pos.y -= movey;
            }
        }
      }
  }
  
  class fightingObject extends movingObject {
    baseMaxHitPoints: JBDecimal;
  
    damagetaken: JBDecimal;
  
    baseAttack: JBDecimal;
  
    baseDefense: JBDecimal;
  
    baseRange: number;
  
    baseHeal: JBDecimal;
  
    baseTickPerBullet: number;
  
    ticksToNextBullet: number;
  
    player: boolean
  
    enemycount: number;
  
    bullets: bullet[];
  
    type: string;
  
    wave: number;
  
  
    constructor(wave: number, enemycount: number, player: boolean = false) {
        var pos = new vector(0,0)
        var target = new vector(0,0)
        super(pos, target, 0, false)
        this.bullets = []; 
        this.ticksToNextBullet = 0;
  
        if(player) {
            this.createTower();
        } else {
            this.createEnemy(wave, enemycount);
        }
    }
  
    createTower() {
        this.baseMaxHitPoints = new JBDecimal(50);
        this.baseAttack = new JBDecimal(1);
        this.baseDefense = new JBDecimal(0);
        this.baseRange = 3;
        this.baseHeal = new JBDecimal(0);
        this.baseTickPerBullet  = 1000;
        this.damagetaken = new JBDecimal(0);
        this.player = true;
        this.pos.x = 0;
        this.pos.y = 0;
        this.target.x = 0;
        this.target.y = 0;
    }
  
    createEnemy(wave: number, enemycount: number) {
        var posx = (Math.random() * 10);
        var posy = 100 - Math.pow(posx,2);
        posy = Math.sqrt(posy);
        var tieradjustment = gameData.world.currentTier - 1;

        this.baseAttack = new JBDecimal(1.15 + (tieradjustment / 100)).pow(wave-1);
        this.baseAttack.exponent += tieradjustment
        this.movementPerSec = 1;
        this.baseMaxHitPoints = new JBDecimal(1.20 + (tieradjustment / 100)).pow(wave-1);
        this.baseMaxHitPoints.exponent += tieradjustment
        this.damagetaken = new JBDecimal(0);
        this.baseDefense = new JBDecimal(0);
        this.baseRange = 1;
        this.baseHeal = new JBDecimal(0);
        this.baseTickPerBullet = 1000;
        this.wave = wave;
        this.enemycount = enemycount;
        this.pos = new vector(posx, posy);
        if (enemycount % 4 === 0) {
            this.pos.y *= -1;
        } else if (enemycount % 4 === 1) {
            this.pos.x *= -1;
        } else if (enemycount % 4 === 2) {
            this.pos.x *= -1;
            this.pos.y *= -1;
        }
        this.type = '';
  
    }
  
    MaxHitPoints() {
        var ret = new JBDecimal(this.baseMaxHitPoints);
        if (this.player) {
            var equipmentbonus = new JBDecimal(gameData.equipment[1].production().multiply(this.baseMaxHitPoints));
            ret = ret.add(equipmentbonus);
        }
        return ret;
    }
  
    CurrentHitPoints() {
        var ret = new JBDecimal(this.MaxHitPoints());
        ret = ret.subtract(this.damagetaken);
        return ret;
    }
  
    Attack() {
        var ret = new JBDecimal(this.baseAttack);
        if (this.player) {
            var equipmentbonus = new JBDecimal(gameData.equipment[0].production());
            ret = ret.add(equipmentbonus);
        }
        return ret;
    }
  
    Defense() {
        if(gameData.challenges[1].active || gameData.challenges[1].completed < 1) {
            return 0;
        }
        var ret = 0;
        if(this.player) {
            ret = 10 * gameData.challenges[1].completed * (gameData.rockUpgrades[10].bought + 1)
            ret *= Math.pow(0.99 - ((gameData.world.currentTier - 1)/ 100), gameData.world.currentWave)
        }

        if(ret < 0) {
            ret = 0;
        } else if(ret > 100) {
            ret = 100;
        }
        return ret;
    }
  
    Range() {
        if(!this.player) {
            return this.baseRange;    
        }
  
        if (gameData.challenges[4].active || gameData.challenges[4].completed < 1) {
            return 3;
        }

        var ret = 3;
        if(this.player) {
            ret = gameData.challenges[4].completed
            ret *= Math.pow(0.99 - ((gameData.world.currentTier - 1) / 100), gameData.world.currentWave)
            ret += 3;
        }

        if(ret < 3) {
            ret = 3;
        } else if(ret > 10) {
            ret = 10;
        }
        return ret;
       
    }
  
    Heal() {
        if(gameData.challenges[2].active || gameData.challenges[2].completed < 1) {
            return 0;
        }

        var ret = 0;
        if(this.player) {
            ret = gameData.challenges[2].completed * (gameData.rockUpgrades[8].bought + 1)
            ret *= Math.pow(0.99 - ((gameData.world.currentTier - 1) / 100), gameData.world.currentWave)
        }

        if(ret < 0) {
            ret = 0;
        } else if(ret > 100) {
            ret = 100;
        }
        return ret;
    }
  
    TicksPerBullet() {
        if (!this.player) {
            return this.baseTickPerBullet;
        }
        if(gameData.challenges[5].active || gameData.challenges[5].completed < 1) {
            return 1000;
        }

        var ret = 1000;
        if(this.player) {
            ret = 100 +(100 * gameData.challenges[5].completed)
            ret *= Math.pow(0.99 - ((gameData.world.currentTier - 1) / 100), gameData.world.currentWave)
        }

        ret = 1000 - ret;
        if(ret < 100) {
            ret = 100;
        } else if(ret > 1000) {
            ret = 1000;
        }
        return ret;
    }
  
    recieveHit(attack: JBDecimal){
        var defensevalue = (100 - (this.Defense()))
        var attackValue = attack.multiply(defensevalue).divide(100);
        if(attackValue.greaterThan(0)) {
            this.damagetaken = this.damagetaken.add(attackValue);
        }
    }
  
    beTargeted(attacker: fightingObject) {
        var newBullet = new bullet(attacker.pos.x,attacker.pos.y, this.pos.x, this.pos.y, attacker.Attack())
        this.bullets.push(newBullet);
    }
  
    checkForHit() {
        for (let index = this.bullets.length - 1; index >= 0; index--) {
            const b = this.bullets[index];
            b.updateTarget(new vector(this.pos.x, this.pos.y))
            b.move();
            if(b.getDistanceToTarget() <= 0) {
                this.recieveHit(b.damage);
                this.bullets.splice(index, 1);
            }
        }
    }

    expectedHitPointsRemaining(damage: JBDecimal) {
        if (this.bullets.length === 0) {
            return this.CurrentHitPoints().divide(damage).ToNumber();
        }
        var leftoverHitpoints = this.CurrentHitPoints()
        for (let index = 0; index < this.bullets.length; index++) {
            const element = this.bullets[index];
            leftoverHitpoints = leftoverHitpoints.subtract(element.damage);
        }
        return leftoverHitpoints.divide(damage).ToNumber();
    }
  }
  
  class Tower extends fightingObject {
    constructor() {
        super(0, 0, true)
    }
  
    act() {
        this.checkForHit();
        if(this.CurrentHitPoints().lessThanOrEqualTo(0)) {
            return;
        }
  
        this.damagetaken = this.damagetaken.subtract(this.MaxHitPoints().multiply((this.Heal()/100) * gameData.world.currentTickLength /1000 ));
        if(this.damagetaken.lessThan(0)) {
            this.damagetaken = new JBDecimal(0);
        }
        this.ticksToNextBullet -= gameData.world.currentTickLength
        var enemiesInRange = [];
        if(this.ticksToNextBullet <= 0) {
            if (gameData.enemies.length > 0) {
                for (let index = 0; index < gameData.enemies.length; index++) {
                    const element = gameData.enemies[index];
                    const len = element.pos.getLength(0,0);
                    if(len <= this.Range() && element.expectedHitPointsRemaining(this.Attack()) > 0) {
                        enemiesInRange.push(element);
                    }
                } 
                    
            }
            if(enemiesInRange.length > 0) {

                enemiesInRange.sort((a,b)=> (a.timeToTarget() - b.timeToTarget() || a.expectedHitPointsRemaining(this.Attack()) - b.expectedHitPointsRemaining(this.Attack())));

                //enemiesInRange.sort((a, b) => (a.expectedHitPointsRemaining(this.Attack()) > b.expectedHitPointsRemaining(this.Attack())) ? 1 : -1)
                //enemiesInRange.sort((a, b) => (a.timeToTarget() > b.timeToTarget()) ? 1 : -1)
                enemiesInRange[0].beTargeted(this);
                this.ticksToNextBullet += this.TicksPerBullet();
            } else {
                this.ticksToNextBullet = 0;
            }
        }
    }
  }
  
  class vector {
    x: number;
  
    y: number;
  
    constructor(currentx: number, currenty: number) {
        this.x = currentx;
        this.y = currenty;
    }
  
    getLength(targetx: number, targety:number) {
        var xdif = this.x - targetx;
        var ydif = this.y - targety;
        var length = Math.sqrt(xdif*xdif + ydif*ydif); //calculating length of vector
        return length;
    }
  
    getNormalizedX(targetx: number, targety:number) {
        return this.x / this.getLength(targetx, targety)
    }
    getNormalizedY(targetx: number, targety:number) {
        return this.y / this.getLength(targetx, targety)
    }
  
  }
  
  class bullet extends movingObject {
      damage: JBDecimal
  
      constructor(posx: number, posy: number, targetx: number, targety: number, damage: JBDecimal) {
        super(new vector(posx, posy), new vector(targetx, targety), 10, true)
        this.damage = new JBDecimal(0)
        this.damage.mantissa = damage.mantissa
        this.damage.exponent = damage.exponent
      }
  }
  
  class Enemy extends fightingObject {
    constructor(wave: number, enemycount: number) {
        super(wave, enemycount);
     }
  
     act() {
        this.checkForHit();
        if(this.CurrentHitPoints().lessThanOrEqualTo(0)) {
            return;
        }
        this.damagetaken = this.damagetaken.subtract(this.Heal());
        if(this.damagetaken.lessThan(0)) {
            this.damagetaken = new JBDecimal(0);
        }
        this.ticksToNextBullet -= gameData.world.currentTickLength
        if(this.ticksToNextBullet <= 0) {
            if(this.Range() >= this.pos.getLength(0,0)) {
                gameData.tower.beTargeted(this)
                this.ticksToNextBullet += this.TicksPerBullet();
            } else {
                this.ticksToNextBullet = 0;
            }
        }
  
        this.move();
     }
  }