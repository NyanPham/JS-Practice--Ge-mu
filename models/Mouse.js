class Mouse {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.pressed = false;

    this.useMouseCursor = false;
    this.mouseCursor = document.getElementById("mouse-cursor");
    this.mouseCursorImage = this.mouseCursor.querySelector(
      "[ data-mouse-cursor-image]"
    );
  }

  enableMouseCursor(src, radius) {
    this.useMouseCursor = true;
    this.mouseCursorImage.src = src;
    this.mouseCursor.style.setProperty("--radius", radius);
    this.mouseCursor.style.setProperty("--position-x", this.x);
    this.mouseCursor.style.setProperty("--position-y", this.y);
    this.mouseCursor.classList.add("show");
  }

  disableMouseCursor() {
    this.useMouseCursor = false;
    this.mouseCursor.classList.remove("show");
  }

  setCursorMousePosition(x, y) {
    if (this.useMouseCursor) {
      this.mouseCursor.style.setProperty("--position-x", x);
      this.mouseCursor.style.setProperty("--position-y", y);
    }
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
