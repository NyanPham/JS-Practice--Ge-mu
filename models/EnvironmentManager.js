import Tree from "./Resources/Tree.js";
import Rock from "./Resources/Rock.js";
import PhysicalObject from "./PhysicalObject.js";
import BerryBush from "./Resources/BerryBush.js";
import GrassTurf from "./Resources/GrassTurf.js";
import PlayerObject from "./Resources/PlayerObject.js";
import { CRAFTING_MAP } from "./Crafting.js";

const obstacle_types = ["trees", "rocks", "berry"];

class EnvironmentManager {
  constructor(game) {
    this.game = game;
    this.numOfTrees = 50;
    this.numOfRocks = 50;
    this.numOfBerryBushses = 30;
    this.numOfGrass = 50;
    this.trees = [];
    this.rocks = [];
    this.berryBushes = [];
    this.grassTurfs = [];
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
      case "grass":
        currentArray = this.grassTurfs;
        maxNum = this.numOfGrass;
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
      } else if (type === "berry") {
        testObject = new BerryBush(this.game);
      } else {
        testObject = new GrassTurf(this.game);
      }

      let overlap = false;

      this.game.obstacles.forEach((obstacle) => {
        if (PhysicalObject.checkCollision(testObject, obstacle).collided) {
          overlap = true;
        }
      });

      if (!overlap) {
        currentArray.push(testObject);

        if (obstacle_types.includes(type)) {
          this.game.obstacles.push(testObject);
        } else {
          this.game.nonObstacles.push(testObject);
        }
      }
    }
  }

  checkInteracting(e) {
    let item = [
      ...this.trees,
      ...this.rocks,
      ...this.berryBushes,
      ...this.grassTurfs,
    ].find((item) => this.game.mouse.isWithin(item));

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

  loadData(data) {
    this.trees = [];
    this.rocks = [];
    this.berryBushes = [];
    this.grassTurfs = [];
    this.userObjects = [];

    let instance;
    data.trees.forEach((tree) => {
      instance = new Tree(this.game);
      instance.loadData(tree);
      instance.checkNeedRefill();

      this.trees.push(instance);
      this.game.obstacles.push(instance);
    });

    data.rocks.forEach((rock) => {
      instance = new Rock(this.game);
      instance.loadData(rock);
      instance.checkNeedRefill();

      this.rocks.push(instance);
      this.game.obstacles.push(instance);
    });

    data.berryBushes.forEach((bush) => {
      instance = new BerryBush(this.game);
      instance.loadData(bush);
      instance.checkNeedRefill();
      instance.checkNeedRefill();

      this.berryBushes.push(instance);
      this.game.obstacles.push(instance);
    });

    data.grassTurfs.forEach((turf) => {
      instance = new GrassTurf(this.game);
      instance.loadData(turf);
      instance.checkNeedRefill();

      this.grassTurfs.push(instance);
      this.game.nonObstacles.push(instance);
    });

    data.userObjects.forEach((userObj) => {
      const currentMappedObject = Object.values(CRAFTING_MAP).find(
        (val) => val.name === userObj.name
      );

      instance = new PlayerObject(
        this.game,
        userObj.collisionX,
        userObj.collisionY,
        userObj.collisionRadius,
        userObj.name,
        userObj.type,
        userObj.durability,
        userObj.constantDropDurability,
        currentMappedObject.customProperties,
        currentMappedObject.draw,
        currentMappedObject.update,
        currentMappedObject.onRemoval
      );

      this.userObjects.push(instance);
      this.game.obstacles.push(instance);
    });
  }
}

export default EnvironmentManager;
