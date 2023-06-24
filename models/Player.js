import PhysicalObject from "./PhysicalObject.js";

class Player extends PhysicalObject {
  constructor(game) {
    super(game, game.width * 0.5, game.height * 0.5, 30);
    this.speedModifier = 15;
  }

  draw(context) {
    const { x, y } = this.game.mouse.getPosition();

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
    context.fill();
    context.restore();
    context.stroke();
    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(x, y);
    context.stroke();
  }

  update(deltaTime) {
    const { x, y } = this.game.mouse.getPosition();

    const { distance, dx, dy } = PhysicalObject.getDistance(this, {
      collisionX: x,
      collisionY: y,
    });

    if (distance > this.speedModifier) {
      this.speedX = dx / distance;
      this.speedY = dy / distance;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    this.game.obstacles.forEach((obstacle) => {
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
    });
  }
}

export default Player;
