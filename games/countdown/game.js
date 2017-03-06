/* A bomb defusing game.
*Punch in the correct code to stop the bomb from going off.
*Try as many times until the time runs out. Will even give you a hint when your wrong!
*/

//Some variables we need
key = randomNumber();
time = 45;
gameover = false;
var clock;
window.onload = function(){
  input1 = document.getElementById("input1");
  input2 = document.getElementById("input2");
  input3 = document.getElementById("input3");
  clock = document.getElementById("clock");
  clock.innerHTML = "TIME LEFT - 00 : " + time.toString();
  window.setInterval(decreaseClock, 1000);
}

function randomNumber(){
  var max = 1000;
  return Math.floor(Math.random() * max);// 0 <= n < 1.
}

//Controls
function changeDigit(inputID, amount) {
  if (!gameover){
    var input = document.getElementById("input"+inputID);
    var num  = parseInt(input.getAttribute("value"));
    num = num+amount;
    if(num < 0 ){
      num = 9;
    }else if (num > 9) {
      num = 0;
    }
    input.setAttribute("value", num);
    input.src = "led/"+num+".png";
  }
}

function displayLO(){
  input1.src = "led/L.png";
  input2.src = "led/0.png";
  input3.src = "led/-.png";
}

function displayHI(){
  input1.src = "led/H.png";
  input2.src = "led/I.png";
  input3.src = "led/-.png";
}

function resetInputs(){
  input1.src = "led/" + input1.getAttribute('value') + ".png";
  input2.src = "led/" + input2.getAttribute('value') + ".png";
  input3.src = "led/" + input3.getAttribute('value') + ".png";
}

function disarm(){
  if (!gameover){
    var inputKey = parseInt(input1.getAttribute("value")+input2.getAttribute("value")+input3.getAttribute("value"))
    if (inputKey < key){
      displayLO();
      setTimeout(resetInputs, 1500);
    } else if (inputKey > key) {
      displayHI();
      setTimeout(resetInputs, 1500);
    } else{
      alert("thats it!")
      endgame();
    }
  }
}



function decreaseClock(){
  if (!gameover){
    if(time > 0){
      time = time - 1;
      clock.innerHTML = "DETONATION - 00 : " + time.toString();
    } else {
      alert('You Lost!');
      endgame();
    }
  }
}

function endgame(){
  gameover = true;

}
