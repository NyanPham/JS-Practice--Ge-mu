import Obstacle from "../Obstacle.js";

class PlayerObject extends Obstacle {
  constructor(
    game,
    x,
    y,
    radius,
    name,
    type,
    durability,
    constantDropDurability
  ) {
    super(game, x, y, radius);

    this.name = name;
    this.type = type;
    this.durability = durability;
    this.constantDropDurability = constantDropDurability;
  }
}

export default PlayerObject;
