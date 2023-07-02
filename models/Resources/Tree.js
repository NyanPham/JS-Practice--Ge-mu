import ResourceObstacle from "./ResourceObstacle.js";

class Tree extends ResourceObstacle {
  constructor(game, seeded = false) {
    super(game);
    this.name = "tree";
    this.resourceName = "wood";
    this.requiredEquipments = ["barehand", "axe"];

    this.collisionRadius = 50;

    this.exploitRateMap = {
      barehand: 1,
      axe: 3,
    };

    this.image = document.getElementById("tree-image");
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.width = this.spriteWidth * 7;
    this.height = this.spriteHeight * 7;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 150;
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
      context.fillStyle = "green";
      context.fill();
      context.restore();
      context.stroke();
    }
  }
}

export default Tree;
