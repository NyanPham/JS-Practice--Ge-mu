import PhysicalObject from "./PhysicalObject.js";

class Player extends PhysicalObject {
  constructor(game) {
    super(game, game.width * 0.5, game.height * 0.5, 30);
    this.speedModifier = 5;
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

  update() {
    const { x, y } = this.game.mouse.getPosition();

    const { distance } = this.getDistance({ collisionX: x, collisionY: y });

    if (distance > this.speedModifier) {
      this.speedX = this.dx / distance;
      this.speedY = this.dy / distance;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
  }
}

export default Player;
