import PhysicalObject from "./PhysicalObject.js";
import Stats from "./Stats.js";

class Enemy extends PhysicalObject {
  constructor(game, x, y, radius) {
    super(game, x, y, radius);

    this.rageRange = 300;
    this.attackRange = 30;
    this.damage = 15;
    this.attackInterval = 1000;
    this.attackTimer = 0;

    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = 2.5;

    this.runSpeed = 12;
    this.walkSpeed = 3;

    this.firstPositionX = this.collisionX;
    this.firstPositionY = this.collisionY;

    this.lastPositionX = this.collisionX;
    this.lastPositionY = this.collisionY;

    this.distanceTolerance = 15;
    this.waitForSuspicion = 3000;
    this.lastSeenPlayer = 0;

    this.pathWidthMin = 150;
    this.pathWidthMax = 500;

    this.stats = new Stats(this);
    this.isDead = false;
  }

  draw(context) {
    context.beginPath();
    context.arc(
      this.collisionX,
      this.collisionY,
      this.collisionRadius,
      0,
      Math.PI * 2
    );

    context.save();
    context.globalAlpha = 0.5;
    context.fillStyle = "orange";
    context.fill();
    context.restore();
    context.stroke();

    context.beginPath();
    context.arc(
      this.collisionX,
      this.collisionY,
      this.collisionRadius + this.rageRange,
      0,
      Math.PI * 2
    );
    context.stroke();
    this.drawHealthBar(context);
  }

  drawHealthBar(context) {
    const healthRatio = this.stats.health / this.stats.maxHealth;

    context.beginPath();
    context.rect(
      this.collisionX - this.collisionRadius,
      this.collisionY - this.collisionRadius - 12,
      this.collisionRadius * 2,
      5
    );
    context.save();
    context.fillStyle = "gray";
    context.fill();
    context.restore();

    context.beginPath();
    context.rect(
      this.collisionX - this.collisionRadius,
      this.collisionY - this.collisionRadius - 12,
      healthRatio * this.collisionRadius * 2,
      5
    );
    context.save();
    context.fillStyle = "green";
    context.fill();
    context.restore();
  }

  update(deltaTime) {
    if (this.getHealth() === 0) {
      this.isDead = true;
    }

    if (this.isDead) return;

    this.checkCollisionsToObjects();

    if (this.moveToPlayer(deltaTime)) return;
    if (this.suspicion(deltaTime)) return;
    this.guard();
  }

  moveTo(distance, dx, dy) {
    this.speedX = dx / distance;
    this.speedY = dy / distance;

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
  }

  moveToPlayer(deltaTime) {
    const { dx, dy, distance } = PhysicalObject.getDistance(
      this,
      this.game.player
    );

    if (
      distance <=
      this.attackRange + this.collisionRadius + this.game.player.collisionRadius
    ) {
      this.attack(this.game.player, deltaTime);
      return true;
    }
    if (
      distance <
      this.collisionRadius + this.rageRange + this.game.player.collisionRadius
    ) {
      this.speedModifier = this.runSpeed;

      this.moveTo(distance, dx, dy);
      this.lastPositionX = this.game.player.collisionX;
      this.lastPositionY = this.game.player.collisionY;
      this.lastSeenPlayer = 0;

      return true;
    }

    return false;
  }

  guard() {
    this.lastPositionX = this.firstPositionX;
    this.lastPositionY = this.firstPositionY;

    const { distance, dx, dy } = PhysicalObject.getDistance(this, {
      collisionX: this.firstPositionX,
      collisionY: this.firstPositionY,
    });

    if (distance > this.distanceTolerance) {
      this.moveTo(distance, dx, dy);
      return true;
    }

    return false;
  }

  suspicion(deltaTime) {
    this.speedModifier = this.walkSpeed;

    const { distance, dx, dy } = PhysicalObject.getDistance(this, {
      collisionX: this.lastPositionX,
      collisionY: this.lastPositionY,
    });

    if (distance > 70) {
      this.moveTo(distance, dx, dy);
      return true;
    }

    if (this.lastSeenPlayer < this.waitForSuspicion) {
      this.lastSeenPlayer += deltaTime;
      return true;
    }

    this.lastSeenPlayer = 0;
    return false;
  }

  checkCollisionsToObjects() {
    [...this.game.obstacles, ...this.game.enemies].forEach((obstacle) => {
      if (obstacle !== this) {
        const { collided, distance, sumOfRadii, dx, dy } =
          PhysicalObject.checkCollision(this, obstacle, 0);
        if (collided) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;

          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
          if (this.game.mouse.isWithin(obstacle)) {
            this.game.mouse.setPosition(this.collisionX, this.collisionY);
          }
        }
      }
    });
  }

  attack(target, deltaTime) {
    if (target.stats == null) return;
    if (this.attackTimer > this.attackInterval) {
      target.takeDamage(this.damage);
      this.attackTimer = 0;
    }

    this.attackTimer += deltaTime;
  }

  getHealth() {
    return this.stats.health;
  }

  takeDamage(damage) {
    this.stats.substractStat("health", damage);
  }
}

export default Enemy;
