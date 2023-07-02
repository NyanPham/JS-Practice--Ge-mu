import { resourceActions, savedResourceLoader } from "./ResourceProperties.js";

class Resource {
  constructor(
    game,
    x = null,
    y = null,
    radius = 60,
    name = "resource",
    resevoir = null,
    resourceName = "item",
    requiredEquipments = ["barehand"]
  ) {
    this.game = game;
    this.collisionX = x || Math.random() * this.game.width;
    this.collisionY = y || Math.random() * this.game.height;
    this.collisionRadius = radius;

    this.refillInterval = null;
    this.refillTime = 7000;

    this.resevoir = resevoir || Math.floor(Math.random() * 25) + 7;
    this.maxContainer = this.resevoir;

    this.name = name;
    this.resourceName = resourceName;
    this.type = "resource";
    this.requiredEquipments = requiredEquipments;

    this.exploitRateMap = {};
  }

  update() {}
}

Object.assign(Resource.prototype, savedResourceLoader);
Object.assign(Resource.prototype, resourceActions);
export default Resource;
