import InventoryItem from "./InventoryItem.js";
import Tool from "./Tool.js";

class Inventory {
  constructor(game, player) {
    this.game = game;
    this.player = player;

    this.slotWidth = 100;
    this.slotHeight = 100;

    this.slotsNum = 7;
    this.emptyConst = "empty";

    this.inventoryCanvas = document.getElementById("inventory");
    this.inventoryCanvas.width = (this.slotsNum + 1) * this.slotWidth;
    this.inventoryCanvas.height = this.slotHeight;

    this.inventoryContext = this.inventoryCanvas.getContext("2d");
    this.inventoryContext.fillStyle = "#dfdfdf";
    this.inventoryContext.strokeStyle = "#333";
    this.inventoryContext.lineWidth = 3;
    this.inventoryContext.font = "28px serif";
    this.inventoryContext.textAlign = "center";

    this.inventorySlots = Array.from({ length: this.slotsNum }).map(
      () => this.emptyConst
    );
    this.inventoryDisplay = new Array(this.inventorySlots.length);
    this.discardImage = document.getElementById("discard-image");
    this.discardSpriteWidth = this.slotWidth / 2;
    this.discardSpriteHeight = this.slotHeight / 2;

    this.equipCanvas = document.getElementById("equipped");
    this.equipCanvas.width = this.slotWidth;
    this.equipCanvas.height = this.slotHeight;

    this.equipContext = this.equipCanvas.getContext("2d");
    this.equipContext.fillStyle = "#dfdfdf";
    this.equipContext.strokeStyle = "#333";
    this.equipContext.lineWidth = 3;
    this.equipContext.font = "28px serif";
    this.equipContext.textAlign = "center";

    this.equippedSlotIndex = null;

    this.isDragging = false;
    this.dragStartIndex = null;

    this.init();

    this.addEventListeners();
  }

  init() {
    for (let i = 0; i < this.inventoryDisplay.length; i++) {
      this.drawSlot(i);
    }

    this.drawDiscardSlot();
    this.drawEquippedHand();
  }

  addEventListeners() {
    this.inventoryCanvas.addEventListener(
      "click",
      this.handleSelectItem.bind(this)
    );

    this.inventoryCanvas.addEventListener(
      "contextmenu",
      this.handleConsumeItem.bind(this)
    );

    this.inventoryCanvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );

    this.inventoryCanvas.addEventListener(
      "mouseup",
      this.handleMouseUp.bind(this)
    );

    this.inventoryCanvas.addEventListener(
      "mousemove",
      this.handleDrag.bind(this)
    );

    this.equipCanvas.addEventListener("click", () => {
      this.player.removeTool();
      this.equippedSlotIndex = null;
      this.updateCanvasView();
    });

    document.addEventListener(
      "inventory-item-removal",
      this.removeMarkedItems.bind(this)
    );
  }

  drawSlot(index) {
    this.inventoryContext.clearRect(
      index * this.slotWidth,
      0,
      this.slotWidth,
      this.slotHeight
    );

    this.inventoryContext.beginPath();
    this.inventoryContext.moveTo(index * this.slotWidth, 0);
    this.inventoryContext.rect(
      index * this.slotWidth,
      0,
      this.slotWidth,
      this.slotHeight
    );
    this.inventoryContext.save();
    this.inventoryContext.globalAlpha = 0.5;
    if (this.equippedSlotIndex != null && this.equippedSlotIndex === index) {
      this.inventoryContext.fillStyle = "yellow";
    }
    this.inventoryContext.fill();
    this.inventoryContext.restore();
    this.inventoryContext.stroke();
    if (this.inventorySlots[index].type === "tool") {
      this.drawDurability(index);
    }
  }

  drawDiscardSlot() {
    this.inventoryContext.clearRect(
      this.slotsNum * this.slotWidth,
      0,
      this.slotWidth,
      this.slotHeight
    );

    this.inventoryContext.drawImage(
      this.discardImage,
      this.slotsNum * this.slotWidth + this.discardSpriteWidth / 3,
      this.slotHeight - this.discardSpriteHeight * 1.5,
      this.discardSpriteWidth,
      this.discardSpriteHeight
    );
    this.inventoryContext.beginPath();
    this.inventoryContext.moveTo(this.slotsNum * this.slotWidth, 0);
    this.inventoryContext.rect(
      this.slotsNum * (this.slotWidth + 1.15),
      this.slotHeight * 0.15,
      this.slotWidth * 0.7,
      this.slotHeight * 0.7
    );
    this.inventoryContext.save();
    this.inventoryContext.globalAlpha = 0.5;
    this.inventoryContext.fill();
    this.inventoryContext.restore();
    this.inventoryContext.stroke();
  }

  drawEquippedHand() {
    this.equipContext.clearRect(0, 0, this.slotWidth, this.slotHeight);
    this.equipContext.beginPath();
    this.equipContext.moveTo(this.slotWidth, 0);
    this.equipContext.rect(0, 0, this.slotWidth, this.slotHeight);
    this.equipContext.save();
    this.equipContext.globalAlpha = 0.5;
    this.equipContext.fill();
    this.equipContext.restore();
    this.equipContext.stroke();

    this.equipContext.beginPath();
    this.equipContext.fillText(
      this.player.rightHand || "barehand",
      this.slotWidth * 0.5,
      this.slotHeight * 0.5
    );
  }

  drawDurability(index) {
    const dura =
      this.inventorySlots[index].durability /
      this.inventorySlots[index].initialDurability;

    this.inventoryContext.beginPath();
    // this.inventoryContext.moveTo(index * this.slotWidth, this.slotHeight - 3);
    this.inventoryContext.save();
    this.inventoryContext.rect(
      index * this.slotWidth + 1,
      this.slotHeight - 5,
      dura * this.slotWidth - 4,
      5
    );
    this.inventoryContext.fillStyle = "blue";
    this.inventoryContext.fill();
    this.inventoryContext.restore();
  }

  updateCanvasView() {
    this.inventorySlots.forEach((item, index) => {
      if (item === this.emptyConst) return;

      this.drawSlot(index);

      this.inventoryContext.beginPath();
      this.inventoryContext.fillText(
        item.name,
        index * this.slotWidth + this.slotWidth * 0.5,
        this.slotHeight * 0.5 - 5
      );
      this.inventoryContext.fillText(
        item.quantity,
        index * this.slotWidth + this.slotWidth * 0.5,
        this.slotHeight * 0.5 + 30
      );
    });

    this.drawEquippedHand();
  }

  getItemByCoordinates(x, y) {
    const index = Math.floor(x / this.slotWidth);
    const selectedItem = this.inventorySlots[index];

    if (selectedItem === this.emptyConst) return { selectedItem: null, index };

    return { selectedItem, index };
  }

  getSlotByItemNameAndType(itemName, itemType) {
    return this.inventorySlots.find(
      (inventoryItem) =>
        inventoryItem?.name === itemName && inventoryItem?.type === itemType
    );
  }

  handleSelectItem(e) {
    const { selectedItem, index } = this.getItemByCoordinates(
      e.offsetX,
      e.offsetY
    );

    if (selectedItem == null) return;

    if (selectedItem.type === "tool") {
      this.equippedSlotIndex = index;
      this.player.equip(selectedItem);

      this.updateCanvasView();
    }
  }

  handleConsumeItem(e) {
    e.preventDefault();

    const { selectedItem, index } = this.getItemByCoordinates(
      e.offsetX,
      e.offsetY
    );
    if (selectedItem == null) return;

    if (selectedItem.type === "consumable") {
      this.player.consume(selectedItem);
      selectedItem.decrement(1);
      if (selectedItem.quantity === 0) {
        this.emptyOutSlot(index);
      }
      this.updateCanvasView();
    }
  }

  handleDrag(e) {
    if (this.isDragging) {
    }
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.dragStartIndex = Math.floor(e.offsetX / this.slotWidth);
  }

  handleMouseUp(e) {
    this.isDragging = false;
    const index = Math.floor(e.offsetX / this.slotWidth);

    if (index === this.slotsNum) {
      this.discardItem();
      this.dragStartIndex = null;

      return;
    }

    if (
      this.dragStartIndex != null &&
      this.dragStartIndex !== this.slotsNum &&
      this.inventorySlots[this.dragStartIndex] !== this.emptyConst &&
      index !== this.dragStartIndex
    ) {
      this.swapItem(index);
    }

    this.dragStartIndex = null;
  }

  getEquippedTool() {
    if (this.equippedSlotIndex == null) return null;

    return this.inventorySlots[this.equippedSlotIndex];
  }

  removeMarkedItems() {
    for (let i = 0; i < this.inventorySlots.length; i++) {
      if (
        this.inventorySlots[i].type === "tool" &&
        this.inventorySlots[i].markedForDeletion
      ) {
        this.inventorySlots[i] = this.emptyConst;
        if (i === this.equippedSlotIndex) {
          this.player.removeTool();
          this.equippedSlotIndex = null;
        }

        this.drawSlot(i);
      }
    }
  }

  /**
   *
   * @param {string} itemName
   * @param {string} itemType
   * @param {number} itemQuantity
   */
  addToInventory(itemName, itemType, itemQuantity, durability = null) {
    let emptyIdx;

    let slot = this.getSlotByItemNameAndType(itemName, itemType);

    if (slot == null || itemType === "tool") {
      slot =
        itemType === "tool"
          ? new Tool(itemName, itemType, durability)
          : new InventoryItem(itemName, itemType, 0);
      emptyIdx = this.inventorySlots.findIndex(
        (slot) => slot == this.emptyConst
      );
      if (emptyIdx === -1) return false;

      this.inventorySlots[emptyIdx] = slot;
    }

    slot.increment(itemQuantity);

    this.updateCanvasView();
    return true;
  }

  emptyOutSlot(index) {
    this.inventorySlots[index] = this.emptyConst;
    this.drawSlot(index);
  }

  takeFromInventory(itemName, itemType = "resource", itemQuantity) {
    let slot = this.getSlotByItemNameAndType(itemName, itemType);
    if (slot == null) return false;

    if (!slot.decrement(itemQuantity)) {
      return false;
    }

    if (slot.quantity === 0) {
      const idx = this.inventorySlots.indexOf(slot);
      this.emptyOutSlot(idx);
    }

    this.updateCanvasView();
    return true;
  }

  swapItem(indexToWap) {
    const temp = this.inventorySlots[indexToWap];
    this.inventorySlots[indexToWap] = this.inventorySlots[this.dragStartIndex];
    this.inventorySlots[this.dragStartIndex] = temp;

    if (this.equippedSlotIndex === this.dragStartIndex) {
      this.equippedSlotIndex = indexToWap;
    } else if (this.equippedSlotIndex === indexToWap) {
      this.equippedSlotIndex = this.dragStartIndex;
    }

    this.drawSlot(this.dragStartIndex);
    this.drawSlot(indexToWap);

    this.updateCanvasView();
  }

  discardItem() {
    if (
      this.dragStartIndex != null &&
      this.dragStartIndex !== this.slotsNum &&
      this.inventorySlots[this.dragStartIndex] !== this.emptyConst
    ) {
      if (
        window.confirm(
          `Are you sure want to throw ${
            this.inventorySlots[this.dragStartIndex].name
          } away?`
        )
      ) {
        this.inventorySlots[this.dragStartIndex] = this.emptyConst;
        if (this.dragStartIndex === this.equippedSlotIndex) {
          this.player.removeTool();
          this.equippedSlotIndex = null;
        }

        this.drawSlot(this.dragStartIndex);
        this.updateCanvasView();
      }
    }
  }

  draw(context) {}
}

export default Inventory;
