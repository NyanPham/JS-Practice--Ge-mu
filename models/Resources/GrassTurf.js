import Resource from "./Resource.js";

class GrassTurf extends Resource {
  constructor(game) {
    super(game, null, null, 20, "resource", 1, "fiber", ["barehand"]);

    this.refillTime = 5 * 60 * 1000;

    this.image = document.getElementById("flowers-image");
    this.spriteWidth = 50;
    this.spriteHeight = 50;
    this.width = this.spriteWidth * 1.2;
    this.height = this.spriteHeight * 1.2;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 20;
    this.frameX = Math.floor(Math.random() * 2);
    this.frameY = 0;
  }

  draw(context) {
    if (this.resevoir > 0) {
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
      context.fillStyle = "black";
      context.fill();
      context.restore();
      context.stroke();
    }
  }
}

export default GrassTurf;
