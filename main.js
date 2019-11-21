"use strict"
var Start = document.querySelector(".start")
var Main = document.querySelector("#main")
var RulesBtn = document.querySelector(".rls")
var Rules = document.querySelector(".rules")
var RulesText = document.querySelector(".text")
var End = document.querySelector(".loose")
var Line = document.createElement("div")
var Snake;
var Mouse;
var Direction;
var Score = 0;
var Bonus = 1;
var Boss;
var TimerInterval;
var Smove; // setInterval for snake move
var GameStarted = false;
var StartMove = false;
var Move = false;
//проверить еще раз мышь и босса

// ---------------------------------------------- 
// Rules Button
// ---------------------------------------------- 
RulesBtn.addEventListener("click", openRules)
var opened = false;
function openRules() {
    
    var intrvl;
    var width = 0;
    if(!opened){
        intrvl = setInterval( rlsOpen , 0.1)
        opened = true;
    }else if(opened){
         RulesText.style.display = "none"
         Rules.style.display = "none"
         opened = false
    }

    function rlsOpen (){
        Rules.style.display = "block"
        Rules.style.width = width + "px";
        Rules.style.height = width + "px";
        width+=3
        if(width > 300){
             RulesText.style.display = "block"
             clearInterval(intrvl)
        }
    }
}




// ---------------------------------------------------------------------------- 
// make cells
// ---------------------------------------------------------------------------- 
for(var i = 0; i<400; i++){
var cells = document.createElement('div')
Main.appendChild(cells)
cells.setAttribute("class", "cell")
}

//defining positon for each cell
var Cell = document.querySelectorAll(".cell")
var x = 0;
var y = 0;

for(var i = 0; i <  Cell.length; i++){
    if(x > 19){
        x=0
        y++
    }
    Cell[i].setAttribute("posX", x)
    Cell[i].setAttribute("posY", y)
    x++
}
//end  


// ---------------------------------------------------------------------------- 
//creating a new game
// ---------------------------------------------------------------------------- 
Start.addEventListener("click", startGame)

function startGame(){
    if(!GameStarted){
        End.style.display = "none"
        Score = 0;
        removeSnake();
        generateSnake();
        generateMouse();
        Smove = setInterval(snakeMove, 100)
        GameStarted = true
    }
}


// ---------------------------------------------------------------------------- 
// Snake code
// ---------------------------------------------------------------------------- 
function generateSnake(){
    var coordinates = snakeCoordinates()
    Snake = [document.querySelector("[posX = '" + coordinates[0] + "'][posY ='" + coordinates[1] +"']"), document.querySelector("[posX = '" + (coordinates[0]-1) + "'][posY ='" + coordinates[1] +"']"), document.querySelector("[posX = '" + (coordinates[0]-2) + "'][posY ='" + coordinates[1] +"']")]
    makeSnake()
}

function snakeCoordinates(){
    var posX = Math.floor((Math.random()*17)+2);
    var posY = Math.floor(Math.random()*19);
    return [posX, posY]
}

function makeSnake(){    
    Snake[0].classList.add("head")
    for(var i = 0; i< Snake.length; i++){
        Snake[i].classList.add("body")
    }   
}

function removeSnake(){
    for(var i = 0; i< Cell.length; i++){
            Cell[i].classList.remove("head");
            Cell[i].classList.remove("body");
    }
}

function snakeMove(){
    var coordinates = [Snake[0].getAttribute("posX"), Snake[0].getAttribute("posY")]
    
    if(StartMove){
        Snake[0].classList.remove("head")
        Snake[Snake.length-1].classList.remove("body")
        Snake.pop()
        if(Direction == "right"){
            if(coordinates[0]<19){
                 snakePosition(( + coordinates[0] +1 ), coordinates[1])
            }else{
                 snakePosition(0, coordinates[1])
            }
        }else if(Direction == "left"){
            if(coordinates[0]>0){
                 snakePosition(( + coordinates[0] -1 ), coordinates[1])
            }else{
                 snakePosition( 19 ,  coordinates[1])
            }
        }else if(Direction == "up"){
            if(coordinates[1]>0){
                 snakePosition(coordinates[0], (+ coordinates[1] - 1))
            }else{
                 snakePosition( coordinates[0],  19)
            }
        }else if(Direction == "down"){
            if(coordinates[1]<19){
                snakePosition(coordinates[0], (+ coordinates[1] + 1))
            }else{
                snakePosition(coordinates[0], 0)
            }
        }
    }
        
    if(Snake[0].classList.contains("mouse")){
        Snake.unshift(document.querySelector("[posX = '" + Mouse.getAttribute("posX") + "'][posY ='" + Mouse.getAttribute("posY") +"']"))
        Mouse.classList.remove("mouse")
        generateMouse()
        Score++;
        Bonus++;
    }
    
    if(Bonus % 6 == 0 && Bonus != 0){
        generateBonus()
        var bonus = setTimeout(removeBonus,5000)
        Bonus++
    }
    
    if(Snake[0].classList.contains("boss")){
        removeBonus()
        Score += 5
    }
    
    if(Snake[0].classList.contains("body")  && StartMove){
        Mouse.classList.remove("mouse")
        Direction = null;
        clearInterval(Smove)
        GameStarted = false
        StartMove = false;
        End.style.display = "block"
        End.innerHTML = "<br><br>Game OVER.<br>Your Score: " + Score
    }
    
    Move = false
    document.getElementById("score").innerText = Score
    makeSnake()   
}
//end Snake Move

function snakePosition(posX, posY){
     Snake.unshift(document.querySelector("[posX = '" +posX + "'][posY ='" + posY +"']"))
}

// ---------------------------------------------------------------------------- 
//  end   Snake code 
// ---------------------------------------------------------------------------- 



// ---------------------------------------------------------------------------- 
//  Mouse Code
// ---------------------------------------------------------------------------- 
 function generateMouse(){
     function generate(){
         var posX = Math.floor(Math.random()*19);
         var posY = Math.floor(Math.random()*19);
         return [posX, posY]
     }
     
     var mouseCoordinates = generate()
     
     Mouse = document.querySelector("[posX = '" + mouseCoordinates[0] + "'][posY ='" + mouseCoordinates[1] +"']")
     while(Mouse.classList.contains("body") || Mouse.classList.contains("head") ){
         mouseCoordinates = generate()
        Mouse = document.querySelector("[posX = '" + mouseCoordinates[0] + "'][posY ='" + mouseCoordinates[1] +"']")
         console.log("win?")
     }
      Mouse.classList.add("mouse")
 }



// ---------------------------------------------------------------------------- 
//  Bonus  code
// ---------------------------------------------------------------------------- 
function generateBonus(){
     function generate(){
         var posX = Math.floor((Math.random()*15)+2);
         var posY = Math.floor((Math.random()*15)+2);
         return [posX, posY]
     }
    var bonusCoordinates = generate()
    bossCoordinates(bonusCoordinates[0], bonusCoordinates[1])
    for(var i = 0; i<Boss.length; i++){
        while(Boss[i].classList.contains("mouse") || Boss[i].classList.contains("body") || Boss[i].classList.contains("head")){
            bonusCoordinates = generate()
            bossCoordinates(bonusCoordinates[0], bonusCoordinates[1])
			console.log("win?Bonus")
        }
    }
    for(var i = 0; i<Boss.length; i++){
        Boss[i].classList.add("boss")
    }
	
	timer()
	var w = 6
	function timer (){
		Line.setAttribute("class", "line")
		main.appendChild(Line)
		TimerInterval = setInterval(fff, 25)
		function fff(){
		Line.style.width = w + "px";
		w+= 3
		}
	}
}

function bossCoordinates(x, y){
    Boss = [document.querySelector("[posX = '" + x + "'][posY ='" + y +"']"),document.querySelector("[posX = '" + ( + x - 1) + "'][posY ='" + (+ y - 1) +"']"),document.querySelector("[posX = '" + ( + x -1) + "'][posY ='" + y +"']"),document.querySelector("[posX = '" + x + "'][posY ='" + ( + y - 1) +"']")]
}

function removeBonus(){
     for(var i = 0; i<Boss.length; i++){
        Boss[i].classList.remove("boss")
       }
	var clear = clearInterval(TimerInterval)
	Line.classList.remove("line")
}

    
// ---------------------------------------------------------------------------- 
//  arrow buttons
// ---------------------------------------------------------------------------- 
   window.addEventListener("keydown", function defineDirection(e){
        var key = e.keyCode;
        if(Move == false){
            if(key == 39&& Direction != "left"){
            Direction = "right"
                StartMove = true
        }else if(key == 40 && Direction != "up"){
            Direction = "down"
            StartMove = true
        }else if (key == 37 && Direction != "right"){
            Direction = "left"
        }else if (key == 38 && Direction != "down"){
            Direction = "up"
            StartMove = true
        }
            Move = true
        }
    })