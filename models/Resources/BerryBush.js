import ResourceObstacle from "./ResourceObstacle.js";

class BerryBush extends ResourceObstacle {
  constructor(game) {
    super(game);
    this.name = "berry";
    this.resourceName = "berry";
    this.requiredEquipments = ["barehand"];
    this.collisionRadius = 50;
    this.resevoir = Math.floor(Math.random() * (5 - 3)) + 3;
    this.maxContainer = this.resevoir;

    this.consumable = true;
    this.type = "consumable";

    this.exploitRateMap = {
      barehand: 1,
    };
    this.refillTime = (7 * 60 * 1000) / 2;

    this.image = document.getElementById("bush-image");
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.width = this.spriteWidth * 3;
    this.height = this.spriteHeight * 3;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 35;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = 0;

    this.berryPositions = [];

    this.generateBerryPositions();
  }

  draw(context) {
    if (this.resevoir == 0) {
    }
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

    for (let i = 0; i < this.resevoir; i++) {
      context.beginPath();
      context.save();
      context.fillStyle = "red";
      context.strokeStyle = "coral";
      context.arc(
        this.berryPositions[i].x,
        this.berryPositions[i].y,
        15,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
    }

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
      context.fillStyle = "red";
      context.fill();
      context.restore();
      context.stroke();
    }
  }

  generateBerryPositions() {
    for (let i = 0; i < this.maxContainer; i++) {
      this.berryPositions.push({
        x:
          Math.random() *
            (this.collisionX -
              7 +
              this.collisionRadius -
              (this.collisionX + 7 - this.collisionRadius)) +
          (this.collisionX + 7 - this.collisionRadius),
        y:
          Math.random() *
            (this.collisionY -
              35 +
              this.collisionRadius -
              (this.collisionY - this.collisionRadius)) +
          (this.collisionY - this.collisionRadius),
      });
    }
  }
}

export default BerryBush;
