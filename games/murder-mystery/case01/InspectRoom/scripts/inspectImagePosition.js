/*
Javascript that assist locating coordinates in image for mapping
NOTE: Not intended to be attached to html, paste into console

//Instructions:
1. Open Developer's console in Chrome
2. Copy/Paste code into console
3. Scroll across your image to get (x,y) coordinates you desire.
   The coordinates will print in the console window
*/

document.onmousemove = function(e){
var x = e.pageX;
var y = e.pageY;
console.log("X is "+x+" and Y is "+y);
};