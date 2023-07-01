export const resourceActions = {
  getCollected(rightHand, equippedTool = null) {
    if (!this.requiredEquipments.includes(rightHand)) {
      alert(
        `Cannot collect ${this.resourceName} from ${this.name} with ${rightHand}`
      );
      return;
    }

    if (this.resevoir === 0) {
      alert("The resource needs time to recover");
      return;
    }

    if (Object.keys(this.exploitRateMap).length === 0) {
      this.requiredEquipments.forEach((equipName, index) => {
        this.exploitRateMap[equipName] = index + 1;
      });
    }

    let quantity = this.exploitRateMap[rightHand];

    let validQuantityToExploit =
      quantity < this.resevoir ? quantity : this.resevoir;

    this.resevoir -= validQuantityToExploit;

    if (this.refillInterval !== null) {
      clearInterval(this.refillInterval);
    }

    this.refillInterval = setInterval(this.refill.bind(this), this.refillTime);

    if (equippedTool != null) equippedTool.reduceDurability(1);

    return validQuantityToExploit;
  },

  increment(quantity) {
    this.resevoir += quantity;
  },

  refill() {
    if (this.resevoir < this.maxContainer) {
      this.resevoir++;
    }

    if (this.resevoir === this.maxContainer) {
      window.clearInterval(this.refillInterval);
      this.refillInterval = null;
    }
  },
};

export const resourceProperties = (
  name,
  resourceName = "item",
  requiredEquipments = ["barehand"],
  refillTime = 7000,
  refillInterval = null,
  resevoir = null
) => {
  return {
    refillInterval,
    refillTime,
    resevoir: resevoir || Math.floor(Math.random() * 25) + 7,
    maxContainer: this.resevoir,
    name,
    resourceName,
    requiredEquipments,
    exploitRateMap: {},
  };
};