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
}

export default Mouse;
