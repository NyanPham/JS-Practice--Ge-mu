import Crafting from "./Crafting.js";
import Inventory from "./Inventory.js";
import PhysicalObject from "./PhysicalObject.js";
import ResourceObstacle from "./Resources/ResourceObstacle.js";
import Tool from "./Tool.js";

class Player extends PhysicalObject {
  constructor(game) {
    super(game, game.width * 0.5, game.height * 0.5, 30);
    this.speedModifier = 15;

    this.inventory = new Inventory(this.game, this);
    this.crafting = new Crafting(this.game, this);

    this.rightHand = "barehand";
    // this.leftHand = "barehand";
  }

  /**
   *
   * @param {ResourceObstacle} resourceItem
   */
  collect(resourceItem) {
    if (resourceItem instanceof ResourceObstacle) {
      const extracted = resourceItem.getCollected(this.rightHand);
      if (extracted == null) return false;

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

  /**
   *
   * @param {Tool} tool
   */
  equip(tool) {
    this.rightHand = tool.name.toLowerCase();
  }

  removeTool() {
    this.rightHand = "barehand";
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
  }

  update(deltaTime) {
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

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

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
  }
}

export default Player;
