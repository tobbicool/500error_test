
/////// This is zooming and panning functionality

window.scale = 1;
window.isPanningAction = false;

var panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.getElementById("fam-tree"),
    zoomContainer = document.querySelector('.fam-tree-container'),
    startTouches = [],
    isScaling,
    lastDeltaY = 0,
    isTrackpad = false,
    detectionLock = false,
    lockDuration = 100, // Duration in milliseconds to lock the detection
    lastDetectionTime = 0;

let lastScrollTime = 0;
let cumulativeDelta = 0;
let firstScrollDetectionMade = false;



// Set initial scale based on screen size
if (window.innerWidth <= 420) {
    window.scale = .7;
    pointX = -3650;
    pointY = 100;
} 
else if (window.innerWidth <= 760) {
    window.scale = 1;
    pointX = -5200;
    pointY = 100;
} else if (window.innerWidth <= 1000) {
    window.scale = 1;
    pointX = -5000;
    pointY = 100;
} else {
    window.scale = 1;
    pointX = -4600;
    pointY = 100;
}

zoom.style.transform = `translate(${pointX}px, ${pointY}px) scale(${window.scale})`;





function setTransform(targetScale = window.scale, targetX = pointX, targetY = pointY, smooth = true) {
    if (smooth && !isTrackpad) {
        let startScale = window.scale;
        let startX = pointX;
        let startY = pointY;

        let step = 0;
        const steps = 20; // Number of steps for smooth transition

        const smoothTransition = () => {
            step++;
            if (step <= steps) {
                window.scale = startScale + (targetScale - startScale) * (step / steps);
                pointX = startX + (targetX - startX) * (step / steps);
                pointY = startY + (targetY - startY) * (step / steps);

                zoom.style.transform = `translate(${pointX}px, ${pointY}px) scale(${window.scale})`;

                requestAnimationFrame(smoothTransition);
            }
        };

        requestAnimationFrame(smoothTransition);
    } else {
        window.scale = targetScale;
        pointX = targetX;
        pointY = targetY;
        zoom.style.transform = `translate(${pointX}px, ${pointY}px) scale(${window.scale})`;
    }
}



function distance(touches) {
    var dx = touches[0].pageX - touches[1].pageX;
    var dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
}


(function () {
    let startTouchTime = 0;

    function startPan(e) {
        isPanningAction = false; // Reset the flag at the start
        if (e.touches) {
            startTouchTime = new Date().getTime();
            startTouches = [...e.touches];
            if (e.touches.length === 1) {
                let touch = e.touches[0];
                start = { x: touch.pageX, y: touch.pageY };
                panning = true;
            } else if (e.touches.length > 1) {
                panning = true;
            }
        } else {
            start = { x: e.clientX, y: e.clientY };
            panning = true;
        }
    }
    

    function movePan(e) {
        if (panning) {
            e.preventDefault();
            isPanningAction = true; // Set the flag if movePan is triggered
            isScaling = false;
    
            if (e.touches && e.touches.length === 2) {
                let newDistance = distance(e.touches);
                if (startTouches.length < 2) return;
                let startDistance = distance(startTouches);
                if (startDistance === 0) return;

                let deltaScale = newDistance / startDistance;
                let proposedScale = scale * deltaScale;
                proposedScale = Math.max(0.8, Math.min(10, proposedScale));
    
                let midpointX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
                let midpointY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
    
                if (proposedScale !== scale) {
                    let scaleChange = proposedScale / scale;
                    pointX = (1 - scaleChange) * midpointX + scaleChange * pointX;
                    pointY = (1 - scaleChange) * midpointY + scaleChange * pointY;
                    scale = proposedScale;
                }
    
                let avgStartX = (startTouches[0].pageX + startTouches[1].pageX) / 2;
                let avgStartY = (startTouches[0].pageY + startTouches[1].pageY) / 2;
                let deltaX = midpointX - avgStartX;
                let deltaY = midpointY - avgStartY;
    
                pointX += deltaX;
                pointY += deltaY;
    
                setTransform();
                startTouches = [...e.touches];
            } else if (e.touches && e.touches.length === 1) {
                let touch = e.touches[0];
                pointX += touch.pageX - start.x;
                pointY += touch.pageY - start.y;
                start = { x: touch.pageX, y: touch.pageY };
                setTransform(window.scale, pointX, pointY, false); // Immediate update for panning
            } else {
                let mouseX = e.clientX;
                let mouseY = e.clientY;
                pointX += mouseX - start.x;
                pointY += mouseY - start.y;
                start = { x: mouseX, y: mouseY };
                setTransform(window.scale, pointX, pointY, false); // Immediate update for panning
            }
        }
    }
    

    function endPan(e) {
        if (e.touches) {
            if (e.touches.length > 0) {
                startTouches = [...e.touches];
                if (e.touches.length == 1) {
                    let touch = e.touches[0];
                    start = { x: touch.pageX, y: touch.pageY };
                }
            } else {
                panning = false;
                startTouches = [];
            }
        } else {
            panning = false;
        }
    }



    function detectTrackPad(e) {
        var now = Date.now();
        if (detectionLock && (now - lastDetectionTime) < lockDuration) {
            // console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected", "(locked)");
            return;
        }

        var deltaYDifference = Math.abs(e.deltaY) - Math.abs(lastDeltaY);
        lastDeltaY = e.deltaY;

        if (e.wheelDeltaY) {
            isTrackpad = Math.abs(e.wheelDeltaY) !== 120;
        } else if (e.deltaMode === 0) {
            isTrackpad = true;
        } else {
            isTrackpad = false;
        }

        if (Math.abs(deltaYDifference) > 0) {
            isTrackpad = true;
        }

        detectionLock = true;
        lastDetectionTime = now;
        setTimeout(() => {
            detectionLock = false;
        }, lockDuration);

        if (!firstScrollDetectionMade) {
            isTrackpad = false; // Assume it's not a trackpad for the first scroll
            firstScrollDetectionMade = true;
        }

        // console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected");
    }



    function onZoom(e) {
        e.preventDefault();

        isScaling = true;

        detectTrackPad(e);

        var xs = (e.clientX - pointX) / window.scale,
            ys = (e.clientY - pointY) / window.scale;

        var delta = e.deltaY * -1; // Inverting deltaY to make the zoom direction intuitive

        var baseZoomSensitivity = isTrackpad ? 0.005 : 0.0035;
        var zoomSensitivity = baseZoomSensitivity;

        if (!isTrackpad) {
            // Track the cumulative delta and time for rapid scrolling detection
            var now = Date.now();
            if (now - lastScrollTime < 100) { // If scrolling rapidly (within 100ms)
                cumulativeDelta += delta;
            } else {
                cumulativeDelta = delta;
            }
            lastScrollTime = now;

            // Adjust sensitivity for rapid scrolling if cumulative delta exceeds a threshold
            var sensitivityThreshold = 300; // Threshold for adjusting sensitivity
            var maxSensitivity = 0.05; // Maximum sensitivity

            if (Math.abs(cumulativeDelta) > sensitivityThreshold) {
                var exponentialFactor = 0.0013; // Exponential factor for sensitivity
                zoomSensitivity = Math.min(baseZoomSensitivity * Math.exp(Math.abs(cumulativeDelta) * exponentialFactor), maxSensitivity);
            }
        }

        var scaleMultiplier = Math.exp(delta * zoomSensitivity);

        var maxScale = 6.0;
        var minScale = 0.1;

        var newScale = window.scale * scaleMultiplier;
        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        var targetX = e.clientX - xs * newScale;
        var targetY = e.clientY - ys * newScale;

        setTransform(newScale, targetX, targetY, true);
    }





    zoomContainer.addEventListener('mousedown', startPan, false);
    zoomContainer.addEventListener('touchstart', startPan, false);
    zoomContainer.addEventListener('mousemove', movePan, false);
    zoomContainer.addEventListener('touchmove', movePan, false);
    zoomContainer.addEventListener('mouseup', endPan, false);
    zoomContainer.addEventListener('touchend', endPan, false);
    zoomContainer.addEventListener('wheel', onZoom, false);
    zoomContainer.addEventListener('mouseleave', function (e) { panning = false; }, false);
    zoomContainer.addEventListener("wheel", detectTrackPad, false);

})(); 