export const deadAnimator = {
  playDeadAnimation(deltaTime) {
    console.log(this.lastDeadFrameIndex);
    if (this.deadAnimationEnded) return;

    if (!this.deadAnimationStarted) {
      this.frameX = 0;
      this.frameY = this.deadFrameRow;
      this.deadAnimationStarted = true;
      this.image = this.normalImage;
    }

    if (this.deadTime > this.deadInterval) {
      this.frameX++;

      if (this.frameX === this.lastDeadFrameIndex)
        this.deadAnimationEnded = true;
      this.deadTime = 0;
    }

    this.deadTime += deltaTime;
  },
};
