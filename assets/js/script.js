let defuseSpeed; // Store the number of bombs popped per second
let light_mode = false; //State of the light mode setting

// Wait for the Dom to finish loading before running the game 
// Open the settings modal to get the user preference for the game
document.addEventListener("DOMContentLoaded", function () {
  let gameSettings_Modal = document.getElementById("modalGameSettings");
  let gameHowTo_Modal = document.getElementById("modalGameHowTo");
  let gameAccess_Modal = document.getElementById("modalGameAccess");
  let gameHighScore_Modal = document.getElementById("modalHighScores");
  firstVisitIntro(gameSettings_Modal, gameHowTo_Modal);
  applyWindowOnClick(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal);
  applyModalClose(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal);
  applyButtonSetup(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal);
  applyOnInput();
  applyOnChange();
  window.onresize = function () {
    getOrientation();
  };
});

function firstVisitIntro(gameSettings_Modal, gameHowTo_Modal) {
  if (sessionStorage.siteVisited) {
    showElement(gameSettings_Modal);
  } else {
    showElement(gameHowTo_Modal);
  }
}

function applyWindowOnClick(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal) {
  window.onclick = function (event) {
    if (event.target.id === "modalGameSettings") {
      hideElement(gameSettings_Modal);
    }
    if (event.target.id === "modalGameHowTo") {
      hideElement(gameHowTo_Modal);
      if (!sessionStorage.siteVisited) {
        showElement(gameSettings_Modal);
        sessionStorage.siteVisited = 1;
      }
    }
    if (event.target.id === "modalGameAccess") {
      hideElement(gameAccess_Modal);
    }
    if (event.target.id === "modalHighScores") {
      hideElement(gameHighScore_Modal);
    }
  };
}

function applyModalClose(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal) {
  document.getElementsByClassName("close_SettingsModal")[0].addEventListener('click', function () {
    hideElement(gameSettings_Modal);
  });
  document.getElementsByClassName("close_HowToModal")[0].addEventListener('click', function () {
    hideElement(gameHowTo_Modal);
    if (!sessionStorage.siteVisited) {
      showElement(gameSettings_Modal);
      sessionStorage.siteVisited = 1;
    }
  });
  document.getElementsByClassName("close_AccessModal")[0].addEventListener('click', function () {
    hideElement(gameAccess_Modal);
  });
  document.getElementsByClassName("close_HighScoresModal")[0].addEventListener('click', function () {
    hideElement(gameHighScore_Modal);
  });
}


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

function sliderMaxAmount() {
  let amountOfBombsSlider = document.getElementById("bombAmount");
  amountOfBombsSlider.max = document.getElementById("col_size").value * document.getElementById("row_size").value;
  document.getElementById("bombAmountValue").innerHTML = amountOfBombsSlider.value;
}

function applyOnInput() {
  let sliders = document.getElementsByTagName("input");
  for (let slider of sliders) {
    switch (slider.getAttribute("data-type")) {
      case "fuseSpeed":
        slider.addEventListener("input", function () {
          document.getElementById("fuseSpeedValue").innerHTML = slider.value;
        });
        break;
      case "bombAmount":
        slider.addEventListener("input", function () {
          document.getElementById("bombAmountValue").innerHTML = slider.value;
        });
        break;
      case "gameCountdownTime":
        slider.addEventListener("input", function () {
          document.getElementById("gameCountdownTimeValue").innerHTML = slider.value;
        });
        break;
      case "gameLevel":
        slider.addEventListener("input", function () {
          document.getElementById("gameLevelValue").innerHTML = slider.value;
        });
        break;
      case "game_Volume":
        slider.addEventListener("input", function () {
          playFuseSound("explode");
        });
        break;
      case "sound_On_Btn":
        slider.addEventListener("input", toggleSoundElement);
        break;
      case "lightmode_Btn":
        slider.addEventListener("input", setlightmode);
        break;
    }
  }
}

function toggleSoundElement() {
  if (document.getElementById("sound_On_Btn").checked === true) {
    playFuseSound("explode");
    showElement(document.getElementById("volume_Section"));
  } else {
    hideElement(document.getElementById("volume_Section"));
  }
}

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

function applyButtonSetup(gameSettings_Modal, gameHowTo_Modal, gameAccess_Modal, gameHighScore_Modal) {
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
          if (light_mode) {
            this.children[0].style.color = "black";
          } else {
            this.children[0].style.color = "white";
          }
        } else if (isPaused === 0) {
          isPaused = 1;
          this.children[0].style.color = "darkgoldenrod";
        } else {}
      } else if (this.getAttribute("id") === "resetGameOver") {
        checkGameState();
        showElement(gameSettings_Modal);
      } else if (this.getAttribute("id") === "viewHighScoresBtn") {
        loadHighScores();
        showElement(gameHighScore_Modal);
      } else if (this.getAttribute("id") === "endGame") {
        if (light_mode) {
          document.getElementById("pauseGame").children[0].style.color = "black";
        } else {
          document.getElementById("pauseGame").children[0].style.color = "white";
        }
        endGame();
      } else if (this.getAttribute("id") === "endCurrentGameBtn") {
        if (light_mode) {
          document.getElementById("pauseGame").children[0].style.color = "black";
        } else {
          document.getElementById("pauseGame").children[0].style.color = "white";
        }
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
      } else if (this.getAttribute("id") === "lets_Play_Btn") {
        hideElement(gameHowTo_Modal);
        showElement(gameSettings_Modal);
        sessionStorage.siteVisited = 1;
      } else if (this.getAttribute("id") === "startGameBtn") {
        let gameSettings;
        score = 0;
        document.getElementById("thePlayerScore").innerHTML = 0;
        document.getElementById("gameScore").innerHTML = 0;
        document.getElementById("gameScore").classList.remove("hsGold");
        gameSettings = getModalInformation(gameSettings_Modal);
        drawGameGrid(gameSettings.x, gameSettings.y);
        startGame(gameSettings);
        hideElement(gameSettings_Modal);
      } else if (this.getAttribute("id") === "showhighScoreBtn") {
        loadHighScores();
        showElement(gameHighScore_Modal);
      } else if (this.getAttribute("id") === "newHSButton") {
        addNewHighScore();
      } else if (this.getAttribute("id") === "sortbyScore") {
        sortHS(1);
      } else if (this.getAttribute("id") === "sortbyBPS") {
        sortHS(2);
      } else if (this.getAttribute("id") === "sortbyDate") {
        sortHS(3);
      } else if (this.getAttribute("id") === "resetHSScores") {
        localStorage.removeItem("hsArray");
      } else if (this.getAttribute("id") === "firstPlayButton") {
        checkGameState();
        showElement(gameSettings_Modal);
      }
    });
  }
}

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
function getModalInformation(element) {
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

function convertGameSpeed(speed) {
  switch (speed) {
    case 0:
      return 10;
    case 1:
      return 9;
    case 2:
      return 8;
    case 3:
      return 7;
    case 4:
      return 6;
    case 5:
      return 5;
    case 6:
      return 4;
    case 7:
      return 3;
    case 8:
      return 2;
    case 9:
      return 1;
    case 10:
      return 0;
  }
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
  </div>`;
  }
  gridContainer.innerHTML = htmlString;
}

function startGame(gameSettings) {
  getOrientation();
  hideElement(document.getElementById("modalGameOver"));
  isPaused = 0;
  gameStartCountdown(gameSettings);
}
/**
 * Will count down from time to 0 and will start the game
 * @param {The number you want the countdown to start at } time 
 */
function gameStartCountdown(gameSettings) {
  let count = gameSettings.countdownStartNumber;
  let startInterval = setInterval(timeCountDown, 1000);

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
let bombs = document.getElementsByClassName('bomb_icon');
let score = 0;
let isPaused = 3;
let startTime = 0;
/**
 * the game fucntion with all; the key information for the game to run
 * @param { settings array contains the settings for the game - x: x_size,y: y_size,l: speed of bombs ,noBombs: number of bombs active at one go ,countdownStartNumber: how long the start countdown shoudl be } gameSettings
 */
function game(gameSettings) {
  startTime = new Date();
  score = 0;
  let numberOfBombs = gameSettings.x * gameSettings.y; // 4 * 4 = 16
  let fuseLength = gameSettings.l * 10; // 30
  let numberOfLiveBombs = gameSettings.noBombs; // 3
  let gameSpeed = gameSettings.speed * 100; //5
  let active = [];
  let fuseInMs = fuseLength * 100;
  let fuseInS = fuseLength / 10;
  let randomBombNumber;
  let gameOverFlag = false;
  let topScore = getTopScore();
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
        setBombFuse(bombs[randomBombNumber], fuseInS);
        bombs[randomBombNumber].bombTimer = setTimeout(bombExplode, fuseInMs, bombs[randomBombNumber]);
      }
      active = updateActiveBombs(active);
      gameOverFlag = checkForExploded(active);
      if (gameOverFlag) {
        clearInterval(gameTick);
        gameOver(active);
        isPaused = 3;
        defusePerSecond();
        return;
      }
      updateScore(score, topScore);
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
      defusePerSecond();
      return;
    }
  }, gameSpeed);
}

function defusePerSecond() {
  startTime = new Date() - startTime;
  defuseSpeed = score / (startTime / 1000);
}
/**
 * This checks to see what bombs have been defused and removes them from the active bombs array. 
 * @param {number array - which links to the index number of the bombs that are currently ignited} active 
 * @returns a new array with all the bombs that hve been defused removed
 */
function updateActiveBombs(active) {
  let newActive = [];
  for (let x of active) {
    if (bombs[x].desfuse === false) {
      newActive.push(x);
    }
  }
  return newActive;
}

function checkForExploded(active) {
  for (let x of active) {
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
  bomb.desfuse = false;
  bomb.blown = false;
  bomb.style.animation = `startBombColor ${fuseInS}s ease 0s 1`;
}

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
 * defuses the bomb that has been clickeed by the user by clearing the timeout and removing the event listener
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
 * Registers the bom,b has exploded and changes it style to show the user the bomb has exploded
 * @param {the bomb that has exploded} bomb 
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

function endGame() {
  isPaused = 3;
}
/**
 * show the gameover screen to the user
 */
function gameOver(active) {
  for (let x of active) {
    bombs[x].removeEventListener('click', defuseBombFuse);
    bombs[x].style.animation = "";
    clearTimeout(bombs[x].bombTimer);
  }
  checkHighScore();
  showElement(document.getElementById("modalGameOver"));
}

function getTopScore() {
  let arr = JSON.parse(localStorage.getItem('hsArray'));
  if (arr === null) {
    return 0;
  } else {
    return arr[0][1];
  }
}

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

function getTodaysDate() {
  let currentDate = new Date();
  return currentDate.toLocaleDateString();
}

function sentanceCaseText(str) {
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

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
      for (let i = 0; i < arr.length; i++) {
        if (score > arr[i][1]) {
          insertPos = i;
          break;
        }
      }
      if (insertPos === null) {
        insertPos = arr.length;
      } else {
        let j = arr.length - 1;

        if (j < 9) {
          arr[j + 1] = arr[j];
        }

        do {
          arr[j] = arr[j - 1];
          j--;
        } while (j > insertPos);
      }
      arr[insertPos] = [hSName, hSScore, hSTime, todaysDate];
    } else {
      arr = [
        []
      ];
      arr[0] = [hSName, hSScore, hSTime, todaysDate];
    }
    hideElement(document.getElementById("newHSInput"));
    showElement(document.getElementById("hsAcceptMessage"));
    localStorage.setItem('hsArray', JSON.stringify(arr));
    loadHighScores();
    showElement(document.getElementById("modalHighScores"));
    document.getElementById("newHSName").value = "";
  } else {
    document.getElementById("newHSName").classList.add("missingName");
  }
}

function updateScore(score, hs) {
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
  if (score > hs) {
    scoreArea.classList.add("hsGold");
    scoreAreaGameOver.style.color = "gold";
  }
}

function loadHighScores() {
  let HSArr = JSON.parse(localStorage.getItem('hsArray'));
  loadHSTable(HSArr);
}

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

function reDrawBombs() {
  $('.bomb_icon').flowtype({
    fontRatio: 1
  });
}

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