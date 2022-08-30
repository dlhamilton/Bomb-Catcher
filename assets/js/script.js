// Wait for the Dom to finish loading before running the game 
// Open the settings modal to get the user preference for the game

document.addEventListener("DOMContentLoaded", function () {

  let gameSettings_Modal = document.getElementById("modalGameSettings");
  showElement(gameSettings_Modal);

  let gameSettings;

  document.getElementById('startGameBtn').addEventListener('click', function () {
    gameSettings = getModalInformation(gameSettings_Modal);
    drawGameGrid(gameSettings.x, gameSettings.y);
    startGame(gameSettings);
    hideElement(gameSettings_Modal);
  });

  document.getElementsByClassName("close_SettingsModal")[0].addEventListener('click', function () {
    hideElement(gameSettings_Modal);
  });

  window.onclick = function (event) {
    if (event.target === modalGameSettings) {
      gameSettings_Modal.style.display = "none";
    }
  }


  let buttons = document.getElementsByTagName("button");
  for (let button of buttons) {
    button.addEventListener("click", function () {
      if (this.getAttribute("id") === "modalGameSettingsOpen") {
        showElement(gameSettings_Modal);
      } else if (this.getAttribute("id") === "redoGame") {

      } else if (this.getAttribute("id") === "pauseGame") {

      };
    });
  }


})
/**
 * show a modal element on the DOM by changing display properties.
 * Then get the form data that is inputted.
 */
function getModalInformation(element) {
  //get form, detaisl from form
  let getDetails = element.getElementsByTagName('input');
  let x_size = getDetails[0].value;
  let y_size = getDetails[1].value;
  let level = getDetails[2].value;
  let bombs = getDetails[3].value;
  let countdown = getDetails[4].value;
  return {
    x: x_size,
    y: y_size,
    l: level,
    noBombs: bombs,
    countdownStartNumber: countdown
  };
}
/**
 * Hide an element on the DOM by changing display properties
 */
function hideElement(element) {

  element.style.display = "none";
}
/**
 * Show an element on the DOM by changing display properties
 */
function showElement(element) {
  element.style.display = "block";
}

/**
 * Creates the correct number of bombs based from the grid size passed in.
 * @param {the number of columns} cols 
 * @param {the number of rows} rows 
 */
function drawGameGrid(cols, rows) {
  let gridContainer = document.getElementsByClassName("grid-container")[0];
  gridContainer.style['grid-template-columns'] = "auto ".repeat(cols);
  gridContainer.innerHTML = `  
<div class="grid-item">
<i class="fa-solid fa-bomb bomb_icon"></i>
</div>`.repeat(rows * cols);
}

function startGame(gameSettings) {
  $('.bomb_icon').flowtype({
    fontRatio: 1
  });
  gameStartCountdown(gameSettings);



}
/**
 * Will count down from time to 0 and will start the game
 * @param {The number you want the countdown to start at } time 
 */
function gameStartCountdown(gameSettings) {
  let count = gameSettings['countdownStartNumber'];

  let startInterval = setInterval(timeCountDown, 1000);

  function timeCountDown() {
    modalStartCountdownElement = document.getElementById("modalStartCountdown");
    modalStartCountdownContent = document.getElementById("startTimer");
    modalStartCountdownElement.style.display = "block";
    modalStartCountdownContent.innerHTML = count;
    count -= 1;
    if (count === -1) {
      modalStartCountdownContent.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
    }
    if (count === -2) {
      modalStartCountdownElement.style.display = "none";
      clearInterval(startInterval);
      mainGame(gameSettings);
    }
  }
}

function mainGame(gameSettings) {
  let noBombs = gameSettings['x'] * gameSettings['y'];
  let bombSpeed = gameSettings['l'];
  let noActiveBombs = gameSettings['noBombs'];
  let active = [];
  let bombs = document.getElementsByClassName('bomb_icon');
  let fuse = bombSpeed < 10 ? 1 : bombSpeed / 10;
  let bombCount = 0;
  for (bomb of bombs) {
 bomb.bombNo = bombCount;
 bombCount = bombCount + 1;

    
     bomb.startBombFuse = function () {
     
      console.log("here");
      let timer = 0;
      // let bomb = document.getElementsByClassName('bomb_icon')[bombIdNumber];
      if (bombSpeed >= 10) {
        this.bombTimer = setInterval(bombActive, 1000);
      } else {
        this.bombTimer = setInterval(bombActive, fuse * 100);
        
      }
      this.style.animation = `startBombColor ${bombSpeed/10}s ease 0s 1`;
      //this.style.color = "red";
      // bomb.addEventListener('click',function(){defuseBomb(bomb,bombIdNumber)});
      function bombActive() {
     
        if (timer === fuse) {
          console.log("boom");
        }
        timer++;
      }
    }

    bomb.defuseBomb = function () {
      console.log("bomb clicked");
        //     clearInterval(this.myVar);
        //     this.fuse = 3;
        //     // console.log(active);
        //     // console.log("we made it : " + this.innerHTML);
        //     if (this.style.backgroundColor != "pink"){
        //     this.style.backgroundColor = "black";
        this.style.animation = "";
        // this.style.color = "pink";
        
        let removePosition = active.indexOf(this.bombNo);
        active.splice(removePosition,1);
        console.log(active);
        this.removeEventListener('click',this.defuseBomb);
        clearInterval(this.bombTimer);
        //console.log(removePosition);
      }
  }



  mainGameTimer = setInterval(mainGameFunc, 0);

  // };
  // let startingTwoBombsTimer = 0;
  function mainGameFunc() {



    let randomBombNumber;
    //   document.getElementById("gameScore").innerHTML = score;
    //     let j;

    //     if(startingTwoBombsTimer>=2){
    //      gametick = 0;
    //     }else{
    //       startingTwoBombsTimer += 1;
    //     }
    if (active.length < noActiveBombs) { //if the number of bombs in the array is less than the bomb limit, start a new bomb
      do {
        randomBombNumber = Math.floor(Math.random() * noBombs);
      } while (active.indexOf(randomBombNumber) != -1);
      active.push(randomBombNumber);
      //  bombs[j].myVar = setInterval(myTimer, bombSpeed, j);
      bombs[randomBombNumber].startBombFuse();
      bombs[randomBombNumber].addEventListener('click',bombs[randomBombNumber].defuseBomb);
    }

  }

  // function defuseBomb(bomb,bombIdNumber) {
  //   //     clearInterval(this.myVar);
  //   //     this.fuse = 3;
  //   //     // console.log(active);
  //   //     // console.log("we made it : " + this.innerHTML);
  //   //     if (this.style.backgroundColor != "pink"){
  //   //     this.style.backgroundColor = "black";
  //   // bomb.style.animation = "";
  //   bomb.style.color = "pink";
  //   let removePosition = active.indexOf(bombIdNumber);
  //   active.splice(removePosition,1);
  //   console.log(active);
  //   bomb.removeEventListener('click',function(){});
  //   clearInterval(bomb.bombTimer);
  //   //console.log(removePosition);
  // }

}



// const element = document.getElementById("startTimer");
// const gameElement = document.getElementById("gameArea");
// const modalStartCountdownElement = document.getElementById("modalStartCountdown");

// let count = 3;
// var startInterval;

// function gameReset(){
//   score = 0;
//   document.getElementById("gameScore").innerHTML = score;
//   pauseGameBtn.style.color = "whitesmoke";
//   active = [];
//   mainGame = null;
//   gametick = bombSpeed;
//   elementgrid.classList.remove("gameOverFlash");
//   for (let bomb of bombs) {
//     bomb.style.backgroundColor = "black";
//     bomb.fuse = 3;
//     bomb.addEventListener("click", () => {bomb.stopBomb(false)});
//     bomb.innerHTML=`<i class="fa-solid fa-bomb"></i>`;
//   }
//   startInterval = setInterval(startCountdown, 1000);

// }

// function startCountdown(){
//   modalStartCountdownElement.style.display ="block";
//     element.innerHTML = count;
//     count-=1;
//     if (count === -1){  
//     element.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
//     }
//     if(count === -2){
//       modalStartCountdownElement.style.display = "none";
//         clearInterval(startInterval);
//         gameElement.focus();
//         gameRun()
//     }
// }

// let score = 0;
// let bombSpeed = document.getElementById("myRange").value;

// let bombs = document.getElementsByClassName("grid-container")[0].children;
// window.onload = gameStartValues;
//  function gameStartValues() {
// for (let bomb of bombs) {
//   bomb.style.backgroundColor = "black";
//   bomb.fuse = 3;
//   bomb.colorChange = function () {
//     // this.style.backgroundColor = randomColor(this.fuse);
//     this.style.animation = "startBombColor 3s ease 0s 1";
//     if (this.fuse === -1) {
//       //alert("Game over");
//       bomb.removeEventListener("click", () => {bomb.stopBomb(false)});
//       this.style.animation = "initial";
//       this.style.backgroundColor = "pink";
//       this.innerHTML=`<i class="fa-solid fa-burst"></i>`;
//       //this.stopBomb();
//       gameOver();
//       this.style.backgroundColor = "pink";
//     };
//     this.fuse -= 1;
//   };
//   bomb.stopBomb = function (x) {
//     clearInterval(this.myVar);
//     this.fuse = 3;
//     // console.log(active);
//     // console.log("we made it : " + this.innerHTML);
//     if (this.style.backgroundColor != "pink"){
//     this.style.backgroundColor = "black";
//   }
//     this.style.animation = "initial";
//     // console.log(bomb.getAttribute("name"));
//     // console.log("hello " + active.indexOf(parseInt(bomb.getAttribute("name")) - 1));
//     let removeSpace = active.indexOf(parseInt(bomb.getAttribute("name")) - 1);
//     if (removeSpace != -1) {
//       active.splice(removeSpace, 1);
//       console.log(x);
//       if (x==true){
//       score +=1 ;
//       }
//     }


//   }
//   bomb.ignite = false;
//   bomb.addEventListener("click", () => {bomb.stopBomb(true)});

//   bomb.endGame = function(){
//     // for (let bomb of bombs) {
//     bomb.stopBomb(false);
//     console.log("Game over" + bomb);
//     // }
//   }

// }
// }

// let active = [];

// // document.getElementsByTagName("body")[0].onload = function () {
// //   gameRun()
// // };
// let mainGame;
// function gameRun() {
//   let gametick = bombSpeed;
//  mainGame = setInterval(mainGameFunc, gametick);
//  mainGameFunc();
// };
// let startingTwoBombsTimer = 0;
// function mainGameFunc() {
//   document.getElementById("gameScore").innerHTML = score;
//     let j;

//     if(startingTwoBombsTimer>=2){
//      gametick = 0;
//     }else{
//       startingTwoBombsTimer += 1;
//     }
//     if (active.length < 3) {
//       do {
//         j = Math.floor(Math.random() * 9);
//       } while (active.indexOf(j) != -1);
//       active.push(j);

//       bombs[j].myVar = setInterval(myTimer, bombSpeed, j);
//       console.log("run " + j);
//     }

//   }

// function myTimer(i) {
//   bombs[i].colorChange();
// }
// const elementend = document.getElementById("gameOverScreen");
// // const elementendmodal = document.getElementById("gameOverModal");
// const elementgrid = document.getElementById("gameArea");
// function gameOver(){
// // elementend.innerHTML = "Game Over";
// // elementendmodal.style.display = "block";
// elementgrid.classList.add("gameOverFlash");
// for (let bomb of bombs) {
//  bomb.removeEventListener("click", () => {bomb.stopBomb(false)});
// bomb.endGame();
//  };
// console.log("sass");
//   clearInterval(mainGame);
// }

// // Get the modal
// var modalGameSettings = document.getElementById("mymodalGameSettings");
// modalGameSettings.style.display = "block";

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // Get the button that opens the modal
// var modalGameSettingsbtn = document.getElementById("modalGameSettingsOpen");
// // When the user clicks the button, open the modal 
// modalGameSettingsbtn.onclick = function() {
//   modalGameSettings.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modalGameSettings.style.display = "none";
//   modalStartCountdownElement.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modalGameSettings) {
//     modalGameSettings.style.display = "none";
//     modalStartCountdownElement.style.display = "none";
//   }
// }

// // Get the button that opens the modal
// var staraGame = document.getElementById("startGameBtn");
// // When the user clicks the button, open the modal 
// staraGame.onclick = function() {
//   document.getElementById("mymodalGameSettings").style.display = "none";
//   modalStartCountdownElement.style.display = "none";
//   count=3;
//   gameReset();
// }

// // Get the button that redo the game
// var redoGameBtn = document.getElementById("redoGame");
// // When the user clicks the button start
// redoGameBtn.onclick = function() {
//   document.getElementById("mymodalGameSettings").style.display = "none";
//   modalStartCountdownElement.style.display = "none";
//   count=3;
//   gameReset();
// }
// // Get the button that redo the game
// var pauseGameBtn = document.getElementById("pauseGame").children[0];
// // When the user clicks the button start
// pauseGameBtn.onclick = function() {
//   if (pauseGameBtn.style.color ==="red"){
//     pauseGameBtn.style.color = "whitesmoke";
//     startingTwoBombsTimer = 0;
//     gametick = bombSpeed;
//     mainGame = setInterval(mainGameFunc, gametick);
//   }else{
//     pauseGameBtn.style.color = "red";
//     for(let bomb of bombs){
//       if(bomb.myVar===undefined || bomb.myVar ===null){

//       }
//       bomb.stopBomb(false);
//     }
//  clearInterval(mainGame);
//   }
// }