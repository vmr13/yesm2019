var main = null;
var offsets = [];
var currentIndex = 0;
var snapping = false;

function scroll_to() {
    var str ='translateY(-'+offsets[currentIndex]+'px)';
    main.style.transform = str;
    window.setTimeout(() => {
        snapping=false;
    }, 400);
}

function scroll_to_first() {
    if (currentIndex !== 0) {
        currentIndex = 0;
        scroll_to();
    } else {
        snapping = false;
    }
}

function scroll_to_last() {
    if (currentIndex !== offsets.length-1) {
        currentIndex = offsets.length-1;
        scroll_to();
    } else {
        snapping = false;
    }
}

function scroll_down() {
    if (currentIndex < offsets.length-1) {
        ++currentIndex;
        scroll_to();
    } else {
        snapping = false;
    }
}

function scroll_up() {
    if (currentIndex > 0) {
        --currentIndex;
        scroll_to();
    } else {
        snapping = false;
    }
}

function get_section_offsets() {
    var sections = document.getElementsByTagName('section');
    offsets = [];
    for(var i = 0; i < sections.length; ++i) {
        offsets.push(sections[i].offsetTop);
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    main = document.getElementById('main');
    get_section_offsets();
    var logo = document.getElementById('hero-logo');
    main.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!snapping) {
            snapping = true;
            if (e.deltaY > 2)
                scroll_down();
            else if (e.deltaY < -2)
                scroll_up();
            else
                snapping = false;
        }
    });
    window.addEventListener('keydown', (e) => {
        if (!snapping) {
            snapping = true;
            if (e.which == 40 || e.which == 34) {
                e.preventDefault();
                scroll_down();
            } else if (e.which == 38 || e.which == 33) {
                e.preventDefault();
                scroll_up();
            } else if (e.which == 36) {
                e.preventDefault();
                scroll_to_first();
            } else if (e.which == 35) {
                e.preventDefault();
                scroll_to_last();
            } else {
                snapping = false;
            }
        } else {
            e.preventDefault();
        }
    });
    var touch_startY = null;
    window.addEventListener('touchstart', (e) => {
        if (snapping)
            return;
        touch_startY = e.touches[0].screenY;
    });
    window.addEventListener('touchmove', (e) => {
        if (snapping || touch_startY === null)
            return;
        var touchY = e.touches[0].screenY;
        if (Math.abs(touchY-touch_startY) > 10) {
            snapping = true;
            if (touchY - touch_startY < 0)
                scroll_down();
            else
                scroll_up();
            touch_startY = null;
        }
    });
    window.addEventListener('resize', (e) => {
        get_section_offsets();
        snapping = true;
        scroll_to();
    });
    logo.addEventListener('load', (e) => {
        var svgDoc = logo.contentDocument,
            rects = svgDoc.getElementsByTagName('rect'),
            paths = svgDoc.getElementsByTagName('path'),
            line_stagger = 200, line_duration = 800,
            char_duration = 500,
            rect_anim_time = line_stagger*(rects.length-1) + line_duration,
            svg_anim_time = rect_anim_time + char_duration*paths.length;
        var add_class = (elem, className, delay) => {
            window.setTimeout(() => {
                elem.classList.add(className)
            }, delay);
        }
        for(var i=0; i<rects.length; ++i) {
            rects[i].setAttribute('visibility', 'hidden');
            add_class(rects[i], 'svg-rect', i*line_stagger);
        }
        for(var i=0; i<paths.length; ++i) {
            paths[i].setAttribute('visibility', 'hidden');
            add_class(paths[i], 'svg-path', rect_anim_time+10+i*char_duration);
        }
        var style = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.innerHTML = `.svg-rect{visibility:visible;animation:scaleRect 0.8s ease-in-out;-moz-animation:scaleRect 0.8s ease-in-out;}@keyframes scaleRect{from{height:0;}}.svg-path{visibility:visible;animation:animPath 0.5s ease-in-out;}@keyframes animPath{from{opacity:0;}}`;
        svgDoc.children[0].appendChild(style);
        window.setTimeout(() => {
            var div = document.getElementById('hero-text');
            div.style.transform = 'none';
            div.style.opacity = 1;
        }, svg_anim_time+10);
    });
});
