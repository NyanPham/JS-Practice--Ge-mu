import Game from "./models/Game.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280 * 6;
canvas.height = 720 * 6;

ctx.strokeStyle = "black";
ctx.lineWidth = 3;
ctx.fillStyle = "white";
ctx.moveTo(0, 0);
ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fill();

const game = new Game(canvas);
game.init();

let lastTime = 0;
function animate(time) {
  const delta = time - lastTime;

  game.render(ctx, delta);

  lastTime = time;
  requestAnimationFrame(animate);
}
animate(0);
