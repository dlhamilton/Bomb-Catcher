// Wait for the Dom to finish loading before running the game 
// Open the settings modal to get the user preference for the game

document.addEventListener("DOMContentLoaded", function () {

  let gameSettings_Modal = document.getElementById("modalGameSettings");
  let gameHowTo_Modal = document.getElementById("modalGameHowTo");
  let gameAccess_Modal = document.getElementById("modalGameAccess");
  showElement(gameSettings_Modal);

  let gameSettings;

  document.getElementById('startGameBtn').addEventListener('click', function () {
score = 0;
document.getElementById("thePlayerScore").innerHTML=0;
document.getElementById("gameScore").innerHTML = 0;

    console.log("ok" + isPaused);
    gameSettings = getModalInformation(gameSettings_Modal);
    drawGameGrid(gameSettings.x, gameSettings.y);
    startGame(gameSettings);
    hideElement(gameSettings_Modal);

  });

  document.getElementsByClassName("close_SettingsModal")[0].addEventListener('click', function () {
    hideElement(gameSettings_Modal);
  });

  document.getElementsByClassName("close_HowToModal")[0].addEventListener('click', function () {
    hideElement(gameHowTo_Modal);
  });

  document.getElementsByClassName("close_AccessModal")[0].addEventListener('click', function () {
    hideElement(gameAccess_Modal);
  });
  

  window.onclick = function (event) {
    if (event.target === modalGameSettings) {
      gameSettings_Modal.style.display = "none";
    }
    if (event.target === modalGameHowTo) {
      gameHowTo_Modal.style.display = "none";
    }
    if (event.target === modalGameAccess) {
      gameAccess_Modal.style.display = "none";
    }
  }

  applyButtonSetup(gameSettings_Modal,gameHowTo_Modal,gameAccess_Modal);
  applyOnChange();

})

function applyOnChange() {
  let sliders = document.getElementsByTagName("input");
  for (let slider of sliders) {
    slider.addEventListener("input", function () {
      if (this.getAttribute("data-type") === "fuseSpeed") {
        document.getElementById("fuseSpeedValue").innerHTML = this.value;
      } else if (this.getAttribute("data-type") === "bombAmount") {
        document.getElementById("bombAmountValue").innerHTML = this.value;
      } else if (this.getAttribute("data-type") === "gameCountdownTime") {
        document.getElementById("gameCountdownTimeValue").innerHTML = this.value;
      } else if (this.getAttribute("data-type") === "gameLevel") {
        document.getElementById("gameLevelValue").innerHTML = this.value;
      }
    })
  }

}

function applyButtonSetup(gameSettings_Modal,gameHowTo_Modal,gameAccess_Modal) {
  let buttons = document.getElementsByTagName("button");
  for (let button of buttons) {
    button.addEventListener("click", function () {
      if (this.getAttribute("id") === "modalGameSettingsOpen") {
        if (isPaused === 0) {
          isPaused = 1;
          document.getElementById("pauseGame").children[0].style.color = "darkgoldenrod";
        }
        checkGameState();
        showElement(gameSettings_Modal);
      } else if (this.getAttribute("id") === "pauseGame") {
        if (isPaused === 1) {
          isPaused = 0;
          this.children[0].style.color = "white";
        } else if (isPaused === 0) {
          isPaused = 1;
          this.children[0].style.color = "darkgoldenrod";
        } else {}
      } else if (this.getAttribute("id") === "resetGameOver") {
        checkGameState();
        showElement(gameSettings_Modal);
      } else if (this.getAttribute("id") === "viewHighScoresBtn") {
        alert("show high score");
      } else if (this.getAttribute("id") === "endGame") {
        document.getElementById("pauseGame").children[0].style.color = "white";
        endGame();
      }else if(this.getAttribute("id") === "EndCurrentGameBtn"){
        document.getElementById("pauseGame").children[0].style.color = "white";
        endGame();
        checkGameState();
      } else if (this.getAttribute("id") === "viewSettings") {
        showElement(gameAccess_Modal);
      } else if (this.getAttribute("id") === "informationBtn") {
        showElement(gameHowTo_Modal);
      } else if (this.getAttribute("id") === "HomeBtn") {
        window.location.href = "index.html";
      } else if (this.getAttribute("id") === "modalGameSettings-customBtn") {
        showCustomSettings();
      };
    });
  }
}

function checkGameState(){
  if (isPaused === 1) {
    // isPaused=2;
    hideElement(document.getElementById('startGameBtn'));
    showElement(document.getElementById('EndCurrentGameBtn'));
    console.log("here" + isPaused);
  } else {
    document.getElementById("pauseGame").children[0]. style.color = "white";
    hideElement(document.getElementById('EndCurrentGameBtn'));
    showElement(document.getElementById('startGameBtn'));
  }
}

function showCustomSettings() {

  if (document.getElementById("customGameSettings").style.display != "block") {
    showElement(document.getElementById("customGameSettings"));
    document.getElementById("modalGameSettings-title").innerHTML = "Bomb Catcher - Custom";
    document.getElementById("modalGameSettings-instructions").innerHTML = "Click the button below to play the orginal game";
    document.getElementById("modalGameSettings-instructions-custom").innerHTML ="Use the options below to create a custom game:";
    document.getElementById("modalGameSettings-customBtn").innerHTML = "Original Game";
    document.getElementById("modalGameSettings-customBtn").style.backgroundColor = `#26A67D`;
    document.getElementById("modalGameSettings-customBtn").style.background = `linear-gradient(180deg,#26A67D,50%,#37d2a1)`;
    document.getElementById("modalGameSettings-customBtn").style.backgroundSize = `200% 200%`;
    document.getElementsByClassName("modalGameSettings-color")[0].classList.add("modalGameSettings-custom");
    document.getElementsByClassName("modalGameSettings-color")[1].classList.add("modalGameSettings-custom");
  } else {
    hideElement(document.getElementById("customGameSettings"));
    document.getElementById("modalGameSettings-title").innerHTML = "Bomb Catcher - Original";
    document.getElementById("modalGameSettings-instructions").innerHTML = "For more fun, click the button below to change the orginal game and add your own custom settings";
    document.getElementById("modalGameSettings-instructions-custom").innerHTML =` <p>
    Welcome to bomb catcher. Defuse the bombs before they explode. </p>
  <p>How many bombs can you defuse before you go boom? </p><br>
  <p><strong>Will you set the new highscore?</strong> Click the start button to begin!</p>`;
    document.getElementById("modalGameSettings-customBtn").innerHTML = "Custom Game";
    document.getElementById("modalGameSettings-customBtn").style.backgroundColor = `#0091ff`;
    document.getElementById("modalGameSettings-customBtn").style.background = `linear-gradient(180deg,#0091ff,50%,#00d4ff)`;
    document.getElementById("modalGameSettings-customBtn").style.backgroundSize = `200% 200%`;
    document.getElementsByClassName("modalGameSettings-color")[0].classList.remove("modalGameSettings-custom");
    document.getElementsByClassName("modalGameSettings-color ")[1].classList.remove("modalGameSettings-custom");

    document.getElementById("col_size").value = "4";
    document.getElementById("row_size").value = "4";
    document.getElementById("fuseSpeed").value = "3";
    document.getElementById("fuseSpeedValue").innerHTML = "3";
    document.getElementById("bombAmount").value = "3";
    document.getElementById("bombAmountValue").innerHTML = "3";
    document.getElementById("gameCountdownTime").value = "3";
    document.getElementById("gameCountdownTimeValue").innerHTML = "3";
    document.getElementById("gameLevel").value = "5";
    document.getElementById("gameLevelValue").innerHTML = "5";
  }

}

/**
 * show a modal element on the DOM by changing display properties.
 * Then get the form data that is inputted.
 */
function getModalInformation(element) {
  //get form, detaisl from form
  let getDetails = document.getElementById('customGameSettings');
  let x_size = getDetails['col_size'].value;
  let y_size = getDetails['row_size'].value;
  let level = getDetails['fuseSpeed'].value;
  let bombs = getDetails['bombAmount'].value;
  let countdown = getDetails['gameCountdownTime'].value;
  let gameSpeed = getDetails['gameLevel'].value;
  return {
    x: x_size,
    y: y_size,
    l: level,
    noBombs: bombs,
    countdownStartNumber: countdown,
    speed: gameSpeed
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
  hideElement(document.getElementById("modalGameOver"));
  isPaused = 0;
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
    if (isPaused===0){
    count -= 1;
    }
    if(isPaused>1){count=-2;}
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


let bombs = document.getElementsByClassName('bomb_icon');
let score = 0;
let isPaused = 3;
let startTime=0;
/**
 * the game fucntion with all; the key information for the game to run
 * @param { settings array contains the settings for the game - x: x_size,y: y_size,l: speed of bombs ,noBombs: number of bombs active at one go ,countdownStartNumber: how long the start countdown shoudl be } gameSettings
 */
function game(gameSettings) {
  startTime = new Date();
  score = 0;
  let numberOfBombs = gameSettings['x'] * gameSettings['y']; // 4 * 4 = 16
  let fuseLength = gameSettings['l'] * 10; // 30
  let numberOfLiveBombs = gameSettings['noBombs']; // 3
  let gameSpeed = gameSettings['speed'] * 100; //5
  let active = [];
  let fuseInMs = fuseLength * 100;
  let fuseInS = fuseLength / 10;
  let randomBombNumber;
  let gameOverFlag = false;
  let scoreArea = document.getElementById("thePlayerScore");
  let scoreAreaGameOver = document.getElementById("gameScore");

  /**
   * The loop that manages the game, will continue to loop until the user has lost the game or stopped the game.
   */
  let gameTick = setInterval(function () {
    if (isPaused === 0) {
      if (active.length < numberOfLiveBombs && gameOverFlag === false) { //if the number of bombs in the array is less than the bomb limit, start a new bomb
        do {
          randomBombNumber = Math.floor(Math.random() * numberOfBombs);
        } while (active.indexOf(randomBombNumber) != -1);
        active.push(randomBombNumber);

        bombs[randomBombNumber].addEventListener('click', defuseBombFuse);
        //console.log(bombs[randomBombNumber].getAttribute("data-bombnum") + " started");
        setBombFuse(bombs[randomBombNumber], fuseInS);

        bombs[randomBombNumber].bombTimer = setTimeout(bombExplode, fuseInMs, bombs[randomBombNumber]);
      }

      active = updateActiveBombs(active);
      gameOverFlag = checkForExploded(active)
      if (gameOverFlag) {
        clearInterval(gameTick);
        gameOver(active);
        //console.log("Eneded NOW");
        isPaused=3;
        defusePerSecond();
        return;
      }
      scoreArea.innerHTML = score;
      scoreAreaGameOver.innerHTML = score;
    } else if (isPaused === 1) {
      for (let bomb of bombs) {
        if (bomb.blown === false) {
          bomb.removeEventListener('click', defuseBombFuse);
          bomb.desfuse = true;
          clearTimeout(bomb.bombTimer);
          bomb.style.animation = "";
        }
      }
    } else {
      clearInterval(gameTick);
      gameOver(active);
      if (isPaused === 2) {
        hideElement(document.getElementById("modalGameOver"));
      }

      active = [];
      bombs = document.getElementsByClassName('bomb_icon');
      //console.log("Eneded NOW");
      defusePerSecond();
      return;
    }
  }, gameSpeed);


}

function defusePerSecond(){
  startTime = new Date - startTime;
  console.log((startTime/1000));
  console.log(score);
  console.log(score/(startTime/1000));
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

function checkForExploded(active) {
  for (x of active) {
    if (bombs[x].blown === true) {
      return true;
    }
  }
  return false;
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
  if (this.blown === false) {
    this.removeEventListener('click', defuseBombFuse);
    this.desfuse = true;
    clearTimeout(this.bombTimer);
    this.style.animation = "";
    //console.log(this.getAttribute("data-bombnum") + " defused");
    ++score;
  }
}

/**
 * Registers the bom,b has exploded and changes it style to show the user the bomb has exploded
 * @param {the bomb that has exploded} bomb 
 */
function bombExplode(bomb) {
  // bombs[x].removeEventListener('click', defuseBombFuse);
  gameOverFlag = true;
  bomb.blown = true;
  bomb.classList.remove("fa-bomb");
  bomb.classList.add("fa-burst");
  // bomb.parentNode.innerHTML=`<i class="fa-solid fa-burst"></i>`;
  bomb.style.color = "red";
  //console.log(bomb.getAttribute("data-bombnum") + " boom");
}

function endGame() {
  // gameOverFlag = true;
  // for (let bomb of bombs) {
  //   bomb.blown = true;
  // }
  isPaused = 3;

}

/**
 * show the gameover screen to the user
 */
function gameOver(active) {
  for (x of active) {
    bombs[x].removeEventListener('click', defuseBombFuse);
    bombs[x].style.animation = "";
    clearTimeout(bombs[x].bombTimer);
  }
  //console.log("game over!!!")
  showElement(document.getElementById("modalGameOver"));
}