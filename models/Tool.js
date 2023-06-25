import InventoryItem from "./InventoryItem.js";

class Tool extends InventoryItem {
  constructor(name, type = "tool", durability) {
    super(name, type, 1);

    this.durability = durability;
  }

  increment() {}
}

export default Tool;
