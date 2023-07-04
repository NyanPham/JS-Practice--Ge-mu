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
    constantDropDurability,
    customProperties,
    draw,
    update,
    onRemoval
  ) {
    super(game, x, y, radius);

    this.name = name;
    this.type = type;
    this.durability = durability;
    this.constantDropDurability = constantDropDurability;
    this.markedForDeletion = false;

    this.drawFunc = draw;
    this.updateFunc = update;
    this.onRemoval = onRemoval;

    customProperties.bind(this)();
  }

  draw(context) {
    this.drawFunc(context);
  }

  update(deltaTime) {
    this.updateFunc(deltaTime);

    this.decreaseDurability();
  }

  decreaseDurability() {
    if (this.durability == null || !this.constantDropDurability) return;

    if (this.constantDropDurability) {
      this.durability -= deltaTime;
    }

    if (this.durability <= 0) {
      this.onRemoval();
      this.markedForDeletion = true;

      document.dispatchEvent(new CustomEvent("object-removal"));
    }
  }
}

export default PlayerObject;
