import ResourceObstacle from "./ResourceObstacle.js";

class Rock extends ResourceObstacle {
  constructor(game) {
    super(game);
    this.name = "boulder";
    this.resourceName = "rock";
    this.requiredEquipments = ["pickaxe"];

    this.exploitRateMap = {
      pickaxe: 1,
    };

    this.collisionRadius = Math.floor(Math.random() * 35) + 55;

    this.image = document.getElementById("rock-image");
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.width = this.collisionRadius * 2;
    this.height = this.collisionRadius * 2;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 10;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = 0;
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
      context.fillStyle = "gray";
      context.fill();
      context.restore();
      context.stroke();
    }
  }
}

export default Rock;
