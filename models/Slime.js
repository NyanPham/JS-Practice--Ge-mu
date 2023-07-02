import { deadAnimator } from "./Common.js";
import Enemy from "./Enemy.js";

class Slime extends Enemy {
  constructor(game, x, y, radius) {
    super(game, x, y, radius);

    this.name = "slime";
    this.normalImage = document.getElementById("slime-image");
    this.flippedImage = document.getElementById("slime-flipped-image");

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
    this.lastDeadFrameIndex = 4;
  }

  draw(context) {
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
    const radian = Math.atan2(this.targetDy, this.targetDx);

    const frameInterval =
      this.speedModifier === this.runSpeed
        ? this.frameFastInterval
        : this.frameInterval;

    if (this.frameTimer > frameInterval) {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 15;

      if (
        (radian < -1.57 && radian - 3.14) ||
        (radian > 1.57 && radian < 3.14)
      ) {
        this.image = this.flippedImage;

        this.frameX--;
        if ((this.frameX < 3 && !this.isMoving) || this.frameX < 1) {
          this.frameX = 6;
        }
      } else {
        this.image = this.normalImage;

        this.frameX++;
        if ((this.frameX > 3 && !this.isMoving) || this.frameX > 5) {
          this.frameX = 0;
        }
      }

      if (this.isMoving) {
        this.frameY = 1;
      } else {
        this.frameY = 0;
      }

      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  
  loadData(data) {
    this.collisionX = data.collisionX;
    this.collisionY = data.collisionY;
    this.collisionRadius = data.collisionRadius;
    this.spriteX = data.spriteX;
    this.spriteY = data.spriteY;
    this.frameX = data.frameX;
    this.frameY = data.frameY;
    this.frameYSwap = data.frameYSwap;
    this.isMoving = data.isMoving;

    this.firstPositionX = data.firstPositionX;
    this.firstPositionY = data.firstPositionY;
    this.lastPositionX = data.lastPositionX;
    this.lastPositionY = data.lastPositionY;
    this.targetDx = data.targetDx;
    this.targetDy = data.targetDy;
    this.isDead = data.isDead;
    this.deadTime = data.deadTime;
    this.deadAnimationEnded = data.deadAnimationEnded;
    this.deadAnimationStarted = data.deadAnimationStarted;

    this.stats.loadData(data.stats);
  }
}

export default Slime;
