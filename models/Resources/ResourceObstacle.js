import Obstacle from "../Obstacle.js";
import { resourceActions, savedResourceLoader } from "./ResourceProperties.js";

export const ITEM_VALUE_MAP = new Map([
  ["berry", { health: 1, hunger: 7, sanity: 0 }],
]);

class ResourceObstacle extends Obstacle {
  constructor(
    game,
    x = null,
    y = null,
    radius = 60,
    name = "resource",
    resevoir = null,
    resourceName = "item",
    requiredEquipments = ["barehand"],
    consumable = false
  ) {
    super(game, x, y, radius);
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
}

Object.assign(ResourceObstacle.prototype, savedResourceLoader);
Object.assign(ResourceObstacle.prototype, resourceActions);

export default ResourceObstacle;
