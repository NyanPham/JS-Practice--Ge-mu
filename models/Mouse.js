class Mouse {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.pressed = false;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  togglePressed(isPressed) {
    this.pressed = isPressed;
  }

  isPressed() {
    return this.pressed;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  isWithin(obstacle) {
    return (
      this.x > obstacle.collisionX - obstacle.collisionRadius &&
      this.x < obstacle.collisionX + obstacle.collisionRadius &&
      this.y > obstacle.collisionY - obstacle.collisionRadius &&
      this.y < obstacle.collisionY + obstacle.collisionRadius
    );
  }
}

export default Mouse;
