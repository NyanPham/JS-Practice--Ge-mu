import Crafting from "./Crafting.js";
import Inventory from "./Inventory.js";
import PhysicalObject from "./PhysicalObject.js";
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

    this.stats = new Stats();
    this.isDead = false;
    this.isPlacingObject = false;

    this.nearLightSource = false;
  }

  /**
   *
   * @param {ResourceObstacle} resourceItem
   */
  collect(resourceItem) {
    if (resourceItem instanceof ResourceObstacle) {
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

    this.inventory.draw(context);

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

    this.stats.draw();
  }

  update(deltaTime) {
    this.stats.update(
      deltaTime,
      !this.nearLightSource && this.game.dayCycleManager.isNight
    );

    if (this.getHealth() === 0) {
      this.isDead = true;
    }

    if (!this.canMove || this.isDead) return;

    const { x, y } = this.game.mouse.getPosition();

    const { distance, dx, dy } = PhysicalObject.getDistance(this, {
      collisionX: x,
      collisionY: y,
    });

    if (distance > this.speedModifier) {
      this.speedX = dx / distance;
      this.speedY = dy / distance;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    if (this.stats.sanity > 0) {
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    } else {
      this.collisionX += this.speedY * this.speedModifier;
      this.collisionY += this.speedX * this.speedModifier;
    }

    this.game.obstacles.forEach((obstacle) => {
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
    this.game.dayCycleManager.setDarkness(
      hasLightSource ? "rgba(0, 0, 0, 0.1)" : null
    );
  }
}

export default Player;
