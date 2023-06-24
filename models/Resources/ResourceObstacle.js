import Obstacle from "../Obstacle.js";

class ResourceObstacle extends Obstacle {
  constructor(
    game,
    x = null,
    y = null,
    radius = 60,
    name = "item",
    resevoir = null
  ) {
    super(game, x, y, radius);

    this.resevoir = resevoir || Math.floor(Math.random() * 25);
    this.name = name;
  }

  
}

export default ResourceObstacle;
