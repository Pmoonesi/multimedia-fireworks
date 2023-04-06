let p = "assets/rocket.png";
let f = "assets/firework.gif"
let y = 650
let sounds = []

let rockets = []

function preload() {
  for (let i = 0; i < 5; i++) {
    sounds[i] = loadSound(`assets/fizz_${i}.mp3`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // for (let i = 0; i < sounds.length; i++) {
  //   sounds[i].playMode('sustain')
  // } 
}

function draw() { 
  // if (sounds[0].isPlaying() == false) sounds[0].play();
  // updates animation frames by using an html
  // img element, positioning it over top of
  // the canvas.
  update_all()
}

function update_all() {
  for(let i = 0; i < rockets.length; i++) {
    if (!rockets[i].isReady) continue;
    if (rockets[i].isRunning()) {
      rockets[i].move();
      rockets[i].display();
    } else if (rockets[i].isStopped()) {
      rockets[i].blowUp();
    } else if (rockets[i].isBlownUp()) {
      rockets.splice(i, 1);
      // console.log(`removed rocket number ${i} after blowing up.`)
    }
  }
}

let start, end
function mousePressed() {
  start = millis()
}

function mouseReleased() {
  end = millis()
  dif = min(end - start, 3000)
  let range = map(dif, 0, 3000, 100, height)
  let new_rocket = new Rocket(mouseX - 32, mouseY - 32, 5, range)
  rockets = [...rockets, new_rocket]
}

function batchLaunch(i, x_arr, y_arr) {
  if (i >= x_arr.length) return;
  new_rocket = new Rocket(x_arr[i], y_arr[i], 5, 500)
  rockets = [...rockets, new_rocket]
  setTimeout(() => {
    batchLaunch(i + 1, x_arr, y_arr);
  }, 100)
}

function keyPressed() {
  if (key != '1' && key != '2' && key != '3') return;
  let randXs = []
  let randYs = []
  let count = 10 + random(10)
  
  for (let i = 0; i < count; i++) {
    randXs = [...randXs, random(width)]
    randYs = [...randYs, (height - 50) - random(100)]
  }
  // if 1 is pressed, 10 to 20 random rockets are launched
  if (key == '2') {
    // if 2 is pressed, launch from right to left
    randXs.sort((a, b) => a - b)
  } else if (key == '3') {
    // if 3 is pressed, launch from left to right
    randXs.sort((a, b) => b - a)
  }

  batchLaunch(0, randXs, randYs);
}

class Rocket {
  constructor(x, y, ySpeed, launchRange) {
    this.e = null;
    // this.el = null;
    this.baseX = x;
    this.x = x;
    this.y = y;
    this.ySpeed = ySpeed;
    this.launchRange = launchRange;
    this.state = 0; // 0: not initialized, 1: launched, 2: stopped, 3: blown
    createImg(p, `test${x}`, 'anonymous', img => {this.e = img; this.state = 1})
    // createImg(f, `fire${x}`, 'anonymous', img => {this.el = img; this.el.size(64, 64); this.el.hide()})
  }

  isReady() {
    return this.state != 0
  }

  isRunning() {
    return this.state == 1
  }

  isStopped() {
    return this.state == 2
  }

  isBlownUp() {
    return this.state == 3
  }

  move() {
    if (this.y >= 0 && this.y < height && this.launchRange > 0) {
      this.y -= this.ySpeed;
      this.launchRange -= this.ySpeed;
      this.x = this.baseX + 10 * sin(this.y / 40)
    } else {
      this.state = 2
    }
  }

  display() {
    this.e.position(this.x, this.y);
  }

  blowUp() {
    this.state = 3;
    this.e.remove();
    // this.el.position(this.x, this.y);
    // this.el.show();
    track = Math.floor(random(sounds.length));
    console.log(track);
    console.log(sounds);
    sounds[track].play();
    push()
    translate(this.x, this.y)
    fill(255, 255, 0)
    rect(0, 0, 65, 65)
    pop()
    setTimeout(() => {
      // this.el.remove()
      push()
      translate(this.x, this.y)
      fill(0)
      rect(0, 0, 65, 65)
      pop()
    }, 1000)
  }
}
