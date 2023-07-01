import { attackTarget, attacker, hasHealth } from "../combat/combat.js";
import Crafting from "./Crafting.js";
import Inventory from "./Inventory.js";
import PhysicalObject from "./PhysicalObject.js";
import Resource from "./Resources/Resource.js";
import ResourceObstacle, {
  ITEM_VALUE_MAP,
} from "./Resources/ResourceObstacle.js";
import Stats from "./Stats.js";
import Tool from "./Tool.js";

class Player extends PhysicalObject {
  constructor(game) {
    super(game, game.width * 0.5, game.height * 0.5, 30);
    this.speedModifier = 15;
    this.canMove = true;

    this.inventory = new Inventory(this.game, this);
    this.crafting = new Crafting(this.game, this);

    this.rightHand = "barehand";
    // this.leftHand = "barehand";

    this.stats = new Stats(this);
    this.isDead = false;
    this.isPlacingObject = false;

    this.nearLightSource = false;

    this.rageRange = 300;
    this.attackRange = 30;
    this.damage = 20;
    this.attackInterval = 1000;
    this.attackTimer = 0;

    this.normalImage = document.getElementById("player-image");
    this.flippedImage = document.getElementById("player-flipped-image");

    this.image = this.normalImage;
    this.spriteWidth = 48;
    this.spriteHeight = 48;
    this.width = this.spriteWidth * 3.8;
    this.height = this.spriteHeight * 3.8;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
    this.frameX = 0;
    this.frameY = 0;
    this.frameYSwap = false;

    this.frameTimer = 0;
    this.frameInterval = 75;

    this.isMoving = false;
  }

  /**
   *
   * @param {ResourceObstacle | Resource} resourceItem
   */
  collect(resourceItem) {
    if (
      resourceItem instanceof ResourceObstacle ||
      resourceItem instanceof Resource
    ) {
      const extracted = resourceItem.getCollected(
        this.rightHand,
        this.getEquippedTool()
      );
      if (extracted == null) return false;
      const toolIdx = this.getEquippedToolIndex();
      if (toolIdx != null) this.inventory.drawSlot(toolIdx);

      if (
        !this.inventory.addToInventory(
          resourceItem.resourceName,
          resourceItem.type,
          extracted
        )
      ) {
        resourceItem.increment(extracted);
      }
    }
  }

  getInventory() {
    return this.inventory.inventorySlots;
  }

  consume(item) {
    const { health, hunger, sanity } = ITEM_VALUE_MAP.get(item.name);

    this.stats.addStat("hunger", hunger);
    this.stats.addStat("health", health);
    this.stats.addStat("sanity", sanity);
  }

  getItemInfoAfterCrafting(itemName) {
    return Object.values(this.crafting.craftingItemsMap).find(
      (data) => data.name === itemName
    );
  }

  /**
   *
   * @param {Tool} tool
   */
  equip(tool) {
    this.rightHand = tool.name.toLowerCase();
  }

  removeTool() {
    this.rightHand = "barehand";
    this.inventory.equippedSlotIndex = null;
  }

  getEquippedTool() {
    return this.inventory.getEquippedTool();
  }

  getEquippedToolIndex() {
    return this.inventory.equippedSlotIndex;
  }

  enableMovement() {
    this.canMove = true;
  }

  disableMovement() {
    this.canMove = false;
  }

  getHealth() {
    return this.stats.health;
  }

  startPlacingItem() {
    this.isPlacingObject = true;
  }

  getPlacingItem() {
    return this.inventory.getPlacingItem();
  }

  placeItem() {
    this.isPlacingObject = false;
    const index = this.inventory.objectPlacingIndex;
    this.inventory.objectPlacingIndex = null;
    this.inventory.emptyOutSlot(index);
  }

  cancelPlacingItem() {
    this.isPlacingObject = false;
    this.inventory.cancelPlacingItem();
  }

  draw(context) {
    const { x, y } = this.game.mouse.getPosition();

    context.save();
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    context.restore();

    this.inventory.draw(context);
    this.stats.draw();

    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );

      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(x, y);
      context.stroke();
    }
  }

  update(deltaTime) {
    this.deltaTime = deltaTime;
    this.attackTimer += deltaTime;

    this.stats.update(
      deltaTime,
      !this.nearLightSource && this.game.dayCycleManager.isNight
    );

    if (this.getHealth() === 0) {
      this.isDead = true;
    }

    if (!this.canMove || this.isDead) return;

    const { distance, dx, dy } = this.moveToMouse();
    this.updateFrameLoop(deltaTime, dx, dy);
    this.checkCollisionsToObjects();
    this.checkLightSource();

    this.game.dayCycleManager.setDarkness(
      this.nearLightSource ? "rgba(0, 0, 0, 0.1)" : null
    );
  }

  updateFrameLoop(deltaTime, dx, dy) {
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (this.frameTimer > this.frameInterval) {
      this.image = this.normalImage;

      if (angle > 0 && angle < 135) {
        this.frameY = this.isMoving ? 3 : 0;
      } else if (angle < -135 && angle < 135) {
        this.frameY = this.isMoving ? 4 : 1;
        this.image = this.flippedImage;
      } else if (angle > -45 && angle < 45) {
        this.frameY = this.isMoving ? 4 : 1;
      } else if (angle < -45 && angle > -135) {
        this.frameY = this.isMoving ? 5 : 2;
      }

      this.frameX++;
      if (this.frameX > 5) this.frameX = 0;

      this.frameTimer = 0;
    }

    this.frameTimer += deltaTime;
  }

  moveToMouse() {
    const { x, y } = this.game.mouse.getPosition();

    const { distance, dx, dy } = PhysicalObject.getDistance(this, {
      collisionX: x,
      collisionY: y,
    });

    if (distance > this.speedModifier) {
      this.speedX = dx / distance;
      this.speedY = dy / distance;
      this.isMoving = true;
    } else {
      this.speedX = 0;
      this.speedY = 0;
      this.isMoving = false;
    }

    if (this.stats.sanity > 0) {
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    } else {
      this.collisionX += this.speedY * this.speedModifier;
      this.collisionY += this.speedX * this.speedModifier;
    }

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;

    return { distance, dx, dy };
  }

  checkCollisionsToObjects() {
    [...this.game.obstacles, ...this.game.enemies].forEach((obstacle) => {
      const { collided, distance, sumOfRadii, dx, dy } =
        PhysicalObject.checkCollision(this, obstacle, 0);
      if (collided) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;

        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        if (this.game.mouse.isWithin(obstacle)) {
          this.game.mouse.setPosition(this.collisionX, this.collisionY);
        }
      }
    });
  }

  checkLightSource() {
    let hasLightSource = false;

    this.game.environmentManager.userObjects.forEach((userObject) => {
      if (userObject.name.toLowerCase() === "firecamp") {
        if (
          PhysicalObject.getDistance(this, userObject).distance <
          userObject.lightRadius
        ) {
          hasLightSource = true;
        }
      }
    });

    this.nearLightSource = hasLightSource;
  }
}

Object.assign(Player.prototype, hasHealth);
Object.assign(Player.prototype, attackTarget);
Object.assign(Player.prototype, attacker);

export default Player;
