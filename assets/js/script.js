let defuseSpeed; // Store the number of bombs popped per second
let light_mode = false; //State of the light mode setting
let bombs = document.getElementsByClassName('bomb_icon');//stores all the bombs in an array
let score = 0;// The game score
let isPaused = 3;// the current state of the game, if it is running - 0 paused - 1 or game over - 3
let startTime = 0;//The time the game was started
let topScore = getTopScore();// the current top score
let gameTick;// The speed of the bombs being lit
let activeBombs;//The array of bombs that are currently lit

// Wait for the Dom to finish loading before running the game 
document.addEventListener("DOMContentLoaded", function () {
  firstVisitIntro();
  applyWindowOnClick();
  applyModalClose();
  let buttons = document.getElementsByTagName("button");
  for (let button of buttons) {
    applyButtonSetup(button);
  }
  let sliders = document.getElementsByTagName("input");
  for (let slider of sliders) {
    applyOnInput(slider);
  }
  applyOnChange();
  window.onresize = function () {
    getOrientation();
  };
});

/**
 * Will check session storage to see if it is their first time to the site. if it is, it will show the instructions modal first before the settings modal
 */
function firstVisitIntro() {
  let gameSettings_Modal = document.getElementById("modalGameSettings");
  let gameHowTo_Modal = document.getElementById("modalGameHowTo");
  if (sessionStorage.siteVisited) {
    showElement(gameSettings_Modal);
  } else {
    showElement(gameHowTo_Modal);
  }
}

/**
 * Will apply a click event to the modals background when the modals are open. It will check if the user clicks off the modal and closes it.
 */
function applyWindowOnClick() {
  let gameSettings_Modal = document.getElementById("modalGameSettings");
  window.onclick = function (event) {
    //close the game settings modal
    if (event.target.id === "modalGameSettings") {
      hideElement(gameSettings_Modal);
    }
    //close the game instructions modal
    if (event.target.id === "modalGameHowTo") {
      let gameHowTo_Modal = document.getElementById("modalGameHowTo");
      hideElement(gameHowTo_Modal);
      if (!sessionStorage.siteVisited) {
        showElement(gameSettings_Modal);
        sessionStorage.siteVisited = 1;
      }
    }
    //close the settings modal
    if (event.target.id === "modalGameAccess") {
      let gameAccess_Modal = document.getElementById("modalGameAccess");
      hideElement(gameAccess_Modal);
    }
    //close the game high score modal
    if (event.target.id === "modalHighScores") {
      let gameHighScore_Modal = document.getElementById("modalHighScores");
      hideElement(gameHighScore_Modal);
    }
  };
}

/**
 * Will apply a click event to the close icon when the modals are open. It will check if the user clicks the icon and closes the modal.
 */
function applyModalClose() {
  let gameSettings_Modal = document.getElementById("modalGameSettings");
  //close the game settings modal
  document.getElementsByClassName("close_SettingsModal")[0].addEventListener('click', function () {
    hideElement(gameSettings_Modal);
  });
  //close the game instructions modal
  document.getElementsByClassName("close_HowToModal")[0].addEventListener('click', function () {
    let gameHowTo_Modal = document.getElementById("modalGameHowTo");
    hideElement(gameHowTo_Modal);
    if (!sessionStorage.siteVisited) {
      showElement(gameSettings_Modal);
      sessionStorage.siteVisited = 1;
    }
  });
  //close the settings modal
  document.getElementsByClassName("close_AccessModal")[0].addEventListener('click', function () {
    let gameAccess_Modal = document.getElementById("modalGameAccess");
    hideElement(gameAccess_Modal);
  });
  //close the game high score modal
  document.getElementsByClassName("close_HighScoresModal")[0].addEventListener('click', function () {
    let gameHighScore_Modal = document.getElementById("modalHighScores");
    hideElement(gameHighScore_Modal);
  });
}

/**
 * Will apply a onchange to the col and row inputs.  Will update the game settings 
 */
function applyOnChange() {
  let selectors = document.getElementsByTagName("select");
  for (let selector of selectors) {
    switch (selector.getAttribute("id")) {
      case "col_size":
        selector.addEventListener("change", sliderMaxAmount);
        break;
      case "row_size":
        selector.addEventListener("change", sliderMaxAmount);
        break;
    }
  }
}
/**
 * called from applyOnChange, sets the max amount of bombs that can be live at one time
 */
function sliderMaxAmount() {
  let amountOfBombsSlider = document.getElementById("bombAmount");
  amountOfBombsSlider.max = document.getElementById("col_size").value * document.getElementById("row_size").value;
  document.getElementById("bombAmountValue").innerHTML = amountOfBombsSlider.value;
}
/**
 * sets the event listener for the sliders in the game settings, will update the slider labels, turn on sound or light mode.
 * @param {HTMLElement} slider - input elemets of HTML page
 */
function applyOnInput(slider) {
  slider.addEventListener("input", function () {
    switch (slider.getAttribute("id")) {
      case "fuseSpeed":
        document.getElementById("fuseSpeedValue").innerHTML = slider.value;
        break;
      case "bombAmount":
        document.getElementById("bombAmountValue").innerHTML = slider.value;
        break;
      case "gameCountdownTime":
        document.getElementById("gameCountdownTimeValue").innerHTML = slider.value;
        break;
      case "gameLevel":
        document.getElementById("gameLevelValue").innerHTML = slider.value;
        break;
      case "game_Volume":
        playFuseSound("explode");
        break;
      case "sound_On_Btn":
        toggleSoundElement();
        break;
      case "lightmode_Btn":
        setlightmode();
        break;
    }
  });
}
/**
 * will show the volume element or hide depending on state of sound_On_Btn
 */
function toggleSoundElement() {
  if (document.getElementById("sound_On_Btn").checked === true) {
    playFuseSound("explode");
    showElement(document.getElementById("volume_Section"));
  } else {
    hideElement(document.getElementById("volume_Section"));
  }
}

/**
 * will toggle the page to light mode and change the font colour of some elements
 */
function setlightmode() {
  document.body.classList.toggle("body_light");
  if (light_mode === false) {
    light_mode = true;
  } else {
    light_mode = false;
  }
  let scoreArea = document.getElementById("gameScore");
  if (scoreArea.style.color === "black") {
    scoreArea.style.color = "white";
  } else if (scoreArea.style.color === "white") {
    scoreArea.style.color = "black";
  }
}

/**
 * will opent he game settings but will check to see if a game is currently running and pause it
 * @param {HTMLElement} gameSettings_Modal 
 */
function openGameSettingModal(gameSettings_Modal) {
  if (isPaused === 0) {
    isPaused = 1;
    document.getElementById("pauseGame").children[0].style.color = "darkgoldenrod";
  }
  checkGameState();
  showElement(gameSettings_Modal);
}

/**
 * will set the game state to paused and change the icon button colour
 * @param {HTMLElement} button 
 */
function pauseThegame(button) {
  if (isPaused === 1) {
    isPaused = 0;
    if (light_mode) {
      button.children[0].style.color = "black";
    } else {
      button.children[0].style.color = "white";
    }
  } else if (isPaused === 0) {
    isPaused = 1;
    button.children[0].style.color = "darkgoldenrod";
  }
}

/**
 * Will start the progress of ending the game by removing pause button pause colour 
 */
function endTheGame() {
  if (light_mode) {
    document.getElementById("pauseGame").children[0].style.color = "black";
  } else {
    document.getElementById("pauseGame").children[0].style.color = "white";
  }
  endGame();
}

/**
 * Will start the game.
 * Put all scores to 0. 
 * Get the settings that the user wants. 
 * Draws grid and hides the modals.
 * Finally starts the count down to begin game.
 * @param {HTMLElement} gameSettings_Modal 
 */
function startTheGame(gameSettings_Modal) {
  let gameSettings;
  score = 0;
  document.getElementById("thePlayerScore").innerHTML = 0;
  document.getElementById("gameScore").innerHTML = 0;
  document.getElementById("gameScore").classList.remove("hsGold");
  gameSettings = getModalInformation(gameSettings_Modal);
  drawGameGrid(gameSettings.x, gameSettings.y);
  startGame(gameSettings);
  hideElement(gameSettings_Modal);
}

/**
 * /**
 * Will apply a click event to all the buttons and clickable items 
 * @param {HTMLElement} button from HTML page
 */
function applyButtonSetup(button) {
  let gameSettings_Modal = document.getElementById("modalGameSettings");
  let gameHowTo_Modal = document.getElementById("modalGameHowTo");
  let gameAccess_Modal = document.getElementById("modalGameAccess");
  let gameHighScore_Modal = document.getElementById("modalHighScores");
  button.addEventListener("click", function () {
    switch (this.getAttribute("id")) {
      case "modalGameSettingsOpen":
        openGameSettingModal(gameSettings_Modal);
        break;
      case "pauseGame":
        pauseThegame(this);
        break;
      case "resetGameOver":
        checkGameState();
        showElement(gameSettings_Modal);
        break;
      case "viewHighScoresBtn":
        loadHighScores();
        showElement(gameHighScore_Modal);
        break;
      case "endGame":
        endTheGame();
        break;
      case "endCurrentGameBtn":
        endTheGame();
        checkGameState();
        break;
      case "viewSettings":
        showElement(gameAccess_Modal);
        break;
      case "informationBtn":
        showElement(gameHowTo_Modal);
        break;
      case "HomeBtn":
        window.location.href = "index.html";
        break;
      case "modalGameSettings-customBtn":
        showCustomSettings();
        break;
      case "lets_Play_Btn":
        hideElement(gameHowTo_Modal);
        openGameSettingModal(gameSettings_Modal);
        sessionStorage.siteVisited = 1;
        break;
      case "startGameBtn":
        startTheGame(gameSettings_Modal);
        break;
      case "showhighScoreBtn":
        loadHighScores();
        showElement(gameHighScore_Modal);
        break;
      case "newHSButton":
        addNewHighScore();
        break;
      case "sortbyScore":
        sortHS(1);
        break;
      case "sortbyBPS":
        sortHS(2);
        break;
      case "sortbyDate":
        sortHS(3);
        break;
      case "resetHSScores":
        localStorage.removeItem("hsArray");
        break;
      case "firstPlayButton":
        checkGameState();
        showElement(gameSettings_Modal);
        break;
    }
  });
}
/**
 * Will check to see if the game is paused. If it is you will not be able to start a new game until the game is ended. Will show end game button and hide start button
 */
function checkGameState() {
  if (isPaused === 1) {
    hideElement(document.getElementById('startGameBtn'));
    showElement(document.getElementById('endCurrentGameBtn'));
  } else {
    if (light_mode) {
      document.getElementById("pauseGame").children[0].style.color = "black";
    } else {
      document.getElementById("pauseGame").children[0].style.color = "white";
    }
    hideElement(document.getElementById('endCurrentGameBtn'));
    showElement(document.getElementById('startGameBtn'));
  }
}

/**
 * toggle to show all the designs and commands for custom game and orgianl game on game settings modal
 */
function showCustomSettings() {
  if (document.getElementById("customGameSettings").style.display != "block") {
    showElement(document.getElementById("customGameSettings"));
    document.getElementById("modalGameSettings-title").innerHTML = "Bomb Catcher - Custom";
    document.getElementById("modalGameSettings-instructions").innerHTML = "Click the button below to play the orginal game";
    document.getElementById("modalGameSettings-instructions-custom").innerHTML = "Use the options below to create a custom game:";
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
    document.getElementById("modalGameSettings-instructions-custom").innerHTML = ` <p>
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
function getModalInformation() {
  let getDetails = document.getElementById('customGameSettings');
  let x_size = getDetails.col_size.value;
  let y_size = getDetails.row_size.value;
  let level = getDetails.fuseSpeed.value;
  let bombs = getDetails.bombAmount.value;
  let countdown = getDetails.gameCountdownTime.value;
  let gameSpeed = convertGameSpeed(getDetails.gameLevel.value);
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
 * turns the level selected into game tick speed.
 * @param {integer} speed - the level the user selected between 0 and 10
 * @returns games tick speed
 */
function convertGameSpeed(speed) {
  let x = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  return x[speed];
}

/**
 * Hide an element on the DOM by changing display properties
 * @param {HTMLElement} element 
 */
function hideElement(element) {
  element.style.display = "none";
}
/**
 * Show an element on the DOM by changing display properties
 * @param {HTMLElement} element 
 */
function showElement(element) {
  element.style.display = "block";
}
/**
 * Creates the correct number of bombs based from the grid size passed in.
 * @param {number} cols - of game grid
 * @param {number} rows - of game grid
 */
function drawGameGrid(cols, rows) {
  let htmlString = "";
  let gridContainer = document.getElementsByClassName("grid-container")[0];
  gridContainer.style['grid-template-columns'] = "auto ".repeat(cols);
  for (let x = 0; x < rows * cols; x++) {
    htmlString = htmlString + `<div class="grid-item" >
  <i class="fa-solid fa-bomb bomb_icon" data-bombnum="${x}"></i>
  </div>`;
  }
  gridContainer.innerHTML = htmlString;
}
/**
 * Will start the game count down and hide modals
 * @param {HTMLElement} gameSettings 
 */
function startGame(gameSettings) {
  getOrientation();
  hideElement(document.getElementById("modalGameOver"));
  isPaused = 0;
  gameStartCountdown(gameSettings);
}
/**
 * Will count down from time to 0 and will start the game
 * @param {number} time - The number you want the countdown to start at
 */
function gameStartCountdown(gameSettings) {
  let count = gameSettings.countdownStartNumber;
  let startInterval = setInterval(timeCountDown, 1000);

  /**
   * puts the numbers of screen when counting down
   */
  function timeCountDown() {
    let modalStartCountdownElement = document.getElementById("modalStartCountdown");
    let modalStartCountdownContent = document.getElementById("startTimer");
    modalStartCountdownElement.style.display = "block";
    modalStartCountdownContent.innerHTML = count;
    if (isPaused === 0) {
      count -= 1;
    }
    if (isPaused > 1) {
      count = -2;
    }
    if (count === -1) {
      modalStartCountdownContent.innerHTML = `<i class="fa-solid fa-bomb"></i>`;
    }
    if (count === -2) {
      modalStartCountdownElement.style.display = "none";
      clearInterval(startInterval);
      game(gameSettings);
    }
  }
}

/**
 * Starts a bomb, give it an event listener and add it to the active array. Will check that the bomb is not already active
 * @param {HTMLElement} gameSettings 
 */
function StartBombFuse(gameSettings) {
  let numberOfBombs = gameSettings.x * gameSettings.y; 
  let fuseLength = gameSettings.l * 10;
  let fuseInMs = fuseLength * 100;
  let fuseInS = fuseLength / 10;
  let randomBombNumber;
  do {
    randomBombNumber = Math.floor(Math.random() * numberOfBombs);
  } while (activeBombs.indexOf(randomBombNumber) != -1);
  activeBombs.push(randomBombNumber);
  bombs[randomBombNumber].addEventListener('click', defuseBombFuse);
  setBombFuse(bombs[randomBombNumber], fuseInS);
  bombs[randomBombNumber].bombTimer = setTimeout(bombExplode, fuseInMs, bombs[randomBombNumber]);
}


/**
 * the game function with all; the key information for the game to run
 * @param {array} gameSettingS array contains the settings for the game - x: x_size,y: y_size,l: speed of bombs ,noBombs: number of bombs active at one go ,
 * countdownStartNumber: how long the start countdown shoudl be 
 */
function game(gameSettings) {
  startTime = new Date();
  score = 0;
  let gameSpeed = gameSettings.speed * 100;
  activeBombs = [];
  let gameOverFlag = false;

  /**
   * The loop that manages the game, will continue to loop until the user has lost the game or stopped the game.
   */
  gameTick = setInterval(function () {
    gameOperation(gameOverFlag, gameSettings);
  }, gameSpeed);
}

/**
 * The controls for the game, keep track of score and if the game has been stop or lost
 * @param {boolean} gameOverFlag 
 * @param {HTMLElement} gameSettings 
 * @returns nothing - end the function 
 */
function gameOperation(gameOverFlag, gameSettings) {
  let numberOfLiveBombs = gameSettings.noBombs;
  if (isPaused === 0) {
    if (activeBombs.length < numberOfLiveBombs && gameOverFlag === false) { //if the number of bombs in the array is less than the bomb limit, start a new bomb
      StartBombFuse(gameSettings);
    }
    activeBombs = updateActiveBombs();
    gameOverFlag = checkForExploded();
    if (gameOverFlag) {
      userEndGame();
      return;
    }
    updateScore(score);
  } else if (isPaused === 1) {
    pauseTheGame();
  } else {
    userEndGame();
    return;
  }
}

/**
 * The user has eneded the game. Game interval stopped and game over is called
 */
function userEndGame() {
  clearInterval(gameTick);
  isPaused = 3;
  gameOver();
  activeBombs = [];
  defusePerSecond();
}

/**
 * The game has been paused and current bombs are pasued and no new bombs will be created
 */
function pauseTheGame() {
  for (let bomb of bombs) {
    if (bomb.blown === false) {
      bomb.removeEventListener('click', defuseBombFuse);
      bomb.desfuse = true;
      clearTimeout(bomb.bombTimer);
      bomb.style.animation = "";
    }
  }
}

/**
 * Will work out the number of bombs defused per second on average
 */
function defusePerSecond() {
  startTime = new Date() - startTime;
  defuseSpeed = score / (startTime / 1000);
}
/**
 * This checks to see what bombs have been defused and removes them from the active bombs array. 
 * @returns a new array with all the bombs that have been defused removed
 */
function updateActiveBombs() {
  let newActive = [];
  for (let x of activeBombs) {
    if (bombs[x].desfuse === false) {
      newActive.push(x);
    }
  }
  return newActive;
}

/**
 * checks all active bombs to see if one has exploded
 * @returns boolean if bomb has exploded
 */
function checkForExploded() {
  for (let x of activeBombs) {
    if (bombs[x].blown === true) {
      return true;
    }
  }
  return false;
}
/**
 * Start the bombs colour change animation and set its dfuse property to false
 * @param {HTMLElement} bomb 
 * @param {number} fuseInS - the length of the fuse time in seconds
 */
function setBombFuse(bomb, fuseInS) {
  bomb.desfuse = false;
  bomb.blown = false;
  bomb.style.animation = `startBombColor ${fuseInS}s ease 0s 1`;
}

/**
 * Play the sound that is requested from the parameter
 * @param {string} type - explode or defuse
 */
function playFuseSound(type) {
  if (document.getElementById("sound_On_Btn").checked === true) {
    let audio = new Audio();
    if (type === "explode") {
      audio.src = "./assets/sounds/explode_sound.mp3";
    } else {
      audio.src = "./assets/sounds/fuse_sound.mp3";
    }
    audio.currentTime = 0;
    audio.volume = document.getElementById("game_Volume").value;
    audio.play();
  }
}
/**
 * defuses the bomb that has been clicked by the user by clearing the timeout and removing the event listener
 */
function defuseBombFuse() {
  if (this.blown === false) {
    playFuseSound("bomb");
    this.removeEventListener('click', defuseBombFuse);
    this.desfuse = true;
    clearTimeout(this.bombTimer);
    this.style.animation = "";
    ++score;
  }
}
/**
 * Registers the bomb has exploded and changes it style to show the user the bomb has exploded
 * @param {HTMLElement} bomb 
 */
function bombExplode(bomb) {
  bomb.blown = true;
  bomb.classList.remove("fa-bomb");
  bomb.classList.add("fa-burst");
  bomb.style.color = "red";
  if (document.getElementById("sound_On_Btn").checked === true) {
    playFuseSound("explode");
  }
}
/**
 * set the game state as game over
 */
function endGame() {
  isPaused = 3;
}
/**
 * show the gameover screen to the user
 */
function gameOver() {
  for (let x of activeBombs) {
    bombs[x].removeEventListener('click', defuseBombFuse);
    bombs[x].style.animation = "";
    clearTimeout(bombs[x].bombTimer);
  }
  checkHighScore();
  showElement(document.getElementById("modalGameOver"));
}

/**
 * Gets the high score from local storage if it exists
 * @returns the high score from local storage
 */
function getTopScore() {
  let arr = JSON.parse(localStorage.getItem('hsArray'));
  if (arr === null) {
    return 0;
  } else {
    return arr[0][1];
  }
}

/**
 * will check if the user score is able to be in the top 10 scores. shows high score message if it is.
 */
function checkHighScore() {
  let arr = JSON.parse(localStorage.getItem('hsArray'));
  hideElement(document.getElementById("hsAcceptMessage"));
  let newHighScoreInput = document.getElementById('newHSInput');
  let newHighScoreMessage = document.getElementById('scoreMessage');
  let topScore;
  let tenthScore;
  if (arr === null) {
    topScore = 0;
    tenthScore = 0;
  } else {
    topScore = arr[0][1];
    if (arr.length - 1 < 9) {
      tenthScore = 0;
    } else {
      tenthScore = arr[arr.length - 1][1];
    }
  }
  if (score > tenthScore) {
    showElement(newHighScoreInput);
    if (score > topScore) {
      newHighScoreMessage.innerHTML = "New high score:";
    } else {
      newHighScoreMessage.innerHTML = "New top 10 score:";
    }
  } else {
    hideElement(newHighScoreInput);
    newHighScoreMessage.innerHTML = "Your score:";
  }
}

/**
 * get the date and put it in short form
 * @returns todays date
 */
function getTodaysDate() {
  let currentDate = new Date();
  return currentDate.toLocaleDateString();
}

/**
 * will capitalize the players name
 * @param {string} str - users name
 * @returns users name with captial first letter
 */
function sentanceCaseText(str) {
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

/**
 * find where the high score should be inserted into the array
 * @param {array} arr 
 * @returns number of where the high score should be inserted in the array
 */
function findHSindex(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (score > arr[i][1]) {
      return i;
    }
  }
}

/**
 * Moves all the items in the array down one posisiton from the insert pos and will remove last item if there is 10 items in the array
 * @param {array} arr 
 * @param {number} insertPos 
 * @returns new array with one duplicate item
 */
function moveHighScoreDown(arr, insertPos) {
  let j = arr.length - 1;
  if (j < 9) {
    arr[j + 1] = arr[j];
  }
  do {
    arr[j] = arr[j - 1];
    j--;
  } while (j > insertPos);
  return arr;
}

/**
 *  Will add a new high score to the array and add to local storage
 */
function addNewHighScore() {
  let insertPos = null;
  let arr = JSON.parse(localStorage.getItem('hsArray'));
  let hSName = document.getElementById("newHSName").value;
  let hSScore = score;
  let hSTime = defuseSpeed.toFixed(2);
  let todaysDate = getTodaysDate();
  if (hSName != "") {
    document.getElementById("newHSName").classList.remove("missingName");
    hSName = sentanceCaseText(hSName);
    if (arr != null) {
      insertPos = findHSindex(arr);
      if (insertPos === null) {
        insertPos = arr.length;
      } else {
        arr = moveHighScoreDown(arr, insertPos);
      }
      arr[insertPos] = [hSName, hSScore, hSTime, todaysDate];
    } else {
      arr = [
        []
      ];
      arr[0] = [hSName, hSScore, hSTime, todaysDate];
    }
    storeHighScore(arr);
  } else {
    document.getElementById("newHSName").classList.add("missingName");
  }
}

/**
 * place new array of scores into local storage
 * @param {array} arr 
 */
function storeHighScore(arr) {
  hideElement(document.getElementById("newHSInput"));
  showElement(document.getElementById("hsAcceptMessage"));
  localStorage.setItem('hsArray', JSON.stringify(arr));
  loadHighScores();
  showElement(document.getElementById("modalHighScores"));
  document.getElementById("newHSName").value = "";
}

/**
 * Will update the score on the html page and will change colour if new high score is set
 * @param {number} score 
 */
function updateScore(score) {
  let scoreArea = document.getElementById("gameScore");
  let scoreAreaGameOver = document.getElementById("thePlayerScore");
  if (light_mode) {
    scoreArea.style.color = "black";
  } else {
    scoreArea.style.color = "white";
  }
  scoreAreaGameOver.style.color = "white";
  scoreArea.innerHTML = score;
  scoreAreaGameOver.innerHTML = score;
  if (score > topScore) {
    scoreArea.classList.add("hsGold");
    scoreAreaGameOver.style.color = "gold";
  }
}

/**
 * will load the high scores from local storage
 */
function loadHighScores() {
  let HSArr = JSON.parse(localStorage.getItem('hsArray'));
  loadHSTable(HSArr);
}

/**
 * Sort the high scores based on the parameter 
 * @param {number} item - sort type 1 - points, 2 - BPS, 3 - Date
 */
function sortHS(item) {
  let HSArr = JSON.parse(localStorage.getItem('hsArray'));
  if (HSArr != null) {
    let swapped;
    let temp;
    for (let i = 0; i < HSArr.length - 1; i++) {
      swapped = false;
      for (let j = 0; j < HSArr.length - i - 1; j++) {
        if (HSArr[j][item] < HSArr[j + 1][item]) {
          temp = HSArr[j];
          HSArr[j] = HSArr[j + 1];
          HSArr[j + 1] = temp;
          swapped = true;
        }
      }
      if (swapped === false) {
        break;
      }
    }
    loadHSTable(HSArr);
  }
}

/**
 * Add the high score tables on the high score modal 
 * @param {array} arr - of high scores
 */
function loadHSTable(arr) {
  let HSArea = document.getElementById("highScoreArea");
  let htmlString = `<div class ="hsGridItem"><table><tr>
<th class="ten">Pos.</th>
<th class="forty">Name</th>
<th class="ten">Score</th>
<th class="ten">Bps</th>
<th class="thirty_hide">Date Set</th>
</tr></table></div>`;
  if (arr != null) {
    for (let i = 0; i < arr.length; i++) {
      htmlString = htmlString + `<div class ="hsGridItem"><table><tr>
<td class="ten">${i+1}</td>
<td class="forty">${arr[i][0]}</td>
<td class="ten">${arr[i][1]}</td>
<td class="ten">${arr[i][2]}</td>
<td class="thirty_hide">${arr[i][3]}</td>
</tr></table></div>`;
    }
  } else {
    htmlString = "No high scores set";
  }
  HSArea.innerHTML = htmlString;
}

/**
 * Will call the flowtype ratio command to keep the bomb icon size inside the game grid
 */
function reDrawBombs() {
  $('.bomb_icon').flowtype({
    fontRatio: 1
  });
}

/**
 * Gets the orientation of the device and resizes the game grid so it fits on screen.
 */
function getOrientation() {
  let orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
  let bombArea = document.getElementsByClassName("grid-container")[0];
  if (orientation === "Landscape") {
    bombArea.style.maxWidth = "50vh";
    document.getElementById("modalGameOver").style.top = "23%";
    document.getElementById("modalStartCountdown").style.top = "20%";
  } else {
    bombArea.style.maxWidth = "500px";
    document.getElementById("modalGameOver").style.top = "20%";
    document.getElementById("modalStartCountdown").style.top = "15%";
  }
  reDrawBombs();
}