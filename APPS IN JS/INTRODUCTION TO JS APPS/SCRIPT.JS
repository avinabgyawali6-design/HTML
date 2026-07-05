var choice = prompt("welcome to area calculator \n 1.area of rectangle \n 2.area of triangle \n 3.area of circle \n 4.area of parellogram");

if (choice == '1') {
    var l = prompt("enter the breadth")
    var b = prompt("enter the length")
    var result = Number(l) * Number(b)
    alert('the area is ' + result)
}

if (choice == '2') {
    var h = prompt("enter the height")
    var ba = prompt("enter the base")
    var result = Number(h) * Number(ba) / 2
    alert('the area is' + result)
}

if (choice == '3') {
    var r = prompt("enter the radius")
    var result = 3.14 * Number(r) * Number(r)
    alert('the area is' + result)
}

if (choice == '4') {
    var h = prompt("enter the height")
    var cb = prompt("enter the corresponding base")
    var result = Number(h) * Number(cb)
    alert('the area is' + result)
}