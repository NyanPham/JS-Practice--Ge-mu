import Resource from "./Resource.js";

class GrassTurf extends Resource {
  constructor(game) {
    super(game, null, null, 25, "resource", 1, "grass", ["barehand"]);
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
    context.fillStyle = "black";
    context.fill();
    context.restore();
    context.stroke();
  }
}

export default GrassTurf;
