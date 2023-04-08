let p = "assets/rocket.png";
let f = "assets/firework.gif";
let pieces_count = 10;
let rocket_width = 64;
let chance = 0.01;

let sounds = [];
let rockets = [];
let pieces = [];

function preload() {
  for (let i = 0; i < 5; i++) {
    sounds[i] = loadSound(`assets/fizz_${i}.mp3`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);
  // updates animation frames by using an html
  // img element, positioning it over top of
  // the canvas.
  update_all();

  if (random() < chance) launch_random_rocket();
}

function launch_random_rocket() {
  let rand_x = 50 + Math.floor(random(windowWidth - 100))
  let rand_r = 200 + Math.floor(random(windowHeight - 250))
  let new_rocket = new Rocket(rand_x - rocket_width / 2, windowHeight - 50, 5, rand_r);
  rockets = [...rockets, new_rocket];
}

function update_all() {
  for (let i = 0; i < rockets.length; i++) {
    if (!rockets[i].isReady()) continue;
    if (rockets[i].isRunning()) {
      rockets[i].move();
      rockets[i].display();
    } else if (rockets[i].isStopped()) {
      rockets[i].blowUp();
    } else if (rockets[i].isBlownUp()) {
      rockets.splice(i, 1);
    }
  }

  for (let i = 0; i < pieces.length; i++) {
    if (!pieces[i].isReady()) continue;
    if (pieces[i].isRunning()) {
      pieces[i].move();
      pieces[i].display();
    } else if (pieces[i].isDone()) {
      pieces[i].cleanUp();
      pieces.splice(i, 1);
    }
  }
}

let start, end;
function mousePressed() {
  start = millis();
}

function mouseReleased() {
  end = millis();
  dif = min(end - start, 3000);
  let range = map(dif, 0, 3000, 100, height); 
  let new_rocket = new Rocket(mouseX - rocket_width / 2, mouseY - rocket_width / 2, 5, range);
  rockets = [...rockets, new_rocket];
}

function batchLaunch(i, x_arr, y_arr) {
  if (i >= x_arr.length) return;
  new_rocket = new Rocket(x_arr[i], y_arr[i], 5, 500); 
  rockets = [...rockets, new_rocket];
  setTimeout(() => {
    batchLaunch(i + 1, x_arr, y_arr);
  }, 100);
}

function keyPressed() {
  if (key != "1" && key != "2" && key != "3") return;
  let randXs = [];
  let randYs = [];
  let count = 10 + random(10);

  for (let i = 0; i < count; i++) {
    randXs = [...randXs, random(width)];
    randYs = [...randYs, height - 50 - random(100)]; 
  }
  // if 1 is pressed, 10 to 20 random rockets are launched
  if (key == "2") {
    // if 2 is pressed, launch from right to left
    randXs.sort((a, b) => a - b);
  } else if (key == "3") {
    // if 3 is pressed, launch from left to right
    randXs.sort((a, b) => b - a);
  }

  batchLaunch(0, randXs, randYs);
}

function checkExistance(arr, el) {
  return arr.some((arrEl) => (arrEl[0] === el[0] && arrEl[1] === el[1]));
}

function preparePieces() {
  let count = 3 + Math.floor(random(pieces_count - 3));
  let ids = [];
  let vs = [];
  let i = 0;
  while (i < count) {
    let id = Math.floor(random(pieces_count));
    while (ids.includes(id)) {
      id = Math.floor(random(pieces_count));
    }
    ids.push(id);
    let vx, vy;
    vx = Math.floor(random(7)) - 3;
    vy = Math.floor(random(7)) - 3;
    while (checkExistance(vs, [vx, vy])) {
      vx = Math.floor(random(7)) - 3;
      vy = Math.floor(random(7)) - 3;
    }
    vs.push([vx, vy])
    i++
  }
  return [ids, vs];
}

class Rocket {
  constructor(x, y, ySpeed, launchRange) {
    this.e = null;
    this.trace = [];
    this.maxTraceLength = 30;
    this.baseX = x;
    this.x = x;
    this.y = y;
    this.ySpeed = ySpeed;
    this.launchRange = launchRange;
    this.state = 0; // 0: not initialized, 1: launched, 2: stopped, 3: blown
    createImg(p, `test${x}`, "anonymous", (img) => {
      this.e = img;
      this.state = 1;
    });
  }

  isReady() {
    return this.state != 0;
  }

  isRunning() {
    return this.state == 1;
  }

  isStopped() {
    return this.state == 2;
  }

  isBlownUp() {
    return this.state == 3;
  }

  move() { 
    if (this.y >= 0 && this.y < height && this.launchRange > 0) {
      this.trace.push([this.x + rocket_width / 2, this.y + rocket_width / 2])
      if (this.trace.length > this.maxTraceLength) this.trace = this.trace.slice(1);
      this.y -= this.ySpeed;
      this.launchRange -= this.ySpeed;
      this.x = this.baseX + 4 * sin(this.y / 20);
    } else {
      this.state = 2;
    }
  }

  display() {
    this.e.position(this.x, this.y);
    strokeWeight(2);

    for (let i = 0; i < this.trace.length; i++) {
      let [x, y] = this.trace[i]
      let alpha = map(i, 0, this.trace.length, 15, 255)
      stroke(255, 0, 0, alpha)
      point(x, y);
    }
  }

  blowUp() {
    this.state = 3;
    this.e.remove();

    // play sound
    let track = Math.floor(random(sounds.length));
    sounds[track].play();

    // create pieces
    let name, new_piece;
    let [ids, vs] = preparePieces();
    for (let i = 0; i < ids.length; i++){
      name = `./assets/pieces/p${ids[i]}.png`;
      new_piece = new Piece(name, this.x, this.y, vs[i][0], vs[i][1]);
      pieces.push(new_piece)
    }

    // push();
    // translate(this.x, this.y);
    // fill(255, 255, 0);
    // rect(0, 0, 65, 65);
    // pop();
    // setTimeout(() => {
    //   push();
    //   translate(this.x, this.y);
    //   fill(0);
    //   rect(0, 0, 65, 65);
    //   pop();
    // }, 1000);
  }
}

class Piece {
  constructor(path, x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ay = -0.1;
    this.ttl = 50;
    this.state = 0;
    this.piece = null;
    createImg(path, `piece${x}`, "anonymous", (img) => {
      this.piece = img;
      this.state = 1;
    });
  }

  isReady() {
    return this.state != 0;
  }

  isRunning() {
    return this.state == 1;
  }

  isDone() {
    return this.state == 2;
  }

  move() {
    if (
      this.y >= 0 &&
      this.y < height &&
      this.x >= 0 &&
      this.x < width &&
      this.ttl > 0
    ) {
      this.y -= this.vy;
      this.x += this.vx;
      this.vy += this.ay;
      this.ttl -= 1;
    } else {
      this.state = 2;
    }
  }

  display() {
    let op = map(this.ttl, 0, 50, 0, 1);
    push();
    this.piece.style("opacity", `${op}`);
    this.piece.position(this.x, this.y);
    pop();
  }

  cleanUp() {
    this.piece.remove();
  }
}
