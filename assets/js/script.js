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
  let htmlString = "";
  let gridContainer = document.getElementsByClassName("grid-container")[0];
  gridContainer.style['grid-template-columns'] = "auto ".repeat(cols);
  for (let x = 0; x < rows * cols; x++) {
    htmlString = htmlString + `<div class="grid-item" >
  <i class="fa-solid fa-bomb bomb_icon" data-bombnum="${x}"></i>
  </div>`
  }
  gridContainer.innerHTML = htmlString;
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
      // mainGame(gameSettings);
      game(gameSettings);
    }
  }
}

//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

// function mainGame(gameSettings) {
//   let noBombs = gameSettings['x'] * gameSettings['y'];
//   let bombSpeed = gameSettings['l'];
//   let noActiveBombs = gameSettings['noBombs'];
//   let active = [];
//   let fuse = bombSpeed < 10 ? 1 : bombSpeed / 10;
//   let bombs = document.getElementsByClassName('bomb_icon');

//   let bombCount = 0;
//   for (bomb of bombs) {
//     bomb.bombNo = bombCount;
//     bombCount = bombCount + 1;
//     bomb.fuseComplete = false;


//     bomb.startBombFuse = function () {
//       let timer = 0;
//       console.log(timer);
//       if (bombSpeed >= 10) {
//         this.bombTimer = setTimeout(this.bombActive, bombSpeed * 100, this);
//       } else {
//         this.bombTimer = setTimeout(this.bombActive, fuse * 100, this);
//       }
//       this.style.animation = `startBombColor ${bombSpeed/10}s ease 0s 1`;
//       console.log("ll");
//       console.log(timer);
//     }

//     bomb.bombActive = function (a) {
//       // if (timer === fuse) {
//       clearTimeout(a.bombTimer);
//       clearInterval(mainGameTimer);
//       alert("Game Over!");
//       // bomb.explode(this);
//       // }
//       // timer++;
//     }


//     bomb.defuseBomb = function () {
//       console.log("bomb clicked");
//       this.style.animation = "";
//       let removePosition = active.indexOf(this.bombNo);
//       active.splice(removePosition, 1);
//       this.removeEventListener('click', this.defuseBomb);
//       clearTimeout(this.bombTimer);

//     }
//   }



//   mainGameTimer = setInterval(mainGameFunc, 0);

//   // };
//   // let startingTwoBombsTimer = 0;
//   function mainGameFunc() {

//     let gameover = false;

//     let randomBombNumber;
//     //   document.getElementById("gameScore").innerHTML = score;
//     //     let j;

//     //     if(startingTwoBombsTimer>=2){
//     //      gametick = 0;
//     //     }else{
//     //       startingTwoBombsTimer += 1;
//     //     }
//     if (active.length < noActiveBombs) { //if the number of bombs in the array is less than the bomb limit, start a new bomb
//       do {
//         randomBombNumber = Math.floor(Math.random() * noBombs);
//       } while (active.indexOf(randomBombNumber) != -1);
//       active.push(randomBombNumber);
//       //  bombs[j].myVar = setInterval(myTimer, bombSpeed, j);
//       bombs[randomBombNumber].startBombFuse();
//       bombs[randomBombNumber].addEventListener('click', bombs[randomBombNumber].defuseBomb);
//     }

//   }
// }

let bombs = document.getElementsByClassName('bomb_icon');
/**
 * the game fucntion with all; the key information for the game to run
 * @param { settings array contains the settings for the game - x: x_size,y: y_size,l: speed of bombs ,noBombs: number of bombs active at one go ,countdownStartNumber: how long the start countdown shoudl be } gameSettings
 */
function game(gameSettings) {
  let numberOfBombs = gameSettings['x'] * gameSettings['y']; // 4 * 4 = 16
  let fuseLength = gameSettings['l']; // 30
  let numberOfLiveBombs = gameSettings['noBombs']; // 3
  let active = [];
  let fuseInMs = fuseLength * 100;
  let fuseInS = fuseLength / 10;
  let randomBombNumber;
  let gameOverFlag = false;

    /**
     * The loop that manages the game, will continue to loop until the user has lost the game or stopped the game.
     */
 let gameTick = setInterval(function () {
   
    if (active.length < numberOfLiveBombs) { //if the number of bombs in the array is less than the bomb limit, start a new bomb
      do {
        randomBombNumber = Math.floor(Math.random() * numberOfBombs);
      } while (active.indexOf(randomBombNumber) != -1);
      active.push(randomBombNumber);

      bombs[randomBombNumber].addEventListener('click', defuseBombFuse);
      console.log(bombs[randomBombNumber].getAttribute("data-bombnum") + " started");
      setBombFuse(bombs[randomBombNumber], fuseInS);

      bombs[randomBombNumber].bombTimer = setTimeout(bombExplode, fuseInMs, bombs[randomBombNumber]);
    }

    active = updateActiveBombs(active);

   if (checkForExploded(active)){
    gameOver(active);
    clearInterval(gameTick);
   }
  }, 300);


}
/**
 * This checks to see what bombs have been defused and removes them from the active bombs array. 
 * @param {number array - which links to the index number of the bombs that are currently ignited} active 
 * @returns a new array with all the bombs that hve been defused removed
 */
function updateActiveBombs(active) {
  let newActive = [];
  for (x of active) {
    if (bombs[x].desfuse === false) {
      newActive.push(x);
    }
  }
  return newActive
}

function checkForExploded(active){
  for(x of active){
    if (bombs[x].blown === true){return true;}
  }
}

/**
 * Start the bombs colour change animation and set its dfuse property to false
 * @param {the current bomb being set} bomb 
 * @param {the length of the fuse time in seconds} fuseInS 
 */
function setBombFuse(bomb, fuseInS) {
  //bomb.style.color = "red";
  bomb.desfuse = false;
  bomb.blown = false;
  bomb.style.animation = `startBombColor ${fuseInS}s ease 0s 1`;
}

/**
 * defuses the bomb that has been clickeed by the user by clearing the timeout and removing the event listener
 */
function defuseBombFuse() {
  this.removeEventListener('click', defuseBombFuse);
  this.desfuse = true;
  clearTimeout(this.bombTimer);
  this.style.animation = "";
  console.log(this.getAttribute("data-bombnum") + " defused");
}

/**
 * Registers the bom,b has exploded and changes it style to show the user the bomb has exploded
 * @param {the bomb that has exploded} bomb 
 */
function bombExplode(bomb) {
  bomb.blown = true;
  bomb.classList.remove("fa-bomb");
  bomb.classList.add("fa-burst");
  // bomb.parentNode.innerHTML=`<i class="fa-solid fa-burst"></i>`;
  bomb.style.color="red";
  console.log(bomb.getAttribute("data-bombnum") + " boom");
}

/**
 * show the gameover screen to the user
 */
function gameOver(active) {
  for (x of active){
    bombs[x].removeEventListener('click', defuseBombFuse);
    bombs[x].style.animation = "";
    clearTimeout(bombs[x].bombTimer);
  }
 console.log("game over!!!")
 showElement(document.getElementById("modalGameOver"));
 
}