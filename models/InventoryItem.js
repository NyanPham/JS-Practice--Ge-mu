import Item from "./Item.js";

class InventoryItem extends Item {
  constructor(name, type, quantity) {
    super(name, type);
    this.quantity = quantity;
  }

  increment(incrementQuantity) {
    this.quantity += incrementQuantity;
  }

  decrement(decrementQuantity) {
    if (decrementQuantity > this.quantity) return false;

    this.quantity -= decrementQuantity;
    return true;
  }
}

export default InventoryItem;
