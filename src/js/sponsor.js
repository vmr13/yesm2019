function replaceImage(oldImg, newImgUrl) {
    const newImg = new Image();
    newImg.onload = function() {
        oldImg.parentNode.insertBefore(newImg, oldImg);
        oldImg.style.opacity = '0';
    }
    newImg.alt = oldImg.alt;
    newImg.className = oldImg.className;
    newImg.src = newImgUrl;
}

document.addEventListener('DOMContentLoaded', (e) => {
    var lazyImages = document.getElementsByClassName('lazy');
    for(var i=0; i<lazyImages.length; ++i) {
        const oldImg = lazyImages[i];
        console.log(oldImg.clientWidth);
        replaceImage(lazyImages[i], '/img/sponsors/' + oldImg.dataset.src);
    }
});
