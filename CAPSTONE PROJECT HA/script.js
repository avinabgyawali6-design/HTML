const image = [
    't1-700x550.jpeg', 't2-700x550.jpeg', 't3-700x550.jpeg',
];

let current = 0;

const slidering = document.getElementById("slider-img");

function showslide(index) {
    slidering.src = image[index];
}

function prevslide() {
    current = (current - 1 + image.length) % image.length;
    showslide(current)
}

function nextslide() {
    current = (current + 1) % image.length;
    showslide(current)
}

setInterval(nextslide, 2000);
