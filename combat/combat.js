export const hasHealth = {
  getHealth() {
    return this.stats.health;
  },
};

export const attacker = {
  startAttackAction(target) {
    this.isAttacking = true;
    this.attackTarget = target;
  },

  cancelAttackAction() {
    this.isAttacking = false;
    this.attackTarget = null;
    this.frameX = 0;
    this.frameY = 0;
    this.attackAnimationStarted = false;
  },

  hit(target) {
    target.takeDamage(this.damage);
  },

  attack(target, deltaTime) {
    if (!this.isAttacking) return false;
    if (target.stats == null) return false;

    if (!this.attackAnimationStarted) {
      this.attackAnimationStarted = true;
      this.frameY = this.attackFrameRow;
      this.frameX = this.horizontalSwap ? this.attackFrameFirstIndexFlipped : 0;
    }

    if (this.attackTimer > this.attackInterval) {
      if (this.horizontalSwap) {
        this.frameX--;
        if (this.frameX === this.attackFrameFirstIndexFlipped - 1) {
          this.hit(target);
        }
        if (this.frameX < this.attackFrameLastIndexFlipped) {
          this.attackAnimationStarted = false;
          if (target.isDead) {
            this.cancelAttackAction();
            return;
          }
        }
      } else {
        this.frameX++;
        if (this.frameX === 1) {
          this.hit(target);
        }
        if (this.frameX > this.attackFrameLastIndex) {
          this.attackAnimationStarted = false;
          if (target.isDead) {
            this.cancelAttackAction();
            return;
          }
        }
      }
      this.attackTimer = 0;
    } else {
      this.attackTimer += deltaTime;
    }

    return true;
  },
};

export const attackTarget = {
  takeDamage(damage) {
    this.stats.substractStat("health", damage);
  },
};
