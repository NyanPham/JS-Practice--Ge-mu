import Game from "./models/Game.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280 * 3;
canvas.height = 720 * 3;

ctx.strokeStyle = "black";
ctx.lineWidth = 3;
ctx.fillStyle = "white";
ctx.moveTo(0, 0);
ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fill();

const game = new Game(canvas);
game.init();

animate();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.render(ctx);
  requestAnimationFrame(animate);
}
