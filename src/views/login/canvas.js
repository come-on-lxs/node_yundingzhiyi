class Circle {
  constructor(ctx, x, y) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.r = Math.random() * 7
    this.xs = Math.random()
    this.ys = Math.random()
  }
  
  init() {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(255, 255, 255, .6)'
    this.ctx.arc(this.x, this.y, this.r, 0, 360, false)
    this.ctx.fill()
    this.ctx.closePath()
  }

  move() {
    this.xs = (this.x + this.r < W && this.x + this.r > 0) ? this.xs : -this.xs
    this.ys = (this.y + this.r < H && this.y + this.r > 0) ? this.ys : -this.ys
    this.x += this.xs
    this.y += this.ys
  }

  line(circle) {
    let dx = this.x - circle.x
    let dy = this.y - circle.y
    let dr = Math.sqrt( dx * dx + dy * dy )
    if(dr <= DISTANCE) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(circle.x, circle.y)
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${(DISTANCE - dr) / DISTANCE})`
      this.ctx.stroke();
    }
  }
}

class moussCircle extends Circle {
  constructor(ctx, x, y) {
    super(ctx, x, y)
  }

  init() {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'lightblue'
    this.ctx.arc(this.x, this.y, 6, 0, 360, false)
    this.ctx.fill()
    this.ctx.closePath()
  }
}

let W = window.innerWidth
let H = window.innerHeight
let MAX = 100
let DISTANCE = 100
let circles = []
//更新页面用requestAnimationFrame替代setTimeout
let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setInterval(callback, 1000/60);

let monse_circle

function init(ELENAME) {
  let canvas = document.getElementById(ELENAME)
  let ctx = canvas.getContext('2d')
  canvas.width = W
  canvas.height = H
  createMonseCircle(ctx)
  create(ctx)
}

function create(ctx) {
  for(let i=0; i<MAX; i++) {
    let circle = new Circle(ctx, Math.random() * W, Math.random() * H)
    circles.push(circle)
  }

  draw(ctx)
}

function draw(ctx) {
  ctx.clearRect(0, 0, W, H)
  let grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#0fc6e3')
  grad.addColorStop(1, '#5151b6')
  ctx.fillStyle=grad;
  ctx.fillRect(0, 0, W, H);
  for(let i=0; i<circles.length; i++) {
    circles[i].init()
    circles[i].move()

    for(let j=0; j< circles.length; j++) {
      circles[i].line(circles[j])
    }
  }

  if(monse_circle.x) {
    monse_circle.init()
    for(let i=0; i<circles.length; i++) {
      monse_circle.line(circles[i])
    }
  }
  
  requestAnimationFrame(()=>{
    draw(ctx)
  })
}

function createMonseCircle(ctx) {
  monse_circle = new moussCircle(ctx, 0, 0)
  window.onmousemove = function (e) {
    e = e || window.event
    monse_circle.x = e.clientX
    monse_circle.y = e.clientY
  }

  window.onmouseout = function () {
    monse_circle.x = null
    monse_circle.y = null
  }
}

module.exports = {
  init
}
