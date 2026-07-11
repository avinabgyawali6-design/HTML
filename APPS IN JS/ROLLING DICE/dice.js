var dices = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];
var stopped = true;

//for keep on changing emoji
function change(){
    var random = Math.floor(Math.random() * 6);
    dice.innerHTML = dices[random];
}

function stopstart(){
  if (stopped)

  {
    stopped = false;
    t=setInterval(change,1000);
  }

  else {
    stopped = true;
    clearInterval(t);
  }
}

//invoking the function
window.onload = function()
{
    dice =document.getElementById("dice");
    stopstart();
}