/**
v.08
1. implement gameOver feature.
2.
3.
4.
5.
6.
7.
8.
9.
**/
/*----------------------------------------/
///////////////Variables//////////////////
/--------------------------------------*/

		//----General vars ------///
				var amountBaloons = 20;
				var baloonsRemaining = amountBaloons; //Add counter
				var startTime = Date.now(); //get the game start time
				currentTime = startTime;
				var keysDown = {};// Handle keyboard controls
				isGameOver = false;
		// -------------------------//

		//-----Create the canvas---///
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = 512;
				canvas.height = 480;
				canvas.style.cursor="none";
				document.body.appendChild(canvas);
		// -------------------------//

		//------Background image------//
				var bgReady = false;
				var bgImage = new Image();
				bgImage.onload = function () { bgReady = true; };
				bgImage.src = "images/sky-background.png";
		// -------------------------//



/*--------------------------------/
///////////Game objects////////////
/-------------------------------*/
	/*
	var snd = new Audio("images/sound_removeCluster.mp3"); // buffers automatically when created
                snd.play();
								*/

		//------reticle------------//
				var reticle = {
					speed: 256,  /*movement in pixels per second*/
					width:64, //object width
					height:64,//object height
					x: 0, // x coordinate
					y: 0, // y coordinate
					centerX: function(){
						return this.x + this.width/2;
					},
					centerY: function(){
						return this.y + this.height/2;
					},
					isFired: false,
					isImageReady: false,
					isSoundReady:false,
					image: new Image(),
					shotSound: new Audio()
				};
				reticle.x = canvas.width / 2 - reticle.width/2;
				reticle.y = canvas.height / 2 - reticle.height/2;

				reticle.image.onload = function () {
					reticle.isImageReady = true;
				};


				reticle.image.src = "images/crosshairs/paternus.png";
				reticle.shotSound.src = "sounds/shot.mp3"

		// -------------------------//

		//-------baloon-------------//
				var baloon = {
					x:0,
					y:0,
					width:50,
					height:50,
					xSpeed: 0,
					ySpeed:60,
					xDirection:1,
					isImageReady: false,
					isSoundReady: false,
					image: new Image()
				};
				baloon.image.onload = function () {
					baloon.isImageReady = true;
				};

				baloon.image.src = "images/baloon.png";

		//-----------------------//


/*--------------------------------/
///Functions and Event Listeners///
/-------------------------------*/

		//-------baloon reset-------------//
				var reset = function () {//reset baloon after player pops it
					baloon.x = 32 + (Math.random() * (canvas.width - 64));
					baloon.y = canvas.height+baloon.height; // start below canvas
					baloon.ySpeed = 400 + (Math.random() * 200);
				};
		//-----------------------//


		addEventListener("keydown", function (e) {
			keysDown[e.keyCode] = true;

		}, false);

		addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		}, false);

		function getMousePos(canvas, evt) {//from http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
		        var rect = canvas.getBoundingClientRect();
		        return {
		          x: evt.clientX - rect.left,
		          y: evt.clientY - rect.top
		        };
		      }

		canvas.addEventListener('mousemove', function(evt) {
		        mousePos = getMousePos(canvas, evt);
						reticle.x = mousePos.x - reticle.width/2;
						reticle.y = mousePos.y - reticle.height/2;
		      }, false);

		canvas.addEventListener("click", function(e){

			reticle.isFired = true;
		}, false);


/*--------------------------------/
///        Game Engine         ///
/-------------------------------*/
		// Update game objects
		var update = function (modifier)
		{
			//update time
			if (!isGameOver)currentTime = (Date.now() - startTime)/1000;

			//change baloon speed and direction
			if(baloon.ySpeed < 60){
				baloon.ySpeed = 60
			} else {
				baloon.ySpeed /= 1.01;
			}

			baloon.y -= baloon.ySpeed * modifier; //add vertical speed
			if(baloon.xSpeed > -10 && baloon.xSpeed < 10){ // if horizontal speed is between |10|
				baloon.xDirection = Math.random() < 0.5 ? -1 : 1;//get a random direction.. -1 or +1
				baloon.xSpeed = (30 + Math.random()*170) * baloon.xDirection; //get a random speed based on that direction
			} else {
				baloon.xSpeed /= 1.015; // if horizontal speed is not between |10| devide it gradualy until it is
			}
			baloon.x += baloon.xSpeed * modifier;
		  //stop objects from going outside of canvas
		    if (baloon.x < 0) { baloon.x = 0 } //stop from going left

		    if (baloon.x > canvas.width - 32) { baloon.x = canvas.width - 32}//stop from going right

		    if (baloon.y < 50) { baloon.y = 50 } //stop at ceiling - 100

		    //if (baloon.y > canvas.height - 32) { baloon.y = canvas.height - 32 }//I dont want a flor limit


			//if gun is fired
			if(reticle.isFired){

					reticle.shotSound.pause();
					reticle.shotSound.currentTime = 0.0;
					reticle.shotSound.play();


				//check if hit target
				if(
					reticle.centerX() <= baloon.x+baloon.width
					&& reticle.centerX() >= baloon.x
					&& reticle.centerY() <= baloon.y+baloon.height
					&& reticle.centerY() >= baloon.y
				){
					--baloonsRemaining; //decrease baloon counter
					reset();
					if(baloonsRemaining == 0){
						isGameOver = true;
					}

				}
				reticle.isFired = false;
			}

		};

		// Draw everything
		var render = function ()
		{
			if (bgReady) { ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); }

			if (baloon.isImageReady) { ctx.drawImage(baloon.image, baloon.x, baloon.y, baloon.width, baloon.height);}

			if (reticle.isImageReady) { ctx.drawImage(reticle.image, reticle.x, reticle.y, reticle.width, reticle.height);}

			// Score
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("Baloons remaining: " + baloonsRemaining + " --- Time:" + currentTime, 32, 32);

		};

		// Draw everything
		var renderGameOver = function ()
		{
			if (bgReady) { ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); }
			if (reticle.isImageReady) { ctx.drawImage(reticle.image, reticle.x, reticle.y, reticle.width, reticle.height);}

			// Score
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("Great Job! it took you  " + currentTime + " seconds", 32, 32);
			ctx.textAlign = "left";
			ctx.fillText("to pop " + amountBaloons + " baloons!", 140, 64);
		};

		// The main game loop
		var main = function ()
		{
				var now = Date.now();
				var delta = now - then;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				update(delta / 1000);

				if(isGameOver){//check if game is over
					renderGameOver();
				} else {
					render();
				}

				then = now;
		};


		// Let's play this game!
		var then = Date.now();
		reset();
		main();
		setInterval(main, 1); // Execute as fast as possible
