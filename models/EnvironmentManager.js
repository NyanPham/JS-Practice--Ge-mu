import Tree from "./Resources/Tree.js";
import Rock from "./Resources/Rock.js";
import PhysicalObject from "./PhysicalObject.js";
import InventoryItem from "./InventoryItem.js";
import BerryBush from "./Resources/BerryBush.js";

class EnvironmentManager {
  constructor(game) {
    this.game = game;
    this.numOfTrees = 20;
    this.numOfRocks = 20;
    this.numOfBerryBushses = 30;
    this.trees = [];
    this.rocks = [];
    this.berryBushes = [];
    this.userObjects = [];

    document.addEventListener(
      "object-removal",
      this.handleRemoveObjects.bind(this)
    );
  }

  generate(type = "trees") {
    let attempts = 0;
    let testObject;
    let currentArray, maxNum;

    switch (type) {
      case "trees":
        currentArray = this.trees;
        maxNum = this.numOfTrees;
        break;
      case "rocks":
        currentArray = this.rocks;
        maxNum = this.numOfRocks;
        break;
      case "berry":
        currentArray = this.berryBushes;
        maxNum = this.numOfBerryBushses;
        break;
      default:
        currentArray = this.trees;
        maxNum = this.numOfTrees;
    }

    while (currentArray.length < maxNum && attempts < 150) {
      if (type === "trees") {
        testObject = new Tree(this.game);
      } else if (type === "rocks") {
        testObject = new Rock(this.game);
      } else {
        testObject = new BerryBush(this.game);
      }

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
    let item = [...this.trees, ...this.rocks, ...this.berryBushes].find(
      (item) => this.game.mouse.isWithin(item)
    );

    if (item == null) return null;
    const { collided } = PhysicalObject.checkCollision(
      item,
      this.game.player,
      30
    );
    if (!collided) return null;

    return item;
  }

  addUserObjectToWorld(userObject) {
    let overlap = false;

    this.game.obstacles.forEach((obstacle) => {
      if (PhysicalObject.checkCollision(userObject, obstacle).collided) {
        overlap = true;
      }
    });

    if (!overlap) {
      this.userObjects.push(userObject);
      this.game.obstacles.push(userObject);
      this.game.updateObjectsToRender();
      return true;
    }

    return false;
  }

  handleRemoveObjects() {
    this.game.obstacles = this.game.obstacles.filter(
      (obstacle) => !obstacle.markedForDeletion
    );
    this.userObjects = this.userObjects.filter((obj) => !obj.markedForDeletion);
    this.game.updateObjectsToRender();
  }
}

export default EnvironmentManager;
