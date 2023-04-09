## Classes

<dl>
<dt><a href="#Rocket">Rocket</a></dt>
<dd><p>Rocket class :D</p>
</dd>
<dt><a href="#Piece">Piece</a></dt>  
<dd><p>Piece class :P</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#preload">preload()</a></dt>
<dd><p>before execution of the code, this function loads the sound files.</p>
</dd>
<dt><a href="#setup">setup()</a></dt>
<dd><p>this function executes at the start of program and creates the black background.</p>
</dd>
<dt><a href="#windowResized">windowResized()</a></dt>
<dd><p>this function makes sure the black background is fit to the window screen.</p>
</dd>
<dt><a href="#draw">draw()</a></dt>
<dd><p>this function executes every frame. clears the screen. then, draws
all the rockets and pieces and then, launches a random rocket if needed.</p>
</dd>
<dt><a href="#launch_random_rocket">launch_random_rocket()</a></dt>
<dd><p>launch a rocket from a random x with a random height and a random velocity.</p>
</dd>
<dt><a href="#update_all">update_all()</a></dt>
<dd><p>loop through all rockets and pieces and act upon what situation they are in.
if they are not initialized yet, don&#39;t do anything. else move and display them if they should still move.
for the rockets, if they reached their final destination, blow them up and if they are already blown up,
just remove them from the array of rockets.
for the pieces, if they are done moving, we just remove their objects from screen and pieces array.</p>
</dd>
<dt><a href="#mousePressed">mousePressed()</a></dt>
<dd><p>set the start time of a mouse click.</p>
</dd>
<dt><a href="#mouseReleased">mouseReleased()</a></dt>
<dd><p>set the end time of a mouse click and then, launch a rocket from the mouse released position with a random velocity
and a height proportional to the amount of time user kept pressing the mouse button. maximum time is 3 seconds.</p>
</dd>
<dt><a href="#batchLaunch">batchLaunch(i, x_arr, y_arr)</a> ⇒</dt>
<dd><p>this method launches a batch of rockets with a delay between every launch. It calls itself recursively in a setTimeout
to induce a sense of ordering in the launched rockets.</p>
</dd>
<dt><a href="#keyPressed">keyPressed()</a> ⇒</dt>
<dd><p>on every keyboard key event, it checks if we pressed 1, 2 or 3. selects a random number of rockets to be launched.
then, creates the random starting points. if we press 2, we sort the X&#39;s array in an ascending order and if we press 3,
we sort it in a descending order. after that, we launch the specified number of rockets using the batchLaunch method.</p>
</dd>
<dt><a href="#checkExistance">checkExistance(arr, el)</a> ⇒</dt>
<dd><p>returns true if the element exist in the array and false otherwise.</p>
</dd>
<dt><a href="#preparePieces">preparePieces()</a> ⇒</dt>
<dd><p>specify a random number of pieces to be thrown after a rocket blows up. and then,
selects them randomly among the available piece images. and also selects their constant time
velocities in x and y direction. it is done in a fasion that no id or pair of velocities are duplicate.</p>
</dd>
<dt><a href="#randomRGB">randomRGB()</a> ⇒</dt>
<dd><p>create an array that contains random r, g and b values and represents a random color.</p>
</dd>
</dl>

<a name="Rocket"></a>

## Rocket
Rocket class :D

**Kind**: global class

* [Rocket](#Rocket)
    * [new Rocket(x, y, ySpeed, launchRange)](#new_Rocket_new)
    * [.isReady()](#Rocket+isReady) ⇒
    * [.isRunning()](#Rocket+isRunning) ⇒
    * [.isStopped()](#Rocket+isStopped) ⇒
    * [.isBlownUp()](#Rocket+isBlownUp) ⇒
    * [.move()](#Rocket+move)
    * [.display()](#Rocket+display)
    * [.blowUp()](#Rocket+blowUp)

<a name="new_Rocket_new"></a>

### new Rocket(x, y, ySpeed, launchRange)
initialize the rocket


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | starting point's x |
| y | <code>number</code> | starting point's y |
| ySpeed | <code>number</code> | speed of the rocket |
| launchRange | <code>number</code> | final height of the rocket |

<a name="Rocket+isReady"></a>

### rocket.isReady() ⇒
return false if the object is not ready to be used and true otherwise.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
**Returns**: false if the object is not ready to be used and true otherwise.
<a name="Rocket+isRunning"></a>

### rocket.isRunning() ⇒
return true if the object is in the launched state.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
**Returns**: true if the object is in the launched state.
<a name="Rocket+isStopped"></a>

### rocket.isStopped() ⇒
return true if the object is in the stopped state.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
**Returns**: true if the object is in the stopped state.
<a name="Rocket+isBlownUp"></a>

### rocket.isBlownUp() ⇒
return true if the object is the blown up state.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
**Returns**: true if the object is the blown up state.
<a name="Rocket+move"></a>

### rocket.move()
check if the rocket is in the screen and has not yet reached it's final height.
if the condition is true, adds the current position to the traces and moves one more step.
if the condition is false, we change the state to stopped state.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
<a name="Rocket+display"></a>

### rocket.display()
first we display the rocket itself and then, display the trace. the more recent traces are stronger than the older ones.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
<a name="Rocket+blowUp"></a>

### rocket.blowUp()
in this method we remove the rocket object, play the firework sound and create the rockets pieces after explosion.

**Kind**: instance method of [<code>Rocket</code>](#Rocket)
<a name="Piece"></a>

## Piece
Piece class :P

**Kind**: global class

* [Piece](#Piece)
    * [new Piece(path, x, y, vx, vy, rgb, ttl)](#new_Piece_new)
    * [.isReady()](#Piece+isReady) ⇒
    * [.isRunning()](#Piece+isRunning) ⇒
    * [.isDone()](#Piece+isDone) ⇒
    * [.move()](#Piece+move)
    * [.display()](#Piece+display)
    * [.cleanUp()](#Piece+cleanUp)

<a name="new_Piece_new"></a>

### new Piece(path, x, y, vx, vy, rgb, ttl)
initialize the piece


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to image of the piece |
| x | <code>number</code> | starting point's x |
| y | <code>number</code> | starting point's y |
| vx | <code>number</code> | velocity in x direction |
| vy | <code>number</code> | velocity in y direction |
| rgb | <code>Array.&lt;number&gt;</code> | color of the trace |
| ttl | <code>number</code> | piece's time to live/range of explosion |

<a name="Piece+isReady"></a>

### piece.isReady() ⇒
return false if the object is not ready to be used and true otherwise.

**Kind**: instance method of [<code>Piece</code>](#Piece)
**Returns**: false if the object is not ready to be used and true otherwise.
<a name="Piece+isRunning"></a>

### piece.isRunning() ⇒
return true if the object is in the moving state.

**Kind**: instance method of [<code>Piece</code>](#Piece)
**Returns**: true if the object is in the moving state.
<a name="Piece+isDone"></a>

### piece.isDone() ⇒
return true if the object is in the stopped state.

**Kind**: instance method of [<code>Piece</code>](#Piece)
**Returns**: true if the object is in the stopped state.
<a name="Piece+move"></a>

### piece.move()
check if the piece is in the screen and has more time to live.
if the condition is true, adds the current position to the traces and moves one more step.
if the condition is false, we change the state to stopped state.

**Kind**: instance method of [<code>Piece</code>](#Piece)
<a name="Piece+display"></a>

### piece.display()
first we display the piece with opacity proportional to it's ttl and then, display the trace.
the more recent traces are stronger than the older ones.

**Kind**: instance method of [<code>Piece</code>](#Piece)
<a name="Piece+cleanUp"></a>

### piece.cleanUp()
this function removes the image element of the piece.

**Kind**: instance method of [<code>Piece</code>](#Piece)
<a name="preload"></a>

## preload()
before execution of the code, this function loads the sound files.

**Kind**: global function
<a name="setup"></a>

## setup()
this function executes at the start of program and creates the black background.

**Kind**: global function
<a name="windowResized"></a>

## windowResized()
this function makes sure the black background is fit to the window screen.

**Kind**: global function
<a name="draw"></a>

## draw()
this function executes every frame. clears the screen. then, draws
all the rockets and pieces and then, launches a random rocket if needed.

**Kind**: global function
<a name="launch_random_rocket"></a>

## launch\_random\_rocket()
launch a rocket from a random x with a random height and a random velocity.

**Kind**: global function
<a name="update_all"></a>

## update\_all()
loop through all rockets and pieces and act upon what situation they are in.
if they are not initialized yet, don't do anything. else move and display them if they should still move.
for the rockets, if they reached their final destination, blow them up and if they are already blown up,
just remove them from the array of rockets.
for the pieces, if they are done moving, we just remove their objects from screen and pieces array.

**Kind**: global function
<a name="mousePressed"></a>

## mousePressed()
set the start time of a mouse click.

**Kind**: global function
<a name="mouseReleased"></a>

## mouseReleased()
set the end time of a mouse click and then, launch a rocket from the mouse released position with a random velocity
and a height proportional to the amount of time user kept pressing the mouse button. maximum time is 3 seconds.

**Kind**: global function
<a name="batchLaunch"></a>

## batchLaunch(i, x_arr, y_arr) ⇒
this method launches a batch of rockets with a delay between every launch. It calls itself recursively in a setTimeout
to induce a sense of ordering in the launched rockets.

**Kind**: global function
**Returns**: nothing.

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | rocket that is being launched in this batch. |
| x_arr | <code>Array.&lt;number&gt;</code> | array of Xs of launching points of the rockets in this batch. |
| y_arr | <code>Array.&lt;number&gt;</code> | array of Ys of launching points of the rockets in this batch. |

<a name="keyPressed"></a>

## keyPressed() ⇒
on every keyboard key event, it checks if we pressed 1, 2 or 3. selects a random number of rockets to be launched.
then, creates the random starting points. if we press 2, we sort the X's array in an ascending order and if we press 3,
we sort it in a descending order. after that, we launch the specified number of rockets using the batchLaunch method.

**Kind**: global function
**Returns**: nothing
<a name="checkExistance"></a>

## checkExistance(arr, el) ⇒
returns true if the element exist in the array and false otherwise.

**Kind**: global function
**Returns**: true if the element exist in the array and false otherwise.

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;object&gt;</code> | array to look into. |
| el | <code>object</code> | element we want to find in the array. |

<a name="preparePieces"></a>

## preparePieces() ⇒
specify a random number of pieces to be thrown after a rocket blows up. and then,
selects them randomly among the available piece images. and also selects their constant time
velocities in x and y direction. it is done in a fasion that no id or pair of velocities are duplicate.

**Kind**: global function
**Returns**: an array containing the array of piece IDs and the array of velocities.
<a name="randomRGB"></a>

## randomRGB() ⇒
create an array that contains random r, g and b values and represents a random color.

**Kind**: global function
**Returns**: an array that contains random r, g and b values and represents a random color.

---
## Note:
this awsome markdown is created with [`jsdoc2md`](https://github.com/jsdoc2md/jsdoc-to-markdown).