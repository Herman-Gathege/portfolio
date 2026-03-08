let slideIndex = 0;

const slides = document.querySelectorAll(".slides");
const dots = document.querySelectorAll(".dot");

function showSlide(index){

slides.forEach(s => s.classList.remove("active"));
dots.forEach(d => d.classList.remove("active"));

slides[index].classList.add("active");
dots[index].classList.add("active");

slideIndex = index;
}

function nextSlide(){

slideIndex++;

if(slideIndex >= slides.length){
slideIndex = 0;
}

showSlide(slideIndex);
}

function prevSlide(){

slideIndex--;

if(slideIndex < 0){
slideIndex = slides.length - 1;
}

showSlide(slideIndex);
}

showSlide(0);