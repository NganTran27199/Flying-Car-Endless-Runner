document.addEventListener('DOMContentLoaded', () => {


//||||||||||||||||||||||||-----(Global) Variables-----|||||||||||||||||||||||||||||||||\\
const grid = document.querySelector(".grid");
const player = document.querySelector(".player");
const menu = document.querySelector(".menu");
const body = document.querySelector('body');
const heading = document.querySelector(".heading");
const insts = document.querySelector(".insts");


// player variables
player.style.backgroundImage = "url(images/flyingCar1.png)";
let playerPosition = 30;
let playerAnimationSpeed = 400;
let ground = playerPosition;
let frame = 1;


//menu variables
let isMenu = true;


//jump variables
let isJumping = false;
let jumpHeight = playerPosition;
let jumpTimeInterval = 10;
let jumpSpeed = 1
let downSpeed = 0.1;
let gravity = 0.94;
jumpHeight += 28;



//gameOver variables
const gameOver = document.querySelector(".gameOver");
let  isGameOver = false;  


//score system
const scoresHTML = document.querySelector(".scores")
const scoreHTML = document.querySelector(".score")
const highScoreHTML = document.querySelector(".highScore")


//score variables
let highScore = localStorage.getItem('highScore');
let score = 0;
let scoreSpeed = 0.1; //speed of score counting




//||||||||||||||||||||||||-----Input-----|||||||||||||||||||||||||||||||||\\

// ON desktop
document.addEventListener("keydown", (e)=>
    {
      //under the condition that the key is space
      if(!isGameOver && e.code === "Space")  
      {
          console.log("Space pressed");
         input();
      }
      
      //else is game is over and space is pressed
      else if (isGameOver && e.code === "Space"){
          // then reload document
          location.reload();
      }
    })

// On mobile
document.addEventListener("touchstart", (e)=>
    {
        if (isGameOver)
        {
            location.reload();
        }
        else
        {
            console.log("Touched");
            input();
        }
        
    })



//||||||||||||||||||||||||-----Menu transition-----|||||||||||||||||||||||||||||||||\\
function menuTransition(){

    console.log("Menu switched off.");

    // hide heading
    heading.style.visibility = "hidden";

    // hide instructions
    insts.style.visibility = "hidden";
}



//||||||||||||||||||||||||-----Main Game Logic-----|||||||||||||||||||||||||||||||||\\
function input(e)
{
    if (isMenu)
    {
        isMenu = false;
        menuTransition();
        playerRun();
        manageObstacles();
        addScore();
        managerBirdObstacle();
        managerCarObstacle();

        console.log("Start");
    }

    if (!isMenu && !isJumping && !isGameOver)
    {
        isJumping = true;
        jump();

    }
}



//||||||||||||||||||||||||-----Player animation-----|||||||||||||||||||||||||||||||||\\

//function for making player run (switching background images)
function playerRun()
{
    setInterval(runningLoop, playerAnimationSpeed);

    function runningLoop()
    {
        console.log("Running");

        //RUN as long as you are not dead

        // if frame 1 = background image 1
        if (frame == 1 && !isJumping && !isGameOver)
        {
            player.style.backgroundImage = "url(images/flyingCar2.png)";
            frame = 2;
        }
        // if frame 2 = background image 2
        else if (frame == 2 && !isJumping && !isGameOver)
        {
            player.style.backgroundImage = "url(images/flyingCar1.png)";
            frame = 1;
        }

        // if you are dead show me that you are
        else if (isGameOver)
        {
            player.style.backgroundImage = "url(images/flyingCarDead.png)";
            
        }
        
    }
}

//||||||||||||||||||||||||-----Jump-----|||||||||||||||||||||||||||||||||\\
function jump()
{
    let timer = setInterval(function()
    {
        //if game over
        if (isGameOver)
        {
            //then stop jumping
            clearInterval(timer);
        }

        console.log("Jumping");

        // -------Player Going Up-------// 

        // Switch background image to jump image
        player.style.backgroundImage = "url(images/flyingCar3.png)";

        //Jump up by moving player position
        //calculate jumping
        jumpSpeed = 1;
        playerPosition += jumpSpeed;
        jumpSpeed = jumpSpeed * gravity;
        if (jumpSpeed <= 0.17) {jumpSpeed = 0.2;}

        //feed new position to CSS
        player.style.bottom = playerPosition + "%";

        // If player reaches the height
        if (playerPosition >= jumpHeight)
            {
                console.log("Reaches TOP no go DOWN");

                clearInterval(timer); // stop jumping up interval

                let downTimer = setInterval(function()
                {
                
                // -------Player Going Down-------//
                //calculate falling down
                playerPosition -= downSpeed;
                downSpeed = downSpeed + (downSpeed * 0.08);

                //feed into CSS
                player.style.bottom = playerPosition + "%";

                // changing background image
                player.style.backgroundImage = "url(images/flyingCarLanding.png)"

                // If player reaches ground variable
                if (playerPosition <= ground)
                    {
                        console.log("Ground reached");
                        clearInterval(downTimer); // stop jumping up interval

                        // reset variables
                        jumpSpeed = 1;
                        downSpeed = 0.3;
                        isJumping = false;
                        playerPosition = ground;
                        player.style.bottom = playerPosition  + '%';
                    }
                }, jumpTimeInterval)
            }
    }, jumpTimeInterval)
}


//||||||||||||||||||||||||||||||||-----Obstacles-----||||||||||||||||||||||||||||||||||||||\\

//|||||||||||||---Obstacle manager---|||||||||||||||||\\
function manageObstacles()
{
    //random;y call obstacles
    randomCall();

}

//Random obstacles call

//variables for a random time
var randomTime;

//function that fills variable randomly
function changeTime()
{
    //take var for random time 
    //fill it with random number
    randomTime = Math.floor(Math.random() * (2000 - 1000) + 1000);
}

// function for random calling
function randomCall()
{
    console.log("Random call at" + randomTime + "milliseconds");
    //generate random number
    changeTime();

    //
    setTimeout(randomCall, randomTime);

    generateObstacles();
}


//|||||||||||||---Obstacle maker---|||||||||||||||||\\
function generateObstacles()
{
        //obstacle variables
            //Speed of moving
            let obstacleSpeed = 0.2;
            //place obstacles
            let obstacleXPosition = 65;

    //make them
        //write a div tag into document
        const obstacle = document.createElement("div");

        //give this div a class
        if (!isGameOver) {obstacle.classList.add("obstacle");}

        //make this div a child of another exi sting HTML el ement
        grid.appendChild(obstacle);

        //position it
        obstacle.style.left = obstacleXPosition + "vw";

        console.log("obstacle");

        //Move it
        let moveObstacle = setInterval( () =>
        {
            if (!isGameOver)
            {
            //take variable of obstacle position 
            // tweek it
            obstacleXPosition -= obstacleSpeed;

            //feed to CSS
            obstacle.style.left = obstacleXPosition + "vw";
            }

            //if obstacles reached certain point (left the stage)
            //then delete
            if (obstacleXPosition <= -20)
            {
                //go into trash
                obstacle.classList.remove('obstacle');
                try{grid.removeChild(obstacle)}
                catch(error){}

                console.log("obstacle delete it");
            }

            //----Obstacle detector-----//
            //if obstacles close to player
            //then die
            if (obstacleXPosition > -17 && obstacleXPosition < -7 && playerPosition < 35)
            {
                console.log("Collision");
                clearInterval(moveObstacle);
                GameOver();
            }

        }, 1);


//||||||||||||||||||||||||||||-----Game over-----|||||||||||||||||||||||||||||||||\\
function GameOver()
{
    gameOver.style.visibility = "visible"; 
    isGameOver = true; 
}

}




//||||||||||||||||||||||||||||-----Score system-----|||||||||||||||||||||||||||||||||\\

//count at a rate function
function addScore()
{
    setInterval(() => {

        //count as long as game is not over
        if (!isGameOver)
        {
            score += 1; // add 1 to score
            //if score get higher than highScore
            if (score > highScore)
            {
                highScore = score;

            }

            //write "score" to HTML
            scoreHTML.innerHTML = score;

            //write high score to HTML 
            highScoreHTML.innerHTML = "High Score: " + highScore;

            // if score value can be devided by 1000 without leaving remainder 
            //= is a clean multiple of 1000 (using remainder operator %)
            if (score%1000 == 0) 
            {
                // make obstacles moving speed faster
                obstacleSpeed += 0.1;
                birdObstacle += 0.1;
                carObstacle += 0.1;

            }
        }
        
        // if game over ... write/update highscore

        if (isGameOver)
        {
            localStorage.setItem("highScore", highScore);
        }
    }, scoreSpeed); //how fast it counts
    
}



//||||||||||||||||||||||||||||-----Bird Obstacle-----|||||||||||||||||||||||||||||||||\\

//|||||||||||---Bird manager---||||||||||||||\\
function managerBirdObstacle()
{
    //randomly call birds
    randomBirdCall();
}

//RANDOM OBSTACLE CALL

//variable for a random time
var randomBirdTime;

// function that fills variable randomly
function changeBirdTime()
{
    //take var for random time 
    //fill it with random number
    randomBirdTime = Math.floor(Math.random() * (10000 - 1000) + 1000);
}

//function for random calling
function randomBirdCall ()
{
    console.log("Ramdom birds call at" + randomBirdTime + "milliseconds");

    // generate random number
    changeBirdTime();

    setTimeout(randomBirdCall, randomBirdTime);

    generateBirdObstacle();
}

//|||||||||||---Bird maker---||||||||||||||\\
function generateBirdObstacle()
{
    //place bird
    let birdObstacleXPosition = 100;

    //speed
    let birdObstacleSpeed = 0.27;  

    //make them
        //write adiv tag into document
        const birdObstacle = document.createElement("div");

        //give this div a class
        if (!isGameOver) {birdObstacle.classList.add('birdObstacle');}

        //make this div a child of another existing HTML element
        grid.appendChild(birdObstacle);

        //position it
        birdObstacle.style.left = birdObstacleXPosition + "vw";

    //move it
    let moveBirdObstacle = setInterval (() =>
    {
        if (!isGameOver)
        {
            //take variable of bird position and tweek it
            birdObstacleXPosition -= birdObstacleSpeed;
            
            //feed to CSS
            birdObstacle.style.left = birdObstacleXPosition + "vw";
        }
    
        //if bird reached certain point (left the stage)
        //then delete
        if (birdObstacleXPosition <= -20)
        {
            // go into trash
            birdObstacle.classList.remove('birdObstacle');
            try{grid.removeChild(birdObstacle)}
            catch(error){}

            console.log("bird deleted");

        }

        // Bird detector
        //if bird close to player
        //then die
        if (birdObstacleXPosition > -15 && birdObstacleXPosition < -10 && playerPosition > 57)
        {
            console.log("Collisionnnnn");
            clearInterval(moveBirdObstacle);
            GameOver();
        }
    }, 1);


//||||||||||||||||||||||||||||-----Game over-----|||||||||||||||||||||||||||||||||\\
function GameOver()
{
    gameOver.style.visibility = "visible"; 
    isGameOver = true; 
}
}


//||||||||||||||||||||||||||||-----Flying Car Obstacle-----|||||||||||||||||||||||||||||||||\\

//|||||||||||---Flying Car manager---||||||||||||||\\
function managerCarObstacle()
{
    //randomly call cars
    randomCarCall();
}

//RANDOM OBSTACLE CALL

//variable for a random time
var randomCarTime;

// function that fills variable randomly
function changeCarTime()
{
    //take var for random time 
    //fill it with random number
    randomCarTime = Math.floor(Math.random() * (6000 - 1000) + 1000);
}

//function for random calling
function randomCarCall ()
{
    console.log("Ramdom cars call at" + randomCarTime + "milliseconds");

    // generate random number
    changeCarTime();

    setTimeout(randomCarCall, randomCarTime);

    generateCarObstacle();
}

//|||||||||||---Flying Car Maker---||||||||||||||\\
function generateCarObstacle()
{
    //place bird
    let carObstacleXPosition = 150;

    //speed
    let carObstacleSpeed = 0.28;  

    //make them
        //write adiv tag into document
        const carObstacle = document.createElement("div");

        //give this div a class
        if (!isGameOver) {carObstacle.classList.add('carObstacle');}

        //make this div a child of another existing HTML element
        grid.appendChild(carObstacle);

        //position it
        carObstacle.style.left = carObstacleXPosition + "vw";

    //move it
    let moveCarObstacle = setInterval (() =>
    {
        if (!isGameOver)
        {
            //take variable of bird position and tweek it
            carObstacleXPosition -= carObstacleSpeed;
            
            //feed to CSS
            carObstacle.style.left = carObstacleXPosition + "vw";
        }
    
        //if bird reached certain point (left the stage)
        //then delete
        if (carObstacleXPosition <= -20)
        {
            // go into trash
            carObstacle.classList.remove('birdObstacle');
            try{grid.removeChild(carObstacle)}
            catch(error){}

            console.log("car deleted");

        }

        // Bird detector
        //if bird close to player
        //then die
        if (carObstacleXPosition > -15 && carObstacleXPosition < -10 && playerPosition > 57)
        {
            console.log("Collisionnnnn");
            clearInterval(moveCarObstacle);
            GameOver();
        }
    }, 1);

//||||||||||||||||||||||||||||-----Game over-----|||||||||||||||||||||||||||||||||\\
function GameOver()
{
    gameOver.style.visibility = "visible"; 
    isGameOver = true; 
}
}


})
