import { createElement } from "../helper/domUtils.js";

export const ITEM_USE_TYPE = {
  tool: "tool",
  consumable: "consumable",
  placeable: "placeable",
};

export const CRAFTING_MAP = {
  workbench: {
    name: "workbench",
    type: ITEM_USE_TYPE.placeable,
    durability: null,
    materials: {
      wood: 5,
    },
    placeImage: "campfire.png",
    collisionRadius: 25,
    constantDropDurability: false,
    customProperties: function () {},
    draw: function (context) {
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
      context.fillStyle = "brown";
      context.fill();
      context.restore();
      context.stroke();
    },
    update: function (deltaTime) {},
    onRemoval: function () {},
  },
  axe: {
    name: "axe",
    type: ITEM_USE_TYPE.tool,
    durability: 10,
    materials: {
      wood: 3,
    },
  },
  pickaxe: {
    name: "pickaxe",
    type: ITEM_USE_TYPE.tool,
    durability: 15,
    materials: {
      wood: 30,
    },
  },
  straw_roll: {
    name: "straw_roll",
    type: ITEM_USE_TYPE.consumable,
    durability: 1,
    materials: {
      fiber: 30,
    },
  },
  firecamp: {
    name: "firecamp",
    type: ITEM_USE_TYPE.placeable,
    placeImage: "campfire.png",
    collisionRadius: 35,
    constantDropDurability: true,
    durability: 1 * 60 * 1000,
    materials: {
      wood: 5,
    },
    customProperties: function () {
      this.lightRadius = this.collisionRadius * 7;
    },
    draw: function (context) {
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
      context.fillStyle = "yellow";
      context.fill();
      context.restore();
      context.stroke();

      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.lightRadius || 0,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.3;
      context.fillStyle = "yellow";
      context.fill();
      context.restore();
    },
    update: function (deltaTime) {},
    onRemoval: function () {},
  },
};

export const WORKBENCH_CRAFTING_MAP = {
  shovel: {
    name: "shovel",
    type: ITEM_USE_TYPE.tool,
    durability: 25,
    materials: {
      wood: 10,
      rock: 5,
    },
  },
  tent: {
    name: "tent",
    type: ITEM_USE_TYPE.placeable,
    durability: 7,
    materials: {
      fiber: 30,
      wood: 30,
      rock: 35,
    },
    placeImage: "campfire.png",
    collisionRadius: 50,
    constantDropDurability: false,
    customProperties: function () {},
    draw: function (context) {
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
      context.fillStyle = "gray";
      context.fill();
      context.restore();
      context.stroke();
    },
    update: function (deltaTime) {},
    onRemoval: function () {},
  },
};

class Crafting {
  constructor(game, player) {
    this.game = game;
    this.player = player;

    this.width = 70;
    this.height = 70;

    this.craftingCanvas = document.getElementById("crafting");
    this.craftingCanvas.width = this.width;
    this.craftingCanvas.height = this.height;

    this.craftingContext = this.craftingCanvas.getContext("2d");

    this.craftingContext.fillStyle = "#dfdfdf";
    this.craftingContext.strokeStyle = "#333";
    this.craftingContext.lineWidth = 3;
    this.craftingContext.font = "40px serif";
    this.craftingContext.textAlign = "center";

    this.craftingItemsMap = CRAFTING_MAP;

    this.image = document.getElementById("chainsaw");

    this.imageSpacing = 10;
    this.spriteWidth = this.width - this.imageSpacing * 2;
    this.spriteHeight = this.height - this.imageSpacing * 2;

    this.spriteX = this.imageSpacing;
    this.spriteY = this.imageSpacing;

    this.isNearWorkbench = false;

    // crafting list
    this.init();
  }

  init() {
    this.draw();

    this.craftingCanvas.addEventListener(
      "click",
      this.handleOpenCraftingTable.bind(this)
    );

    this.craftingListContainer = document.getElementById(
      "crafting-list-container"
    );
    this.closeCraftingListBtn = this.craftingListContainer.querySelector(
      "[data-close-crafting-btn]"
    );

    this.craftbleList = this.craftingListContainer.querySelector(
      "[data-craftable-list]"
    );

    this.craftbleList.addEventListener("click", this.craftItem.bind(this));

    this.craftingListContainer.addEventListener("click", (e) => {
      if (
        e.target.matches("[data-craftable-list]") ||
        e.target.closest("[data-craftable-list]") != null
      )
        return;
      this.craftingListContainer.classList.remove("show");
    });

    this.closeCraftingListBtn.addEventListener("click", () =>
      this.craftingListContainer.classList.remove("show")
    );
  }

  handleOpenCraftingTable() {
    this.craftingItemsMap = CRAFTING_MAP;

    if (this.isNearWorkbench) {
      this.craftingItemsMap = {
        ...this.craftingItemsMap,
        ...WORKBENCH_CRAFTING_MAP,
      };
    }

    const craftableItems = Object.entries(this.craftingItemsMap).reduce(
      (craftable, itemMap) => {
        const enoughMaterial = Object.entries(itemMap[1].materials).every(
          ([resourceName, requiredQuantity]) => {
            return this.player
              .getInventory()
              .find(
                (item) =>
                  item.name === resourceName &&
                  item.quantity >= requiredQuantity
              );
          }
        );

        if (!enoughMaterial) return craftable;
        return [...craftable, itemMap];
      },
      []
    );

    this.craftbleList.innerHTML = "";

    craftableItems.forEach((item) => {
      const craftDiv = createElement("div", {
        class: "crafting-item",
        dataset: { craftItem: item[0] },
        text: item[1].name,
      });

      this.craftbleList.appendChild(craftDiv);
    });

    this.craftingListContainer.classList.add("show");
  }

  craftItem(e) {
    let craftItemDiv;

    if (e.target.matches("[data-craft-item]")) {
      craftItemDiv = e.target;
    } else if (e.target.closest("[data-craft-item]")) {
      craftItemDiv = e.target.closest("[data-craft-item]");
    }

    if (craftItemDiv == null) return;
    // craft item here
    const craftingItem = this.craftingItemsMap[craftItemDiv.dataset.craftItem];

    const shouldCreateItem = Object.entries(craftingItem.materials).every(
      ([resourceName, requiredQuantity]) => {
        return this.player.inventory.takeFromInventory(
          resourceName,
          "resource",
          requiredQuantity
        );
      }
    );

    if (shouldCreateItem) {
      this.player.inventory.addToInventory(
        craftingItem.name,
        craftingItem.type,
        1,
        craftingItem.durability,
        craftingItem.placeImage,
        craftingItem.collisionRadius
      );
    }
  }

  draw() {
    this.craftingContext.drawImage(
      this.image,
      this.spriteX,
      this.spriteY,
      this.spriteWidth,
      this.spriteHeight
    );

    this.craftingContext.beginPath();
    this.craftingContext.moveTo(0, 0);
    this.craftingContext.rect(0, 0, this.width, this.height);
    this.craftingContext.save();
    this.craftingContext.globalAlpha = 0.5;
    this.craftingContext.fill();
    this.craftingContext.restore();
    this.craftingContext.stroke();
  }
}

export default Crafting;
