import Enemy from "./Enemy.js";

class Slime extends Enemy {
  constructor(game, x, y, radius) {
    super(game, x, y, radius);

    this.normalImage = document.getElementById("slime-image");
    this.flipped = document.getElementById("slime-flipped-image");

    this.image = this.normalImage;
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.width = this.spriteWidth * 3.8;
    this.height = this.spriteHeight * 3.8;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 15;
    this.frameX = 0;
    this.frameY = 0;
    this.frameYSwap = false;

    this.frameTimer = 0;
    this.frameInterval = 60;
    this.frameFastInterval = 15;

    this.isMoving = false;
  }

  draw(context) {
    context.save();
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    context.restore();

    this.drawHealthBar(context);

    if (this.game.debug) {
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
    }
  }

  updateFrameLoop(deltaTime) {
    const angle = (Math.atan2(this.targetDy, this.targetDx) * 180) / Math.PI;

    const frameInterval =
      this.speedModifier === this.runSpeed
        ? this.frameFastInterval
        : this.frameInterval;

    if (this.frameTimer > frameInterval) {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 15;
      this.image = this.normalImage;

      if (angle < 90 && angle > 90) {
        this.image = this.flipped;
      }

      if (this.isMoving) {
        this.frameY = 1;
      } else {
        this.frameY = 0;
      }

      this.frameX++;
      if ((this.frameX > 3 && !this.isMoving) || this.frameX > 5) {
        this.frameX = 0;
      }

      this.frameTimer = 0;
    }

    this.frameTimer += deltaTime;
  }
}

export default Slime;
