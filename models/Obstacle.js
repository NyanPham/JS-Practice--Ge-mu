import PhysicalObject from "./PhysicalObject.js";

class Obstacle extends PhysicalObject {
  constructor(game, x = null, y = null, radius = 60) {
    super(game, x, y, radius);
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
    context.fill();
    context.restore();
    context.stroke();
  }

  update() {}
}

export default Obstacle;
