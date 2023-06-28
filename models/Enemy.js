import PhysicalObject from "./PhysicalObject.js";

class Enemy extends PhysicalObject {
  constructor(game, x, y, radius) {
    super(game, x, y, radius);

    this.attackRange = 300;
    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = 2.5;

    this.firstPositionX = this.collisionX;
    this.firstPositionY = this.collisionY;

    this.lastPositionX = this.collisionX;
    this.lastPositionY = this.collisionY;

    this.distanceTolerance = 15;
    this.waitForSuspicion = 3000;
    this.lastSeenPlayer = 0;
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
      this.collisionRadius + this.attackRange,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

  update(deltaTime) {
    if (this.moveToPlayer()) return;
    if (this.suspicion(deltaTime)) return;
    this.guard();
  }

  moveTo(distance, dx, dy) {
    this.speedX = dx / distance;
    this.speedY = dy / distance;

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
  }

  moveToPlayer() {
    const { dx, dy, distance } = PhysicalObject.getDistance(
      this,
      this.game.player
    );

    if (
      distance <
      this.collisionRadius + this.attackRange + this.game.player.collisionRadius
    ) {
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

  attack() {}
}

export default Enemy;
