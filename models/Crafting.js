import { createElement } from "../helper/domUtils.js";
import Tool from "./Tool.js";

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

    this.craftingItemsMap = {
      axe: {
        name: "Axe",
        type: "tool",
        durability: 10,
        materials: {
          wood: 3,
        },
      },
      pickaxe: {
        name: "Pickaxe",
        type: "tool",
        durability: 15,
        materials: {
          wood: 30,
        },
      },
      firecamp: {
        name: "Firecamp",
        type: "placeable",
        placeImage: "campfire.png",
        collisionRadius: 70,
        constantDropDurability: true,
        durability: 60 * 1000,
        materials: {
          wood: 5,
        },
      },
    };

    this.image = document.getElementById("chainsaw");

    this.imageSpacing = 10;
    this.spriteWidth = this.width - this.imageSpacing * 2;
    this.spriteHeight = this.height - this.imageSpacing * 2;

    this.spriteX = this.imageSpacing;
    this.spriteY = this.imageSpacing;

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

    this.closeCraftingListBtn.addEventListener("click", () =>
      this.craftingListContainer.classList.remove("show")
    );
  }

  handleOpenCraftingTable() {
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
