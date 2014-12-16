
(function ($) {       
// define variables
isPaused = false;   
soundPlaying = false;	
detectPortrait();
mugCounter = 0;

var canvas, player, score, stop, ticker;
var ground = [], water = [], enemies = [], environment = [], fishAttack = 0;
var platformHeight, platformLength, gapLength;
var canvasCounter = 0;
//setUpCanvas();

		
function setUpCanvas()
{
	canvasCounter++;
	canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');
	
	// platform variables
	
	platformWidth = 32;
	platformBase = canvas.height - platformWidth;  // bottom row of the game
	platformSpacer = 64;
	
}	

var canUseLocalStorage = 'localStorage' in window && window.localStorage !== null;
var playSound;
var showMenu;
var gameIsOver;

// set the sound preference
if (canUseLocalStorage) {
  playSound = (localStorage.getItem('mighty.playSound') === "true")

  if (playSound) {
    $('.sound').addClass('sound-on').removeClass('sound-off');
  }
  else {
    $('.sound').addClass('sound-off').removeClass('sound-on');
  }
}

masterImageData = {};
/**
 * @author Joseph Lenton - PlayMyCode.com
 *
 * @param first An ImageData object from the first image we are colliding with.
 * @param x The x location of 'first'.
 * @param y The y location of 'first'.
 * @param other An ImageData object from the second image involved in the collision check.
 * @param x2 The x location of 'other'.
 * @param y2 The y location of 'other'.
 * @param isCentered True if the locations refer to the centre of 'first' and 'other', false to specify the top left corner.
 */
function isPixelCollision( first, x, y, other, x2, y2, isCentered )
{
    // we need to avoid using floats, as were doing array lookups
    x  = Math.round( x );
    y  = Math.round( y );
    x2 = Math.round( x2 );
    y2 = Math.round( y2 );

    var w  = first.width,
        h  = first.height,
        w2 = other.width,
        h2 = other.height ;

    // deal with the image being centered
    if ( isCentered ) {
        // fast rounding, but positive only
        x  -= ( w/2 + 0.5) << 0
        y  -= ( h/2 + 0.5) << 0
        x2 -= (w2/2 + 0.5) << 0
        y2 -= (h2/2 + 0.5) << 0
    }

    // find the top left and bottom right corners of overlapping area
    var xMin = Math.max( x, x2 ),
        yMin = Math.max( y, y2 ),
        xMax = Math.min( x+w, x2+w2 ),
        yMax = Math.min( y+h, y2+h2 );

    // Sanity collision check, we ensure that the top-left corner is both
    // above and to the left of the bottom-right corner.
    if ( xMin >= xMax || yMin >= yMax ) {
        return false;
    }

    var xDiff = xMax - xMin,
        yDiff = yMax - yMin;

    // get the pixels out from the images
    var pixels  = first.data,
        pixels2 = other.data;

    // if the area is really small,
    // then just perform a normal image collision check
    if ( xDiff < 4 && yDiff < 4 ) {
        for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
            for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
                if (
                        ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                        ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                ) {
                    return true;
                }
            }
        }
    } else {
        /* What is this doing?
         * It is iterating over the overlapping area,
         * across the x then y the,
         * checking if the pixels are on top of this.
         *
         * What is special is that it increments by incX or incY,
         * allowing it to quickly jump across the image in large increments
         * rather then slowly going pixel by pixel.
         *
         * This makes it more likely to find a colliding pixel early.
         */

        // Work out the increments,
        // it's a third, but ensure we don't get a tiny
        // slither of an area for the last iteration (using fast ceil).
        var incX = xDiff / 3.0,
            incY = yDiff / 3.0;
        incX = (~~incX === incX) ? incX : (incX+1 | 0);
        incY = (~~incY === incY) ? incY : (incY+1 | 0);

        for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
            for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
                for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
                    for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
                        if (
                                ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                                ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                        ) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}
 
 
 
 
/**
 * Get a random number between range
 * @param {integer}
 * @param {integer}
 */
function rand(low, high) {
  return Math.floor( Math.random() * (high - low + 1) + low );
}

/**
 * Bound a number between range
 * @param {integer} num - Number to bound
 * @param {integer}
 * @param {integer}
 */
function bound(num, low, high) {
  return Math.max( Math.min(num, high), low);
}

/**
 * Asset pre-loader object. Loads all images
 */
var assetLoader = (function() {
  // images dictionary
      this.imgs        = {
    'bg'            : 'imgs/bg.png',
    'sky'           : 'imgs/sky.png',
    'backdrop'      : 'imgs/backdrop.png',
    'backdrop2'     : 'imgs/backdrop_ground.png',
    'grass'         : 'imgs/grass.png',
    'avatar_normal' : 'imgs/normal_walk.png',
    'water'         : 'imgs/water.png',
    'grass1'        : 'imgs/grassMid1.png',
    'grass2'        : 'imgs/grassMid2.png',
    'bridge'        : 'imgs/bridge.png',
    'plant'         : 'imgs/plant.png',
    'bush1'         : 'imgs/bush1.png',
    'bush2'         : 'imgs/bush2.png',
    'cliff'         : 'imgs/grassCliffRight.png',
    'spikes'        : 'imgs/spikes.png',
    'box'           : 'imgs/boxCoin.png',
    'cafMug'        : 'imgs/CafMug.png',
    'fish'       : 'imgs/fish.png',
    'squirrel'      : 'imgs/squirrel.png',
    'pause'         : 'imgs/pause.png',
    'play'          : 'imgs/play.png'
  };

  // sounds dictionary
  this.sounds      = {
    'bg'            : 'sounds/stolaf.mp3',
    'jump'          : 'sounds/jump.mp3',
    'gameOver'      : 'sounds/gameOver.mp3',
    'cafMug'          : 'sounds/cafMugCollected.wav'
  };

  var assetsLoaded = 0;                                // how many assets have been loaded
  var numImgs      = Object.keys(this.imgs).length;    // total number of image assets
  var numSounds    = Object.keys(this.sounds).length;  // total number of sound assets
  this.totalAssest = numImgs;                          // total number of assets

  /**
   * Ensure all assets are loaded before using them
   * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
   * @param {number} name - Asset name in the dictionary
   */
  function assetLoaded(dic, name) {
    // don't count assets that have already loaded
    if (this[dic][name].status !== 'loading') {
      return;
    }

    this[dic][name].status = 'loaded';
    assetsLoaded++;

    // progress callback
    if (typeof this.progress === 'function') {
      this.progress(assetsLoaded, this.totalAssest);
    }

    // finished callback
    if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
      this.finished();
    }
  }

  /**
   * Check the ready state of an Audio file.
   * @param {object} sound - Name of the audio asset that was loaded.
   */
  function _checkAudioState(sound) {
    if (this.sounds[sound].status === 'loading' && this.sounds[sound].readyState === 4) {
      assetLoaded.call(this, 'sounds', sound);
    }
  }

  /**
   * Create assets, set callback for asset loading, set asset source
   */
  this.downloadAll = function() {
    var _this = this;
    var src;

    // load images
    for (var img in this.imgs) {
      if (this.imgs.hasOwnProperty(img)) {
        src = this.imgs[img];

        // create a closure for event binding
        (function(_this, img) {
          _this.imgs[img] = new Image();
          _this.imgs[img].status = 'loading';
          _this.imgs[img].name = img;
          _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
          _this.imgs[img].src = src;
        })(_this, img);
      }
    }

    // load sounds
    for (var sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        src = this.sounds[sound];

        // create a closure for event binding
        (function(_this, sound) {
          _this.sounds[sound] = new Audio();
          _this.sounds[sound].status = 'loading';
          _this.sounds[sound].name = sound;
          _this.sounds[sound].addEventListener('canplay', function() {
            _checkAudioState.call(_this, sound);
          });
          _this.sounds[sound].src = src;
          _this.sounds[sound].preload = 'auto';
          _this.sounds[sound].load();
        })(_this, sound);
      }
    }
  }

  return {
    imgs: this.imgs,
    sounds: this.sounds,
    totalAssest: this.totalAssest,
    downloadAll: this.downloadAll
  };
})();

/**
 * Show asset loading progress
 * @param {integer} progress - Number of assets loaded
 * @param {integer} total - Total number of assets
 */
assetLoader.progress = function(progress, total) {
  var pBar = document.getElementById('progress-bar');
  pBar.value = progress / total;
  document.getElementById('p').innerHTML = Math.round(pBar.value * 100) + "%";
}

/**
 * Load the main menu
 */
assetLoader.finished = function() {
  mainMenu();
}

/**
 * Creates a Spritesheet
 * @param {string} - Path to the image.
 * @param {number} - Width (in px) of each frame.
 * @param {number} - Height (in px) of each frame.
 */
function SpriteSheet(path, frameWidth, frameHeight) {
  this.image = new Image();
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;

  // calculate the number of frames in a row after the image loads
  var self = this;
  this.image.onload = function() {
    self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
  };

  this.image.src = path;
}

function drawPlayPause(type)
{
    ctx.save();
    ctx.translate(1.5,1.5);
    ctx.drawImage(assetLoader.imgs[type],120,(window.innerHeight/50),50,50);
    ctx.restore();  
}
    
    
    
/**
 * Creates an animation from a spritesheet.
 * @param {SpriteSheet} - The spritesheet used to create the animation.
 * @param {number}      - Number of frames to wait for before transitioning the animation.
 * @param {array}       - Range or sequence of frame numbers for the animation.
 * @param {boolean}     - Repeat the animation once completed.
 */
function Animation(spriteType, spritesheet, frameSpeed, startFrame, endFrame) {

  var animationSequence = [];  // array holding the order of the animation
  var currentFrame = 0;        // the current frame to draw
  var counter = 0;             // keep track of frame rate
  this.imageData = 0;
  // start and end range for frames
  for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
    animationSequence.push(frameNumber);

  /**
   * Update the animation
   */
  this.update = function() {

    // update to the next frame if it is time
    if (counter == (frameSpeed - 1))
      currentFrame = (currentFrame + 1) % animationSequence.length;

    // update the counter
    counter = (counter + 1) % frameSpeed;
  };

  /**
   * Draw the current frame
   * @param {integer} x - X position to draw
   * @param {integer} y - Y position to draw
   */
  this.draw = function(x, y) {
    // get the row and col of the frame
    var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

    ctx.drawImage(
      spritesheet.image,
      col * spritesheet.frameWidth, row * spritesheet.frameHeight,
      spritesheet.frameWidth, spritesheet.frameHeight,
      x, y,
      spritesheet.frameWidth, spritesheet.frameHeight);
      if (!masterImageData.hasOwnProperty(spriteType))
      {
          masterImageData[spriteType] = ctx.getImageData(x, y,
      spritesheet.frameWidth, spritesheet.frameHeight);
      }
      this.imageData = masterImageData[spriteType];
  };
    
}

/**
 * Create a parallax background
 */
var background = (function() {
  var sky   = {};
  var backdrop = {};
  var backdrop2 = {};
  var particles = [];
  var self = this;
  var angle = 0;
  var mp = 70; //max particles
	for(var i = 0; i < mp; i++)
	{
		particles.push({
			x: Math.random()*window.innerWidth, //x-coordinate
			y: Math.random()*window.innerHeight, //y-coordinate
			r: Math.random()*8+1, //radius
			d: Math.random()*mp //density
		})
	}
  /**
   * Draw the backgrounds to the screen at different speeds
   */
  //Creating Magical Snow
  this.draw = function() {
    //ctx.drawImage(assetLoader.imgs.bg, 0, 0);
    ctx.fillStyle = "rgb(44, 62, 80)";
    ctx.fillRect(0, window.innerHeight, window.innerWidth, window.innerHeight);
    // Pan background
    sky.x -= sky.speed;
    backdrop.x -= backdrop.speed;
    backdrop2.x -= backdrop2.speed;

    // draw images side by side to loop
    //ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
    //ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);
    

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.beginPath();
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
		}
		ctx.fill();
        self.update();

  };
    
 this.update = function()
	{
		angle += 0.01;
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > window.innerWidth+5 || p.x < -5 || p.y > window.innerHeight)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					particles[i] = {x: Math.random()*window.innerWidth, y: -10, r: p.r, d: p.d};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						particles[i] = {x: -5, y: Math.random()* window.innerHeight, r: p.r, d: p.d};
					}
					else
					{
						//Enter from the right
						particles[i] = {x: window.innerWidth+5, y: Math.random()*window.innerHeight, r: p.r, d: p.d};
					}
				}
			}
		}
	}

  /**
   * Reset background to zero
   */
  this.reset = function()  {
    sky.x = 0;
    sky.y = 0;
    sky.speed = 0.2;

    backdrop.x = 0;
    backdrop.y = 0;
    backdrop.speed = 0.4;

    backdrop2.x = 0;
    backdrop2.y = 0;
    backdrop2.speed = 0.6;
  }

  return {
    draw: this.draw,
    reset: this.reset
  };
})();

/**
 * A vector for 2d space.
 * @param {integer} x - Center x coordinate.
 * @param {integer} y - Center y coordinate.
 * @param {integer} dx - Change in x.
 * @param {integer} dy - Change in y.
 */
function Vector(x, y, dx, dy) {
  // position
  this.x = x || 0;
  this.y = y || 0;
  // direction
  this.dx = dx || 0;
  this.dy = dy || 0;
}

/**
 * Advance the vectors position by dx,dy
 */
Vector.prototype.advance = function() {
  this.x += this.dx;
  this.y += this.dy;
};

/**
 * Get the minimum distance between two vectors
 * @param {Vector}
 * @return minDist
 */
Vector.prototype.minDist = function(vec) {
  var minDist = Infinity;
  var max     = Math.max( Math.abs(this.dx), Math.abs(this.dy),
                          Math.abs(vec.dx ), Math.abs(vec.dy ) );
  var slice   = 1 / max;

  var x, y, distSquared;

  // get the middle of each vector
  var vec1 = {}, vec2 = {};
  vec1.x = this.x + this.width/2;
  vec1.y = this.y + this.height/2;
  vec2.x = vec.x + vec.width/2;
  vec2.y = vec.y + vec.height/2;
  for (var percent = 0; percent < 1; percent += slice) {
    x = (vec1.x + this.dx * percent) - (vec2.x + vec.dx * percent);
    y = (vec1.y + this.dy * percent) - (vec2.y + vec.dy * percent);
    distSquared = x * x + y * y;

    minDist = Math.min(minDist, distSquared);
  }

  return Math.sqrt(minDist);
};

/**
 * The player object
 */
var player = (function(player) {
  // add properties directly to the player imported object
  player.width     = 125;
  player.height    = 100;
  player.speed     = window.innerWidth/10;

  // jumping
  player.gravity   = 1.0;
  player.dy        = 0;
  player.jumpDy    = -10;
  player.isFalling = false;
  player.isJumping = false;

  // spritesheets
  player.sheet     = new SpriteSheet('imgs/LionSpriteLarge.png', player.width, player.height);
  player.walkAnim  = new Animation("walk",player.sheet, 5, 0, 8);
  player.jumpAnim  = new Animation("jump",player.sheet, 7, 2, 4);
  player.fallAnim  = new Animation("fall",player.sheet, 5, 3, 5);
  player.glideAnim  = new Animation("glide",player.sheet, 1, 8, 9);
  player.anim      = player.walkAnim;

  Vector.call(player, 0, 0, 0, player.dy);

  var jumpCounter = 0;  // how long the jump button can be pressed down

  /**
   * Update the player's position and animation
   */
  player.update = function() {

    // jump if not currently jumping or falling
    if ((TOUCHING || KEY_STATUS.space) && player.dy === 0 && !player.isJumping) {
      
      player.isJumping = true;
      player.dy = player.jumpDy;
      jumpCounter = 12;
      assetLoader.sounds.jump.play();
      player.gravity = 1.0;
    }


    // jump higher if the space bar is continually pressed
    if ((TOUCHING || KEY_STATUS.space) && jumpCounter) {
      player.dy = player.jumpDy;
      player.dy -= 3.0;
      player.anim = player.glideAnim;
    }

    jumpCounter = Math.max(jumpCounter-1, 0);

    this.advance();

    // add gravity
    if (player.isFalling || player.isJumping) {
      player.dy += player.gravity;
    }

    // change animation if falling
    if (player.dy > 0) {
      player.anim = player.fallAnim;
    }
    // change animation is jumping
    else if (player.dy < 0) {
      player.anim = player.jumpAnim;
    }
    else {
      player.anim = player.walkAnim;
    }

    player.anim.update();
  };

  /**
   * Draw the player at it's current position
   */
  player.draw = function() {
    player.anim.draw(player.x, player.y);
  };

  /**
   * Reset the player's position
   */
  player.reset = function() {
    player.x = 64;
    player.y = 250;
  };

  return player;
})(Object.create(Vector.prototype));

  

/**
 * Sprites are anything drawn to the screen (ground, enemies, etc.)
 * @param {integer} x - Starting x position of the player
 * @param {integer} y - Starting y position of the player
 * @param {string} type - Type of sprite
 */
function Sprite(x, y, type) {
  this.x      = x;
  this.y      = y;
  this.width  = platformWidth;
  this.height = platformWidth;
  this.type   = type;
  this.imageData = 0;
  Vector.call(this, x, y, 0, 0);

  /**
   * Update the Sprite's position by the player's speed
   */
  this.update = function() {
    this.dx = -player.speed;
    this.advance();
  };

  /**
   * Draw the sprite at it's current position
   */
  this.draw = function() {
    ctx.save();
    ctx.translate(0.5,0.5);
    ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
    if (!masterImageData.hasOwnProperty(this.type))
      {
      masterImageData[this.type] = ctx.getImageData(this.x, this.y,this.width,this.height);
      }
      this.imageData = masterImageData[this.type];
    ctx.restore();
  };
}
Sprite.prototype = Object.create(Vector.prototype);

/**
 * Get the type of a platform based on platform height
 * @return Type of platform
 */
function getType() {
  var type;
  switch (platformHeight) {
    case 0:
    case 1:
      type = Math.random() > 0.5 ? 'grass1' : 'grass2';
      break;
    case 2:
      type = 'grass';
      break;
    case 3:
      type = 'bridge';
      break;
    case 4:
      type = 'box';
      break;
  }
  if (platformLength === 1 && platformHeight < 3 && rand(0, 3) === 0) {
    type = 'cliff';
  }

  return type;
}

/**
 * Update all ground position and draw. Also check for collision against the player.
 */
function updateGround() {
  // animate ground
  player.isFalling = true;
  for (var i = 0; i < ground.length; i++) {
    ground[i].update();
    ground[i].draw();

    // stop the player from falling when landing on a platform
    var angle;
    if (player.minDist(ground[i]) <= player.height/2 + platformWidth/2 &&
        (angle = Math.atan2(player.y - ground[i].y, player.x - ground[i].x) * 180/Math.PI) > -130 &&
        angle < -50) {
      player.isJumping = false;
      player.isFalling = false;
      player.y = ground[i].y - player.height + 7;
      player.dy = 0;
    }
  }

  // remove ground that have gone off screen
  if (ground[0] && ground[0].x < -platformWidth) {
    ground.splice(0, 1);
  }
}

/**
 * Update all water position and draw.
 */
function updateWater() {
  // animate water
  for (var i = 0; i < water.length; i++) {
    water[i].update();
    water[i].draw();
  }

  // remove water that has gone off screen
  if (water[0] && water[0].x < -platformWidth) {
    var w = water.splice(0, 1)[0];
    w.x = water[water.length-1].x + platformWidth;
    water.push(w);
  }
}

/**
 * Update all environment position and draw.
 */
function updateEnvironment() {
  // animate environment

  for (var i = 0; i < environment.length; i++) {
    environment[i].update();
    environment[i].draw();
   
if(environment[i].type=="cafMug"){      if(isPixelCollision(player.anim.imageData,player.x,player.y,environment[i].imageData,environment[i].x,environment[i].y,false))
      {
          environment.splice(i, 1);
          console.log("Mug Collected");
          assetLoader.sounds.cafMug.play();
          mugCounter++;
      }
  }
  
    
  }//End of Environment update for loop

  // remove environment that have gone off screen
  if (environment[0] && environment[0].x < -platformWidth) {
    environment.splice(0, 1);
  }
}

function updateAttackFish()
  {
    var velocity = player.speed*1.8;
    //var angle = (Math.PI/1.5);
    fishAttack.update();
    fishAttack.draw();      
    fishAttack.x += velocity;
    //fishAttack.y += Math.sin(angle) * velocity/12;

  }
  
  
/**
 * Update all enemies position and draw. Also check for collision against the player.
Collision Detection :)
 */
function updateEnemies() {
  // animate enemies

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    
    // Squirrel can move (but not off platform)
  	if (enemies[i].type == "squirrel") {
		enemies[i].x -= 3;
  	}
    
    //Player Collided With Squirrel
      if(isPixelCollision(player.anim.imageData,player.x,player.y,enemies[i].imageData,enemies[i].x,enemies[i].y,false))
      {
          gameOver();
      }
      if(fishAttack != 0){
        if(isPixelCollision(fishAttack.imageData,fishAttack.x,fishAttack.y,enemies[i].imageData,enemies[i].x,enemies[i].y,false))
        { 
          console.log("hit");
          enemies.splice(i, 1);

          enemiesHit++;
          fishAttack = 0;
          cafMugAttack = 0;
        }
      }
    
  }//End of update enemies for loop

  // remove enemies that have gone off screen
  if (enemies[0] && enemies[0].x < -platformWidth) {
    enemies.splice(0, 1);
  }
}

/**
 * Update the players position and draw
 */
function updatePlayer() {
  player.update();
  player.draw();

  // game over
  if (player.y + player.height >= canvas.height) {
    gameOver();
  }
}

/**
 * Spawn new sprites off screen
 */
function spawnSprites() {
  // increase score
  score++;

  // first create a gap
  if (gapLength > 0) {
    gapLength--;
  }
  // then create ground
  else if (platformLength > 0) {
    var type = getType();

    ground.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      platformBase - platformHeight * platformSpacer,
      type
    ));
    platformLength--;

    // add random environment sprites
    spawnEnvironmentSprites();

    // add random enemies
    spawnEnemySprites();
  }
  // start over
  else {
    // increase gap length every speed increase of 4
    gapLength = rand(player.speed - 2, player.speed);
    // only allow a ground to increase by 1
    platformHeight = bound(rand(0, platformHeight + rand(0, 2)), 0, 4);
    platformLength = rand(Math.floor(player.speed/2), player.speed * 4);
  }
}

/**
 * Spawn new environment sprites off screen
 */
function spawnEnvironmentSprites() {
  if (score > 40 && rand(0, 20) === 0 && platformHeight < 3) {
    
    
    if (Math.random() > 0.5) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'plant'
      ));
    }
    else if (Math.random() > 0.1)
    {
        environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth - rand(100,200),
        'cafMug'
      ));
    }
    else if (platformLength > 2) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush1'
      ));
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed + platformWidth,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush2'
      ));
    }
  }
}

/**
 * Spawn new  sprites off screen
 */
function spawnEnemySprites() {
  if (score > 100 && Math.random() > 0.96 && enemies.length < 3 && platformLength > 5 &&
      (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 3 ||
       canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {
    enemies.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      (platformBase - platformHeight * platformSpacer - platformWidth) - 40,
      'squirrel'

    ));
  }
}

/**
 * Game loop
 */
function animate() {
  if (!stop) {
    requestAnimFrame( animate );
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.draw();
    if(!isPaused){drawPlayPause("pause");}
    // update entities
    updateWater();
    updateEnvironment();
     if (fishAttack!=0)
    {
      updateAttackFish();
    }
    updatePlayer();
    updateGround();
    updateEnemies();
    

    // draw the score
    ctx.font      = "bold 28px futura";
    ctx.fillStyle = "#000000";
    ctx.fillText('Time: ' + score + 's', canvas.width-(canvas.width/4.5), canvas.height/11);
    ctx.fillText('Best: '+ highScore + 's',canvas.width/2.7,canvas.height/11);
    ctx.fillText('Mugs: '+ mugCounter,canvas.width/1.6,canvas.height/11);  
    //Draw Play
    
    if ((KEY_STATUS.shift || SWIPING_RIGHT) /*&& mugCounter > 0*/)
    {
    fishAttack = new Sprite(
    player.x + player.width/1.5,
    player.y + player.height/2,'fish'

    );
    //updateAttackFish();
    }
    if(player.speed > 16){ player.speed = window.innerWidth/10.0 };
   

    // spawn a new Sprite
    if (ticker % Math.floor(platformWidth / player.speed) === 0) {
      spawnSprites();

    }

    // increase player speed only when player is jumping
    if (ticker > (Math.floor(platformWidth / player.speed) * player.speed * 20) && player.dy !== 0) {
      player.speed = bound(++player.speed, 0, 15);
      player.walkAnim.frameSpeed = Math.floor(platformWidth / player.speed) - 1;

      // reset ticker
      ticker = 0;

      // spawn a platform to fill in gap created by increasing player speed
      if (gapLength === 0) {
        var type = getType();
        ground.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpacer,
          type
        ));
        platformLength--;
      }
    }
    ticker++;
  }
}

/**
 * Keep track of the spacebar events
 */
var KEY_CODES = {
  32:  'space',
  93:  'command',
  16:  'shift'
};
var KEY_STATUS = {};
for (var code in KEY_CODES) {
  if (KEY_CODES.hasOwnProperty(code)) {
     KEY_STATUS[KEY_CODES[code]] = false;
  }
}
document.onkeydown = function(e) {
  //console.log(e.keyCode);//Utilize to get new keycode
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
  if(KEY_STATUS.space)
  {
      if(gameIsOver)
      {
        $('#game-over').hide();
        startGame();
      }
  }
  if(KEY_STATUS.shift)
  {
    console.log('Shift Pressed');
  }
};
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};
/* Keep Track of Touch Events*/
var TOUCHING = false;
var SWIPING_RIGHT = false;
var myBody = document.body;
  myBody.addEventListener("touchstart", funcTouchStart, false);
  myBody.addEventListener("touchend", funcTouchEnd, false);
  myBody.addEventListener("touchmove", funcTouchMove, false);
  $("body").swipe( {
        //Generic swipe handler for all directions
        swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
        {
        if (phase == 'start'){ 
          //console.log("You swiped " + direction + " " + ++count + " times " ); 
          SWIPING_RIGHT = true;
          }
        else if(phase == 'end'){ SWIPING_RIGHT = false; }
        }
      });

  function funcTouchStart(e) {
      
    var touchlist = e.touches
    for (var i=0; i<touchlist.length; i++){ 
        var touchPoint = touchlist[i];
        //console.log(touchPoint.clientY);
        if(touchPoint.clientX >=111.0 && touchPoint.clientX <=182.0)
        {
            if(touchPoint.clientY >=9.0 && touchPoint.clientY <=66.0)
            { 
                if (stop == false ) {
                pauseActions();
                } 
                // Play: command pressed and we are currently paused
                else if (stop == true && gameIsOver == false ) {
                unpauseActions();
                }
            }
        }
     }

      
      if(gameIsOver)
      {
        $('#game-over').hide();
        startGame();
      }
    //code to do what you want like set variables and check where on screen touch happened
     TOUCHING = true;
    var touches = e.changedTouches; //gets array of touch points, to get position
  }

  function funcTouchEnd(e) {
    //code
    TOUCHING = false;
  }

  function funcTouchMove(e) {
    //code
  }


    
    
/**
 * Request Animation Polyfill
 */
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Show the main menu after loading all assets
 */
function mainMenu() {
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }

  $('#progress').hide();
  $('#main').show();
  $('#menu').addClass('main');
  $('.sound').show();
  $('.gameStatus').show();
}

function showInGameMenu() {
	$('#inGameMenu').show();
	$('#statistics').show();
	$('#inGameButton1').css("background","orange");
	$('#inGameButton2').css("background","#E0E0E0");
	$('#inGameButton3').css("background","#E0E0E0");
}

function hideInGameMenu() {
	$('#inGameMenu').hide();
}

// Stats
$('#inGameButton1').click(function() {
	$('#inGameButton1').css("background","orange");
	$('#inGameButton2').css("background","#E0E0E0");
	$('#inGameButton3').css("background","#E0E0E0");
	
	$('#statistics').show();
	$('#achievements').hide();
	$('#store').hide();

});
// Achievos
$('#inGameButton2').click(function() {
	$('#inGameButton1').css("background","#E0E0E0");
	$('#inGameButton2').css("background","orange");
	$('#inGameButton3').css("background","#E0E0E0");
	
	$('#statistics').hide();
	$('#achievements').show();
	$('#store').hide();
});
// Store
$('#inGameButton3').click(function() {
	$('#inGameButton1').css("background","#E0E0E0");
	$('#inGameButton2').css("background","#E0E0E0");
	$('#inGameButton3').css("background","orange");
	
	$('#statistics').hide();
	$('#achievements').hide();
	$('#store').show();
});

$('#inGameButton4').click(function() {
	unpauseActions();
});

/**
 * Start the game - reset all variables and entities, spawn ground and water.
 */
function startGame() {

  document.getElementById('game-over').style.display = 'none';
  document.getElementById('userGraph').innerHTML = '';

  loadHighScore();  
  loadUserScores();
  loadItemsScore();
  ground = [];
  water = [];
  environment = [];
  fishAttack = 0;
  enemies = [];
  enemiesHit = 0;
  player.reset();
  ticker = 0;
  stop = false;
  gameIsOver = false;
  showMenu = false;
  score = 0;
  platformHeight = 2;
  platformLength = 15;
  gapLength = 0;
  mugCounter =0;
  
  ctx.font = '16px arial, sans-serif';
  

  for (var i = 0; i < 30; i++) {
    ground.push(new Sprite(i * (platformWidth-3), platformBase - platformHeight * platformSpacer, 'grass'));
  }

  for (i = 0; i < canvas.width / 32 + 2; i++) {
    water.push(new Sprite(i * platformWidth, platformBase, 'water'));
  }

  
    
  background.reset();

  animate();

  assetLoader.sounds.gameOver.pause();
  assetLoader.sounds.bg.currentTime = 0;
  assetLoader.sounds.bg.loop = true;
  assetLoader.sounds.bg.play();
}

/**
 * End the game and restart
 */
function gameOver() {
  stop = true;
  gameIsOver = true;
  $('#score').html(score);
  saveScore(score);
  saveItems(mugCounter, enemiesHit);
  $('#game-over').show();
  assetLoader.sounds.bg.pause();
  assetLoader.sounds.gameOver.currentTime = 0;
  assetLoader.sounds.gameOver.play();
}

/**
 * Click handlers for the different menu screens
 */
 // credits
$('.credits').click(function() {
  $('#main').hide();
  $('#credits').show();
  $('#menu').addClass('credits');
});
// back
$('.back').click(function() {
  $('#credits').hide();
  $('#main').show();
  $('#menu').removeClass('credits');
});

//Awesome Test Function to print mouse coordinates
/*$( "body" ).mousemove(function( event ) {
  var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
  var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
  console.log("( event.pageX, event.pageY ) : " + pageCoords );
  console.log( "( event.clientX, event.clientY ) : " + clientCoords );
});*/

// pause for menu
$( window ).keydown( function ( e ){
	// Pause: command pressed and we are not currently paused
    if ( e.keyCode == 91 && stop == false ) {
        pauseActions();
    } 
	// Play: command pressed and we are currently paused
    else if ( e.keyCode == 91 && stop == true && gameIsOver == false ) {
        unpauseActions();
    }
});
    
function pauseActions()
{
        isPaused = true;
        animate();
        drawPlayPause("play");
        showInGameMenu();
    	stop = true;
}
    
function unpauseActions()
{
        isPaused = false;
    	stop = false;
    	hideInGameMenu();
    	animate();    
}
    
$('.sound').click(function() {
  var $this = $(this);
  // sound off
  if ($this.hasClass('sound-on')) {
    $this.removeClass('sound-on').addClass('sound-off');
    playSound = false;
  }
  // sound on
  else {
    $this.removeClass('sound-off').addClass('sound-on');
    playSound = true;
  }

  if (canUseLocalStorage) {
    localStorage.setItem('mighty.playSound', playSound);
  }

  // mute or unmute all sounds
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }
});


function detectPortrait() {
    if (window.innerWidth < window.innerHeight) {
		return true;
    }
	return false;
}

$('.play').click(function() {
  if(!detectPortrait())
  {
	  setUpCanvas();
	  $('#menu').hide();
	  startGame();
	  return;
  }
  alert("Please Rotate Screen to Landsape to Play");
  return;
});
$('.restart').click(function() {
  $('#game-over').hide();
  startGame();
});

assetLoader.downloadAll();
})(jQuery);
