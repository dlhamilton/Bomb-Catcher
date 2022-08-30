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

//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

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
    bomb.fuseComplete = false;


    bomb.startBombFuse = function () {
      let timer = 0;
      console.log(timer);
      if (bombSpeed >= 10) {
        this.bombTimer = setTimeout(this.bombActive, bombSpeed * 100, this);
      } else {
        this.bombTimer = setTimeout(this.bombActive, fuse * 100, this);
      }
      this.style.animation = `startBombColor ${bombSpeed/10}s ease 0s 1`;
      console.log("ll");
      console.log(timer);
    }

    bomb.bombActive = function (a) {
      // if (timer === fuse) {
      clearTimeout(a.bombTimer);
      clearInterval(mainGameTimer);
      alert("Game Over!");
      // bomb.explode(this);
      // }
      // timer++;
    }


    bomb.defuseBomb = function () {
      console.log("bomb clicked");
      this.style.animation = "";
      let removePosition = active.indexOf(this.bombNo);
      active.splice(removePosition, 1);
      this.removeEventListener('click', this.defuseBomb);
      clearTimeout(this.bombTimer);

    }
  }



  mainGameTimer = setInterval(mainGameFunc, 0);

  // };
  // let startingTwoBombsTimer = 0;
  function mainGameFunc() {

    let gameover = false;

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
      bombs[randomBombNumber].addEventListener('click', bombs[randomBombNumber].defuseBomb);
    }

  }
}


function game(){

}

function setBombFuse(){

}

function defuseBombFuse(){

}

function bombExplode(){

}

function gameOver(){
  
}