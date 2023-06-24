import ResourceObstacle from "./ResourceObstacle.js";

class Rock extends ResourceObstacle {
  constructor(game) {
    super(game);
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
    context.fillStyle = "gray";
    context.fill();
    context.restore();
    context.stroke();
  }
}

export default Rock;
