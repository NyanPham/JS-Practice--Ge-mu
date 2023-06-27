import InventoryItem from "../InventoryItem.js";

class Placeable extends InventoryItem {
  constructor(name, type, quantity, placeImage, collisionRadius) {
    super(name, type, quantity);

    this.collisionRadius = collisionRadius;
    this.placeImage = document.querySelector(`img[data-image="${placeImage}"]`);

    if (this.placeImage == null) {
      this.placeImage = new Image();
      this.placeImage.src = `./assets/${placeImage}`;
      this.placeImage.dataset.image = placeImage;

      document.body.appendChild(this.placeImage);
    }
  }
}

export default Placeable;
