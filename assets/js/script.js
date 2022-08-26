const element = document.getElementById("startTimer");
const gameElement = document.getElementById("gameArea");
const modalStartCountdownElement = document.getElementById("modalStartCountdown");

let count = 3;
var startInterval;

function gameReset(){
  score = 0;
  active = [];
  mainGame = null;
  gametick = bombSpeed;
  elementgrid.classList.remove("gameOverFlash");
  for (let bomb of bombs) {
    bomb.style.backgroundColor = "black";
    bomb.fuse = 3;
    bomb.addEventListener("click", bomb.stopBomb);
    bomb.innerHTML=`<i class="fa-solid fa-bomb"></i>`;
  }
  startInterval = setInterval(startCountdown, 1000);
 
}

function startCountdown(){
  modalStartCountdownElement.style.display ="block";
    element.innerHTML = count;
    count-=1;
    if (count === -1){  
    element.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
    }
    if(count === -2){
      modalStartCountdownElement.style.display = "none";
        clearInterval(startInterval);
        gameElement.focus();
        gameRun()
    }
}

let score = 0;
let bombSpeed = document.getElementById("myRange").value;

let bombs = document.getElementsByClassName("grid-container")[0].children;
window.onload = gameStartValues;
 function gameStartValues() {
for (let bomb of bombs) {
  bomb.style.backgroundColor = "black";
  bomb.fuse = 3;
  bomb.colorChange = function () {
    // this.style.backgroundColor = randomColor(this.fuse);
    this.style.animation = "startBombColor 3s ease 0s 1";
    if (this.fuse === -1) {
      //alert("Game over");
      bomb.removeEventListener("click", bomb.stopBomb);
      this.style.animation = "initial";
      this.style.backgroundColor = "pink";
      this.innerHTML=`<i class="fa-solid fa-burst"></i>`;
      //this.stopBomb();
      gameOver();
      this.style.backgroundColor = "pink";
    };
    this.fuse -= 1;
  };
  bomb.stopBomb = function () {
    clearInterval(this.myVar);
    this.fuse = 3;
    // console.log(active);
    // console.log("we made it : " + this.innerHTML);
    this.style.backgroundColor = "black";
    this.style.animation = "initial";
    // console.log(bomb.getAttribute("name"));
    // console.log("hello " + active.indexOf(parseInt(bomb.getAttribute("name")) - 1));
    let removeSpace = active.indexOf(parseInt(bomb.getAttribute("name")) - 1);
    if (removeSpace != -1) {
      active.splice(removeSpace, 1);
      score +=1 ;
    }

    
  }
  bomb.ignite = false;
  bomb.addEventListener("click", bomb.stopBomb);

  bomb.endGame = function(){
    // for (let bomb of bombs) {
    bomb.stopBomb();
    console.log("Game over" + bomb);
    // }
  }

}
}

let active = [];

// document.getElementsByTagName("body")[0].onload = function () {
//   gameRun()
// };
let mainGame;
function gameRun() {
  let gametick = bombSpeed;
 mainGame = setInterval(mainGameFunc, gametick);
 mainGameFunc();
};
let startingTwoBombsTimer = 0;
function mainGameFunc() {
  document.getElementById("gameScore").innerHTML = score;
    let j;
   
    if(startingTwoBombsTimer>=2){
     gametick = 0;
    }else{
      startingTwoBombsTimer += 1;
    }
    if (active.length < 3) {
      do {
        j = Math.floor(Math.random() * 9);
      } while (active.indexOf(j) != -1);
      active.push(j);
     
      bombs[j].myVar = setInterval(myTimer, bombSpeed, j);
      console.log("run " + j);
    }
   
  }

function myTimer(i) {
  bombs[i].colorChange();
}
const elementend = document.getElementById("gameOverScreen");
// const elementendmodal = document.getElementById("gameOverModal");
const elementgrid = document.getElementById("gameArea");
function gameOver(){
// elementend.innerHTML = "Game Over";
// elementendmodal.style.display = "block";
elementgrid.classList.add("gameOverFlash");
for (let bomb of bombs) {
bomb.endGame();
 };
console.log("sass");
  clearInterval(mainGame);
}

// Get the modal
var modalGameSettings = document.getElementById("mymodalGameSettings");
modalGameSettings.style.display = "block";

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the button that opens the modal
var modalGameSettingsbtn = document.getElementById("modalGameSettingsOpen");
// When the user clicks the button, open the modal 
modalGameSettingsbtn.onclick = function() {
  modalGameSettings.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalGameSettings.style.display = "none";
  modalStartCountdownElement.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalGameSettings) {
    modalGameSettings.style.display = "none";
    modalStartCountdownElement.style.display = "none";
  }
}

// Get the button that opens the modal
var staraGame = document.getElementById("startGameBtn");
// When the user clicks the button, open the modal 
staraGame.onclick = function() {
  document.getElementById("mymodalGameSettings").style.display = "none";
  modalStartCountdownElement.style.display = "none";
  count=3;
  gameReset();
}

// Get the button that redo the game
var redoGameBtn = document.getElementById("redoGame");
// When the user clicks the button start
redoGameBtn.onclick = function() {
  document.getElementById("mymodalGameSettings").style.display = "none";
  modalStartCountdownElement.style.display = "none";
  count=3;
  gameReset();
}
// Get the button that redo the game
var pauseGameBtn = document.getElementById("pauseGame").children[0];
// When the user clicks the button start
pauseGameBtn.onclick = function() {
  if (pauseGameBtn.style.color ==="red"){
    pauseGameBtn.style.color = "whitesmoke";
    startingTwoBombsTimer = 0;
    gametick = bombSpeed;
    mainGame = setInterval(mainGameFunc, gametick);
  }else{
    pauseGameBtn.style.color = "red";
    for(bomb of bombs){
      bomb.stopBomb();
    }
 clearInterval(mainGame);
  }
}