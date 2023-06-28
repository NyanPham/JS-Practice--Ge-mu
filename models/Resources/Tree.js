import ResourceObstacle from "./ResourceObstacle.js";

class Tree extends ResourceObstacle {
  constructor(game) {
    super(game);
    this.name = "tree";
    this.resourceName = "wood";
    this.requiredEquipments = ["barehand", "axe"];

    this.collisionRadius = Math.floor(Math.random() * 100) + 35;

    this.exploitRateMap = {
      barehand: 1,
      axe: 3,
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
    context.fillStyle = "green";
    context.fill();
    context.restore();
    context.stroke();
  }
}

export default Tree;
