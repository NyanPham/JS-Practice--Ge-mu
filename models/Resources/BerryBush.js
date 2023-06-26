import ResourceObstacle from "./ResourceObstacle.js";

class BerryBush extends ResourceObstacle {
  constructor(game) {
    super(game);
    this.name = "berry";
    this.resourceName = "berry";
    this.requiredEquipments = ["barehand"];
    this.collisionRadius = 30;
    this.resevoir = Math.floor(Math.random() * (5 - 3)) + 3;
    this.maxContainer = this.resevoir;

    this.consumable = true;
    this.type = "consumable";

    this.exploitRateMap = {
      barehand: 1,
    };
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
    context.fillStyle = "red";
    context.fill();
    context.restore();
    context.stroke();
  }
}

export default BerryBush;
