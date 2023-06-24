import PhysicalObject from "./PhysicalObject.js";

class Obstacle extends PhysicalObject {
  constructor(game) {
    super(game, null, null, 60);
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
