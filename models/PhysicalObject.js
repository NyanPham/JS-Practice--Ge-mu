class PhysicalObject {
  constructor(game, x = null, y = null, radius = 0) {
    this.game = game;
    this.collisionX = x || Math.random() * this.game.width;
    this.collisionY = y || Math.random() * this.game.height;
    this.collisionRadius = radius;

    this.dx;
    this.dy;
    this.speedX;
    this.speedY;
  }

  /**
   *
   * @param {PhysicalObject || { collisionX, collisionY }} otherObject
   */
  getDistance(otherObject) {
    const dx = otherObject.collisionX - this.collisionX;
    const dy = otherObject.collisionY - this.collisionY;

    this.dx = dx;
    this.dy = dy;

    const distance = Math.hypot(this.dy, this.dx);

    return { distance, dx, dy };
  }

  /**
   *
   * @param {PhysicalObject} otherObject
   */
  checkCollision(otherObject, distanceBuffer = 0) {
    const { distance, dx, dy } = this.getDistance(otherObject);
    const sumOfRadii =
      this.collisionRadius + otherObject.collisionRadius + distanceBuffer;

    return {
      collided: distance < sumOfRadii,
      distance,
      sumOfRadii,
      dx,
      dy,
    };
  }
}

export default PhysicalObject;
