var index=0;
   carousel();
   function carousel()
   {
       var i;
       document.getElementsByClassName("myslide");
       for(i=0; x<i.length; i++)
       {
        x[i].style.display = "none" ;
       }
       index++;
       if (index>x.length)
       {
        index=1;
       }

       x[index-1].style.display="block";
       setTimeout,(carousel,1000);
   }
