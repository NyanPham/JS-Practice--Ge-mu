import Obstacle from "../Obstacle.js";

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

    this.resevoir = resevoir || Math.floor(Math.random() * 25);
    this.name = name;
    this.resourceName = resourceName;
    this.type = "resource";
    this.requiredEquipments = requiredEquipments;
    this.consumable = consumable;

    this.exploitRateMap = {};
  }

  getCollected(rightHand, equippedTool) {
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
    equippedTool.reduceDurability(0);
    return validQuantityToExploit;
  }

  increment(quantity) {
    this.resevoir += quantity;
  }
}

export default ResourceObstacle;
