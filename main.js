flashLight = document.getElementById("flash-light");

document.getElementById("container").addEventListener("mousemove", function (e){
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    flashLight.style.left = x + 'px';
    flashLight.style.top = y + 'px';
    
    flashLight.style.opacity = '1';
    isMouseInside = true;
})