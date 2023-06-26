import InventoryItem from "./InventoryItem.js";

class Tool extends InventoryItem {
  constructor(name, type = "tool", durability) {
    super(name, type, 1);

    this.initialDurability = durability;
    this.durability = durability;

    this.markedForDeletion = false;
  }

  increment() {}

  reduceDurability(step = 1) {
    this.durability -= step;

    if (this.durability <= 0) {
      this.markedForDeletion = true;
      document.dispatchEvent(new CustomEvent("inventory-item-removal"));
    }
  }
}

export default Tool;
