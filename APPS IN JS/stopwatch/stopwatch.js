window.onload = function(){
    var second = 0;
    var ms = 0;
    var appendmillisecond = document.getElementById("ms");
    var appendsecond = document.getElementById("second");
    var buttonstart = document.getElementById("start-button");
    var buttonstop = document.getElementById("stop-button");
    var buttonreset = document.getElementById("reset-button");
    var Interval = 0;


    buttonstart.onclick = function()
    {
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
    }

    buttonstop.onclick = function () {
        clearInterval(Interval);   
    }

    buttonreset.onclick = function () {
        clearInterval(Interval);
        ms = "00";
        second = "00";
        appendmillisecond.innerHTML = ms;
        appendsecond.innerHTML = second;
    }






function startTimer()
{
   ms++;
   if(ms <=9)
   {
    appendmillisecond.innerHTML= "0" + ms;
   }

    if (ms > 9) {
        appendmillisecond.innerHTML = ms;
    }

    if (ms > 99) {
        second++;
        appendsecond.innerHTML = "0" + second;
        ms = 0;
        appendmillisecond.innerHTML = "0" + "0";
    }
    
    if (second > 9) {
        appendsecond.innerHTML = second;
    }
    }
}
