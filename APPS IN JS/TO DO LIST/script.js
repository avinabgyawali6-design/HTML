var myform = document.getElementById("myform");
var myinput = document.getElementById("list");
var myitem = document.getElementById("myitem");

myform.addEventListener("submit",function(event){
    event.preventDefault()
    createItem(myinput.value)
})
function createItem(inputItems){
var items =`<li>${inputItems}
<button onclick="deleteElement(this)">delete</button></li>`
myitem.insertAdjacentHTML("beforeend",items)
myinput.value=""
myinput.focus()} 

function deleteElement(Element) {
    Element.parentElement.remove()
}
