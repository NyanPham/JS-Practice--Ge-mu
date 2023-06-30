export const hasHealth = {
  getHealth() {
    return this.stats.health;
  },
};

export const attacker = {
  attackGlobalTimer(target) {
    if (target.stats == null) return;

    if (this.attackTimer > this.attackInterval) {
      target.takeDamage(this.damage);
      this.attackTimer = 0;
    }
  },

  attack(target, deltaTime) {
    if (target.stats == null) return;
    if (this.attackTimer > this.attackInterval) {
      target.takeDamage(this.damage);
      this.attackTimer = 0;
    }

    this.attackTimer += deltaTime;
  },
};

export const attackTarget = {
  takeDamage(damage) {
    this.stats.substractStat("health", damage);
  },
};
