class PhysicalObject {
  constructor(game, x = null, y = null, radius = 0) {
    this.game = game;
    this.collisionX = x || Math.random() * this.game.width;
    this.collisionY = y || Math.random() * this.game.height;
    this.collisionRadius = radius;

    this.speedX;
    this.speedY;
  }

  /**
   *
   * @param {PhysicalObject || { collisionX, collisionY }} otherObject
   */
  static getDistance(physicalObjectA, physicalObjectB) {
    const dx = physicalObjectB.collisionX - physicalObjectA.collisionX;
    const dy = physicalObjectB.collisionY - physicalObjectA.collisionY;

    const distance = Math.hypot(dy, dx);

    return { distance, dx, dy };
  }

  /**
   *
   * @param {PhysicalObject} otherObject
   */
  static checkCollision(physicalObjectA, physicalObjectB, distanceBuffer = 0) {
    const dx = physicalObjectA.collisionX - physicalObjectB.collisionX;
    const dy = physicalObjectA.collisionY - physicalObjectB.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii =
      physicalObjectA.collisionRadius +
      physicalObjectB.collisionRadius +
      distanceBuffer;

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
