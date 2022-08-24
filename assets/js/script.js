// const element = document.getElementById("startTimer");
// let count = 5;
// startInterval = setInterval(startCountdown, 1000);

// function startCountdown(){
//     element.innerHTML = count;
//     count-=1;
//     if (count === -1){  
//     element.innerHTML = "Go!";
//     }
//     if(count === -2){
//         element.innerHTML = "";
//         element.style.display = "none";
//         element.remove();
//         clearInterval(startInterval);
//     }
// }



// -----------------------------------
// function boxClicked(){
//     if(this.style.backgroundColor === "green"){
//     this.style.backgroundColor = "orange";
//     }else{
//          this.style.backgroundColor = "green";
//     }
// }
// let boxes =document.getElementsByClassName("box");
// for (let i of boxes){
//     i.addEventListener("click",boxClicked);
// }

//Method 1 rubbish
// let bomb = {
//      id:1,
//      visRep: document.getElementsByClassName("grid-container")[0].children[0],
//     colorChange: function(){
//        bomb.visRep.style.backgroundColor = "red";
//      }
// };
// document.getElementsByClassName("grid-container")[0].children[0].addEventListener("click",bomb.colorChange);
// function myFunction() {
//     alert ("Hello World!");
//     alert (bomb.visRep.innerHTML);
//   };
//----------------------------

let score = 0;
let bombSpeed = document.getElementById("myRange").value;

let bombs = document.getElementsByClassName("grid-container")[0].children;

for (let bomb of bombs) {
  bomb.style.backgroundColor = "black";
  bomb.fuse = 3;
  bomb.colorChange = function () {
    // this.style.backgroundColor = randomColor(this.fuse);
    this.style.animation = "startBombColor 3s linear 0s 1";
    if (this.fuse === -1) {
      //alert("Game over");
      bomb.removeEventListener("click", bomb.stopBomb);
      this.style.animation = "initial";
      this.style.backgroundColor = "pink";
      this.innerHTML=`<i class="fa-solid fa-burst"></i>`;
      gameOver();
    };
    this.fuse -= 1;
  };
  bomb.stopBomb = function () {
    clearInterval(this.myVar);
    this.fuse = 3;
    console.log(active);
    console.log("we made it : " + this.innerHTML);
    this.style.backgroundColor = "black";
    this.style.animation = "initial";
    console.log(bomb.getAttribute("name"));
    console.log("hello " + active.indexOf(parseInt(bomb.getAttribute("name")) - 1));
    let removeSpace = active.indexOf(parseInt(bomb.getAttribute("name")) - 1);
    if (removeSpace != -1) {
      active.splice(removeSpace, 1);
      score +=1 ;
    }

    
  }
  bomb.ignite = false;
  bomb.addEventListener("click", bomb.stopBomb);

  bomb.endGame = function(){
    clearInterval(this.myVar);
  }

}


let active = [];

document.getElementsByTagName("body")[0].onload = function () {
  gameRun()
};
let mainGame;
function gameRun() {

 mainGame = setInterval(function () {
  document.getElementById("gameScore").innerHTML = score;
    let j;
    if (active.length < 3) {
      do {
        j = Math.floor(Math.random() * 9);
      } while (active.indexOf(j) != -1);
      active.push(j);
      bombs[j].myVar = setInterval(myTimer, bombSpeed, j);
      console.log("run");
    }
  }, 0);
};

function myTimer(i) {
  bombs[i].colorChange();
}
const elementend = document.getElementById("gameOverScreen");
function gameOver(){
elementend.innerHTML = "Game Over";
elementend.style.display = "flex";
for (let bomb of bombs) {
bomb.endGame();
 };
console.log("sass");
  clearInterval(mainGame);
}