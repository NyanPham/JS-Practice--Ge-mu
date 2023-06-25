import InventoryItem from "./InventoryItem.js";

class Tool extends InventoryItem {
  constructor(name, type = "tool", durability) {
    super(name, type, 1);

    this.initialDurability = durability;
    this.durability = durability;
  }

  increment() {}

  loseDurability(step = 1) {
    this.durability -= step;
  }
}

export default Tool;
