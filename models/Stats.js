class Stats {
  constructor() {
    this.maxHealth = 100;
    this.maxHunger = 100;
    this.maxSanity = 100;

    this.health = 100;
    this.hunger = 100;
    this.sanity = 50;

    this.statsWidth = 85;
    this.statsHeight = 85;

    this.statsCanvas = document.getElementById("player-stats");
    this.statsCanvas.width = this.statsWidth * 2.5;
    this.statsCanvas.height = this.statsHeight * 2.5;

    this.statsContext = this.statsCanvas.getContext("2d");
    this.statsContext.fillStyle = "white ";
    this.statsContext.font = "20px serif";
    this.statsContext.textAlign = "center";

    this.constantHungerRate = 3;
    this.hungerReduceInterval = 5000;
    this.hungerTimer = 0;

    this.healthRate = 7;
    this.healthReduceInterval = 1000;
    this.healthTimer = 0;
  }

  update(deltaTime) {
    this.updateConstantHunger(deltaTime);
    this.updateHealth(deltaTime);
  }

  updateHealth(deltaTime) {
    if (this.hunger > 0 && this.healthTimer > 0) {
      this.healthTimer = 0;
    }

    if (this.hunger > 0) {
      return;
    }

    if (this.healthTimer >= this.healthReduceInterval) {
      this.health = Math.max(0, this.health - this.healthRate);

      this.healthTimer = 0;
    }

    this.healthTimer += deltaTime;
  }

  updateConstantHunger(deltaTime) {
    if (this.hungerTimer >= this.hungerReduceInterval) {
      this.hunger = Math.max(0, this.hunger - this.constantHungerRate);

      this.hungerTimer = 0;
    }

    this.hungerTimer += deltaTime;
  }

  draw() {
    this.drawHealth();
    this.drawHunger();
    this.drawSanity();
  }

  drawStat(x, y, textX, textY, background, label, value, textColor = null) {
    this.statsContext.beginPath();
    this.statsContext.arc(x, y, this.statsWidth * 0.5, 0, Math.PI * 2);
    this.statsContext.save();
    this.statsContext.fillStyle = background;
    this.statsContext.fill();
    this.statsContext.restore();

    if (textColor != null) {
      this.statsContext.save();
      this.statsContext.fillStyle = textColor;
      this.statsContext.fillText(label, textX, textY);
      this.statsContext.fillText(value, textX, textY + 20);
      this.statsContext.restore();
    } else {
      this.statsContext.fillText(label, textX, textY);
      this.statsContext.fillText(value, textX, textY + 20);
    }
  }

  drawHealth() {
    this.drawStat(
      this.statsWidth * 0.5,
      this.statsHeight * 0.5,
      this.statsWidth * 0.5,
      this.statsHeight * 0.45,
      "red",
      "Health",
      ((this.health / this.maxHealth) * 100).toFixed(0) + "%"
    );
  }

  drawHunger() {
    this.drawStat(
      this.statsWidth * 1.8,
      this.statsHeight * 0.5,
      this.statsWidth * 1.8,
      this.statsHeight * 0.45,
      "orange",
      "Hunger",
      ((this.hunger / this.maxHunger) * 100).toFixed(0) + "%"
    );
  }

  drawSanity() {
    this.drawStat(
      this.statsWidth * 1.15,
      this.statsHeight * 1.65,
      this.statsWidth * 1.15,
      this.statsHeight * 1.6,
      "yellow",
      "Sanity",
      ((this.sanity / this.maxSanity) * 100).toFixed(0) + "%",
      "black"
    );
  }

  addStat(statName, value) {
    const maxStat = this[`max${statName[0].toUpperCase() + statName.slice(1)}`];
    this[statName] = Math.min(maxStat, this[statName] + value);
  }
}

export default Stats;
