class Camera {
  constructor(game) {
    this.game = game;
  }

  updateView() {
    const { collisionX, collisionY } = this.game.player;
    this.game.canvas.style.setProperty(
      "--translate-x",
      collisionX - window.innerWidth / 2
    );
    this.game.canvas.style.setProperty(
      "--translate-y",
      collisionY - window.innerHeight / 2
    );

    if (window.scrollX > 0) {
      window.scrollTo({ left: 0 });
    }

    if (window.scrollY > 0) {
      window.scrollTo({ top: 0 });
    }
  }
}

export default Camera;
