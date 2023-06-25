import Tree from "./Resources/Tree.js";
import Rock from "./Resources/Rock.js";
import PhysicalObject from "./PhysicalObject.js";
import InventoryItem from "./InventoryItem.js";

class EnvironmentManager {
  constructor(game) {
    this.game = game;
    this.numOfTrees = 15;
    this.numOfRocks = 15;
    this.trees = [];
    this.rocks = [];
  }

  generate(type = "trees") {
    let attempts = 0;
    let testObject;

    const currentArray = type === "trees" ? this.trees : this.rocks;
    const maxNum = type === "trees" ? this.numOfTrees : this.numOfRocks;

    while (currentArray.length < maxNum && attempts < 150) {
      testObject = type === "trees" ? new Tree(this.game) : new Rock(this.game);
      let overlap = false;

      this.game.obstacles.forEach((obstacle) => {
        if (PhysicalObject.checkCollision(testObject, obstacle).collided) {
          overlap = true;
        }
      });

      if (!overlap) {
        currentArray.push(testObject);
        this.game.obstacles.push(testObject);
      }
    }
  }

  checkInteracting(e) {
    let item = [...this.trees, ...this.rocks].find((item) =>
      this.game.mouse.isWithin(item)
    );

    if (item == null) return null;
    if (PhysicalObject.getDistance(item, this.game.player).distance > 120)
      return null;

    return item;
  }
}

export default EnvironmentManager;
