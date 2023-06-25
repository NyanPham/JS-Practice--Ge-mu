import InventoryItem from "./InventoryItem.js";
import Tool from "./Tool.js";

class Inventory {
  constructor(game, player) {
    this.game = game;
    this.player = player;

    this.slotWidth = 100;
    this.slotHeight = 100;

    this.slotsNum = 7;

    this.inventoryCanvas = document.getElementById("inventory");
    this.inventoryCanvas.width = this.slotsNum * this.slotWidth;
    this.inventoryCanvas.height = this.slotHeight;

    this.inventoryContext = this.inventoryCanvas.getContext("2d");
    this.inventoryContext.fillStyle = "#dfdfdf";
    this.inventoryContext.strokeStyle = "#333";
    this.inventoryContext.lineWidth = 3;
    this.inventoryContext.font = "28px serif";
    this.inventoryContext.textAlign = "center";

    this.inventorySlots = Array.from({ length: this.slotsNum }).map(
      () => "empty"
    );
    this.inventoryDisplay = new Array(this.inventorySlots.length);

    this.equipCanvas = document.getElementById("equipped");
    this.equipCanvas.width = this.slotWidth;
    this.equipCanvas.height = this.slotHeight;

    this.equipContext = this.equipCanvas.getContext("2d");
    this.equipContext.fillStyle = "#dfdfdf";
    this.equipContext.strokeStyle = "#333";
    this.equipContext.lineWidth = 3;
    this.equipContext.font = "28px serif";
    this.equipContext.textAlign = "center";

    this.selectedSlotIndex = null;

    this.isDragging = false;
    this.dragStartIndex = null;

    this.init();

    this.addEventListeners();
  }

  init() {
    for (let i = 0; i < this.inventoryDisplay.length; i++) {
      this.drawSlot(i);
    }

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
      this.selectedSlotIndex = null;
      this.updateCanvasView();
    });
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
    this.inventoryContext.fill();
    if (this.selectedSlotIndex && this.selectedSlotIndex === index) {
      this.inventoryContext.strokeStyle = "red";
      this.inventoryContext.stroke();
    }
    this.inventoryContext.restore();

    if (this.selectedSlotIndex !== index) this.inventoryContext.stroke();
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

  updateCanvasView() {
    this.inventorySlots.forEach((item, index) => {
      if (item === "empty") return;

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

    if (selectedItem === "empty") return { selectedItem: null, index };

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
      this.selectedSlotIndex = index;

      this.player.equip(selectedItem);

      this.updateCanvasView();
    }
  }

  handleConsumeItem(e) {
    e.preventDefault();

    const { selectedItem } = this.getItemByCoordinates(e.offsetX, e.offsetY);
    if (selectedItem == null) return;

    if (selectedItem.type === "consumable") {
      console.log("should eat");
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

    if (
      this.dragStartIndex != null &&
      this.inventorySlots[this.dragStartIndex] !== "empty" &&
      index !== this.dragStartIndex
    ) {
      const temp = this.inventorySlots[index];
      this.inventorySlots[index] = this.inventorySlots[this.dragStartIndex];
      this.inventorySlots[this.dragStartIndex] = temp;

      if (this.selectedSlotIndex === this.dragStartIndex) {
        this.selectedSlotIndex = index;
      } else if (this.selectedSlotIndex === index) {
        this.selectedSlotIndex = this.dragStartIndex;
      }

      this.drawSlot(this.dragStartIndex);
      this.drawSlot(index);

      this.updateCanvasView();

      this.dragStartIndex = null;
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
      emptyIdx = this.inventorySlots.findIndex((slot) => slot == "empty");
      if (emptyIdx === -1) return false;

      this.inventorySlots[emptyIdx] = slot;
    }

    slot.increment(itemQuantity);

    this.updateCanvasView();
    return true;
  }

  takeFromInventory(itemName, itemType = "resource", itemQuantity) {
    let slot = this.getSlotByItemNameAndType(itemName, itemType);
    if (slot == null) return false;

    if (!slot.decrement(itemQuantity)) {
      return false;
    }

    if (slot.quantity === 0) {
      const idx = this.inventorySlots.indexOf(slot);
      this.inventorySlots[idx] = "empty";

      this.drawSlot(idx);
    }

    this.updateCanvasView();
    return true;
  }

  draw(context) {}
}

export default Inventory;
