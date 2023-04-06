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
  createCanvas(windowWidth, 700);
  background(0);

  for (let i = 0; i < sounds.length; i++) {
    sounds[i].playMode('sustain')
  } 

  console.log('hi');
  console.error('pls');
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
    if (rockets[i].isRunning()) {
      rockets[i].move();
      rockets[i].display();
    } else if (!rockets[i].isBlown()) {
      rockets[i].blowUp();
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

function keyPressed() {
  if (key != '1' && key != '2' && key != '3') return;
  let randXs = []
  let randYs = []
  // let count = 10 + random(10)
  let count = 10
  for (let i = 0; i < count; i++) {
    randXs = [...randXs, random(width)]
    randYs = [...randYs, 100 + random(height - 100)]
  }
  // if 1 is pressed, 10 to 20 random rockets are launched
  if (key == '2') {
    // if 2 is pressed, launch from right to left
    randXs.sort((a, b) => a < b)
  } else if (key == '3') {
    // if 3 is pressed, launch from left to right
    randXs.sort((a, b) => a >= b)
  }
  let new_rocket
  // let last_tick = millis()
  // let i = 0;
  // while(i < count) {
  //   if (millis() - last_tick > 10) {
  //     new_rocket = new Rocket(randXs[i], randYs[i], 5, 100)
  //     rockets = [...rockets, new_rocket]
  //     last_tick = millis()
  //     i += 1
  //   }
  // }
  console.log('hi');
  for (let i = 0; i < count; i++) {
    new_rocket = new Rocket(randXs[i], randYs[i], 5, 100)
    rockets = [...rockets, new_rocket]
    // setTimeout(() => {
    //   rockets = [...rockets, new_rocket]
    // }, 100 * i)
    // update_all()
    // for(let j = 0; j < rockets.length; j++) {
    //   if (rockets[j].isRunning()) {
    //     rockets[j].move();
    //     rockets[j].display();
    //   } else if (!rockets[j].isBlown()) {
    //     rockets[j].blowUp();
    //   }
    // }
    if (i % 3 == 0) {
      for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].show();
      }
    }
  }
}

class Rocket {
  constructor(x, y, ySpeed, launchRange) {
    this.e = null;
    this.el = null;
    this.baseX = x;
    this.x = x;
    this.y = y;
    this.ySpeed = ySpeed;
    this.launchRange = launchRange;
    this.state = 0; // 0: not initialized, 1: launched, 2: stopped, 3: blown
    createImg(p, `test${x}`, 'anonymous', img => {this.e = img; this.state = 1})
    createImg(f, `fire${x}`, 'anonymous', img => {this.el = img; this.el.size(64, 64); this.el.hide()})
  }

  isRunning() {
    return this.state == 1
  }

  isBlown() {
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
    this.state = 3
    this.e.remove()
    this.el.position(this.x, this.y);
    this.el.show();
    push()
    translate(this.x, this.y)
    fill(255, 255, 0)
    rect(0, 0, 65, 65)
    pop()
    setTimeout(() => {
      this.el.remove()
      push()
      translate(this.x, this.y)
      fill(0)
      rect(0, 0, 65, 65)
      pop()
    }, 1000)
  }
}

// throw rockets and blow
// speed, height, explosion range is variable
// sound of explosion
// throw rocket on click
// throw higher if button is held down
// keyboard event handler
// random numbers
// rockets move vertically and horizontally

// https://genekogan.com/code/p5js-transformations/
// https://blog.logrocket.com/creating-animations-p5-js/
// https://editor.p5js.org/dirkk0/sketches/q4Y5HzOYC
// https://p5js.org/reference/#/p5/translate
// https://p5js.org/reference/#/p5/image
// https://p5js.org/examples/

// class based animation
// https://codepen.io/sharur7/project/editor/ZWrNEw
