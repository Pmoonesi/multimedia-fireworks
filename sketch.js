let p = "assets/rocket.png"; // path to rocket image.
let pieces_count = 10; // number of different pieces prepared in assets/pieces folder.
let rocket_width = 64; // width of rocket image. could be obtained using rocket.size().width too.
let chance = 0.01; // the chance of a rocket being randomly launched in a frame.

let sounds = []; // array containing 5 different sounds of fireworks
let rockets = []; // array containing rocket objects
let pieces = []; // array containing rocket pieces objects

/**
 * before execution of the code, this function loads the sound files.
 */
function preload() {
  for (let i = 0; i < 5; i++) {
    sounds[i] = loadSound(`assets/fizz_${i}.mp3`);
  }
}

/**
 * this function executes at the start of program and creates the black background.
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

/**
 * this function makes sure the black background is fit to the window screen.
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

/**
 * this function executes every frame. clears the screen. then, draws 
 * all the rockets and pieces and then, launches a random rocket if needed.
 */
function draw() {
  background(0);

  update_all();
  if (random() < chance) launch_random_rocket();
}

/**
 * launch a rocket from a random x with a random height and a random velocity.
 */
function launch_random_rocket() {
  let rand_x = 50 + Math.floor(random(windowWidth - 100))
  let rand_r = 200 + Math.floor(random(windowHeight - 250))
  let rand_v = 3 + Math.floor(random(4))
  let new_rocket = new Rocket(rand_x - rocket_width / 2, windowHeight - 50, rand_v, rand_r);
  rockets = [...rockets, new_rocket];
}

/**
 * loop through all rockets and pieces and act upon what situation they are in.
 * if they are not initialized yet, don't do anything. else move and display them if they should still move.
 * for the rockets, if they reached their final destination, blow them up and if they are already blown up,
 * just remove them from the array of rockets.
 * for the pieces, if they are done moving, we just remove their objects from screen and pieces array.
 */
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

let start, end; // time of start and end of a mouse click event in miliseconds.

/**
 * set the start time of a mouse click.
 */
function mousePressed() {
  start = millis();
}

/**
 * set the end time of a mouse click and then, launch a rocket from the mouse released position with a random velocity
 * and a height proportional to the amount of time user kept pressing the mouse button. maximum time is 3 seconds.
 */
function mouseReleased() {
  end = millis();
  dif = min(end - start, 3000);
  let range = map(dif, 0, 3000, 100, height); 
  let rand_v = 3 + Math.floor(random(4))
  let new_rocket = new Rocket(mouseX - rocket_width / 2, mouseY - rocket_width / 2, rand_v, range);
  rockets = [...rockets, new_rocket];
}

/**
 * this method launches a batch of rockets with a delay between every launch. It calls itself recursively in a setTimeout
 * to induce a sense of ordering in the launched rockets.
 * @param {number} i - rocket that is being launched in this batch.
 * @param {number[]} x_arr - array of Xs of launching points of the rockets in this batch.
 * @param {number[]} y_arr - array of Ys of launching points of the rockets in this batch.
 * @returns nothing.
 */
function batchLaunch(i, x_arr, y_arr) {
  if (i >= x_arr.length) return;
  let rand_v = 3 + Math.floor(random(4))
  new_rocket = new Rocket(x_arr[i], y_arr[i], rand_v, 500); 
  rockets = [...rockets, new_rocket];
  setTimeout(() => {
    batchLaunch(i + 1, x_arr, y_arr);
  }, 100);
}

/**
 * on every keyboard key event, it checks if we pressed 1, 2 or 3. selects a random number of rockets to be launched.
 * then, creates the random starting points. if we press 2, we sort the X's array in an ascending order and if we press 3,
 * we sort it in a descending order. after that, we launch the specified number of rockets using the batchLaunch method.
 * @returns nothing
 */
function keyPressed() {
  if (key != "1" && key != "2" && key != "3") return;
  let randXs = [];
  let randYs = [];
  let count = 10 + Math.floor(random(10));

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

/**
 * returns true if the element exist in the array and false otherwise.
 * @param {object[]} arr - array to look into. 
 * @param {object} el - element we want to find in the array. 
 * @returns true if the element exist in the array and false otherwise.
 */
function checkExistance(arr, el) {
  return arr.some((arrEl) => (arrEl[0] === el[0] && arrEl[1] === el[1]));
}

/**
 * specify a random number of pieces to be thrown after a rocket blows up. and then,
 * selects them randomly among the available piece images. and also selects their constant time 
 * velocities in x and y direction. it is done in a fasion that no id or pair of velocities are duplicate.
 * @returns an array containing the array of piece IDs and the array of velocities.
 */
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

/**
 * create an array that contains random r, g and b values and represents a random color.
 * @returns an array that contains random r, g and b values and represents a random color.
 */
function randomRGB() {
  return [Math.floor(random(256)), Math.floor(random(256)), Math.floor(random(256))]
}

/**
 * Rocket class :D
 */
class Rocket {
  /**
   * initialize the rocket
   * @param {number} x - starting point's x
   * @param {number} y - starting point's y
   * @param {number} ySpeed - speed of the rocket 
   * @param {number} launchRange - final height of the rocket
   */
  constructor(x, y, ySpeed, launchRange) {
    this.e = null; // the rocket element/object
    this.trace = []; // array of the rocket's trace points
    this.maxTraceLength = 20; // length of the trace
    this.rgb = randomRGB(); // color of the trace
    this.explosionRange = 30 + Math.floor(random(30)) // number of frames a piece is displayed after rocket is blown up, it is the same as explosion range.
    this.baseX = x; // launching point's x
    this.x = x; // current x of the rocket
    this.y = y; // current y of the rocket
    this.ySpeed = ySpeed; // speed of the rocket
    this.launchRange = launchRange; // final height of the rocket
    this.state = 0; // 0: not initialized, 1: launched, 2: stopped, 3: blown up
    // set the image object when it is loaded and set the state as launched (1).
    createImg(p, `test${x}`, "anonymous", (img) => {
      this.e = img;
      this.state = 1;
    });
  }

  /**
   * return false if the object is not ready to be used and true otherwise.
   * @returns false if the object is not ready to be used and true otherwise.
   */
  isReady() {
    return this.state != 0;
  }

  /**
   * return true if the object is in the launched state.
   * @returns true if the object is in the launched state.
   */
  isRunning() {
    return this.state == 1;
  }

  /**
   * return true if the object is in the stopped state.
   * @returns true if the object is in the stopped state.
   */
  isStopped() {
    return this.state == 2;
  }

  /**
   * return true if the object is the blown up state.
   * @returns true if the object is the blown up state.
   */
  isBlownUp() {
    return this.state == 3;
  }

  /**
   * check if the rocket is in the screen and has not yet reached it's final height.
   * if the condition is true, adds the current position to the traces and moves one more step.
   * if the condition is false, we change the state to stopped state.
   */
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

  /**
   * first we display the rocket itself and then, display the trace. the more recent traces are stronger than the older ones.
   */
  display() {
    this.e.position(this.x, this.y);

    strokeWeight(2);
    let [r, g, b] = this.rgb;
    for (let i = 0; i < this.trace.length; i++) {
      let [x, y] = this.trace[i]
      let alpha = map(i, 0, this.trace.length, 15, 255)
      stroke(r, g, b, alpha)
      point(x, y);
    }
  }

  /**
   * in this method we remove the rocket object, play the firework sound and create the rockets pieces after explosion.
   */
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
      new_piece = new Piece(name, this.x, this.y, vs[i][0], vs[i][1], this.rgb, this.explosionRange);
      pieces.push(new_piece)
    }
  }
}

/**
 * Piece class :P
 */
class Piece {
  /**
   * initialize the piece
   * @param {string} path - path to image of the piece
   * @param {number} x - starting point's x
   * @param {number} y - starting point's y 
   * @param {number} vx - velocity in x direction 
   * @param {number} vy - velocity in y direction 
   * @param {number[]} rgb - color of the trace 
   * @param {number} ttl - piece's time to live/range of explosion 
   */
  constructor(path, x, y, vx, vy, rgb, ttl) {
    this.x = x; // current x of the piece
    this.y = y; // current y of the piece
    this.vx = vx; // velocity in x direction
    this.vy = vy; // velocity in y direction
    this.ay = -0.1; // acceleration in y direction
    this.ttl = ttl; // remaining time to live
    this.state = 0; // 0: not initialized, 1: moving, 2: stopped
    this.piece = null; // image object of the piece
    this.height = 16; // initial value of the height of the image
    this.width = 16; // initial value of the width of the image
    this.trace = []; // array of piece's traces
    this.maxTraceLength = 30; // length of the trace
    this.rgb = rgb; // the color of the trace
    // set the image object when it is loaded and then set the width and height of the image and also set the state to moving
    createImg(path, `piece${x}`, "anonymous", (img) => {
      this.piece = img;
      let size = this.piece.size();
      this.width = size.width;
      this.height = size.height;
      this.state = 1;
    });
  }

  /**
   * return false if the object is not ready to be used and true otherwise.
   * @returns false if the object is not ready to be used and true otherwise.
   */
  isReady() {
    return this.state != 0;
  }

  /**
   * return true if the object is in the moving state.
   * @returns true if the object is in the moving state.
   */
  isRunning() {
    return this.state == 1;
  }

  /**
   * return true if the object is in the stopped state.
   * @returns true if the object is in the stopped state.
   */
  isDone() {
    return this.state == 2;
  }

  /**
   * check if the piece is in the screen and has more time to live.
   * if the condition is true, adds the current position to the traces and moves one more step.
   * if the condition is false, we change the state to stopped state.
   */
  move() {
    if (
      this.y >= 0 &&
      this.y < height &&
      this.x >= 0 &&
      this.x < width &&
      this.ttl > 0
    ) {
      this.trace.push([this.x + this.width / 2, this.y + this.height / 2])
      if (this.trace.length > this.maxTraceLength) this.trace = this.trace.slice(1);
      this.y -= this.vy;
      this.x += this.vx;
      this.vy += this.ay;
      this.ttl -= 1;
    } else {
      this.state = 2;
    }
  }

  /**
   * first we display the piece with opacity proportional to it's ttl and then, display the trace. 
   * the more recent traces are stronger than the older ones.
   */
  display() {
    let op = map(this.ttl, 0, 50, 0, 1);
    push();
    this.piece.style("opacity", `${op}`);
    this.piece.position(this.x, this.y);
    pop();

    strokeWeight(2);
    let [r, g, b] = this.rgb;
    for (let i = 0; i < this.trace.length; i++) {
      let [x, y] = this.trace[i]
      let alpha = map(i, 0, this.trace.length, 15, 255)
      stroke(r, g, b, alpha)
      point(x, y);
    }
  }

  /**
   * this function removes the image element of the piece.
   */
  cleanUp() {
    this.piece.remove();
  }
}
