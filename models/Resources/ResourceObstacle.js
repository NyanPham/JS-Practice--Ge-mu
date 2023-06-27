import Obstacle from "../Obstacle.js";

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

  getCollected(rightHand, equippedTool = null) {
    if (!this.requiredEquipments.includes(rightHand)) {
      alert(
        `Cannot collect ${this.resourceName} from ${this.name} with ${rightHand}`
      );
      return;
    }

    if (this.resevoir === 0) {
      alert("The resource needs time to recover");
      return;
    }

    if (Object.keys(this.exploitRateMap).length === 0) {
      this.requiredEquipments.forEach((equipName, index) => {
        this.exploitRateMap[equipName] = index + 1;
      });
    }

    let quantity = this.exploitRateMap[rightHand];

    let validQuantityToExploit =
      quantity < this.resevoir ? quantity : this.resevoir;

    this.resevoir -= validQuantityToExploit;

    if (this.refillInterval !== null) {
      clearInterval(this.refillInterval);
    }

    this.refillInterval = setInterval(this.refill.bind(this), this.refillTime);

    if (equippedTool != null) equippedTool.reduceDurability(1);

    return validQuantityToExploit;
  }

  increment(quantity) {
    this.resevoir += quantity;
  }

  refill() {
    if (this.resevoir < this.maxContainer) {
      this.resevoir++;
    }

    if (this.resevoir === this.maxContainer) {
      window.clearInterval(this.refillInterval);
      this.refillInterval = null;
    }
  }
}

export default ResourceObstacle;
