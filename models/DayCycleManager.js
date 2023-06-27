class DayCycleManager {
  constructor(game) {
    this.game = game;

    this.nightOverlay = document.querySelector("[data-night-overlay]");

    this.dayInterval = 0.5 * 60 * 1000;
    this.nightInterval = 0.3 * 60 * 1000;

    this.dayNightCycleTimer = 0;
    this.dayCount = 1;
    this.isNight = false;

    this.canvas = document.getElementById("day-night-cycle");
    this.canvas.width = 90;
    this.canvas.height = 90;

    this.context = this.canvas.getContext("2d");
    this.context.font = "28px serif";
    this.context.textAlign = "center";
    this.color = ["#1abc9c", "#3498db", "#9b59b6", "#e74c3c"];
    this.currentcolor = this.color[Math.floor(Math.random() * (3 - 0))];
  }

  updateDayNight(deltaTime) {
    this.dayNightCycleTimer += deltaTime;

    if (this.dayNightCycleTimer > this.dayInterval + this.nightInterval) {
      this.dayCount++;
      this.isNight = false;
      this.dayNightCycleTimer = 0;
      this.currentcolor = this.color[Math.floor(Math.random() * (3 - 0))];
    }

    if (
      this.dayNightCycleTimer > this.dayInterval &&
      this.dayNightCycleTimer < this.dayInterval + this.nightInterval
    ) {
      this.isNight = true;
    }

    this.dayNightCycleTimer += deltaTime;
  }

  draw() {
    this.nightOverlay.classList.toggle("fall", this.isNight);

    const radian =
      this.dayNightCycleTimer / ((this.dayInterval + this.nightInterval) / 2);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.strokeStyle = this.currentcolor;
    this.context.lineWidth = 4;
    this.context.arc(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5,
      (this.canvas.width - 5) * 0.5,
      Math.PI * -0.5,
      radian * Math.PI - Math.PI * 0.5
    );
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5,
      (this.canvas.width - 5) * 0.5,
      0,
      Math.PI * 2
    );
    this.context.save();
    this.context.fillStyle = "#f7f754";
    this.context.globalAlpha = 0.3;
    this.context.fill();
    this.context.restore();

    this.context.beginPath();
    this.context.save();
    this.context.fillStyle = "white";
    this.context.fillText(
      this.dayCount,
      this.canvas.width * 0.5,
      this.canvas.height * 0.59
    );
    this.context.restore();
  }
}

export default DayCycleManager;
