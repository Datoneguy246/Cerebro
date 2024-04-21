const video = document.getElementById('video')
const canvas = document.getElementById('c1')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo)

function scrollXOn() {
    return document.body.scrollWidth > document.documentElement.clientWidth;
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            // Handle error or permission denial
            console.error("Error obtaining camera stream in background script:", error);
        });
}

var toggler = document.getElementById('mySwitch');
let running = true;
toggler.addEventListener('change', function () {
    running = !running;
    video.hidden = !running;
    canvas.hidden = !running;
    if (!running) {
        document.body.style.height = '50px'; // Reduce the height to 50px
    } else {
        document.body.style.height = ''; // Reset to default height
    }
})

video.addEventListener('play', () => {
    document.body.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize)
    mainphase = false
    const text = [
        'Align your face in a comfortable spot in the frame'
    ];
    const anchor = {
        x: 10,
        y: 30
    }
    let ogx, ogy
    let ogEyeHeight;
    const mainLoop = async () => {
        if (running) {
            if (!mainphase) {
                const drawOptions = {
                    anchorPosition: 'TOP_LEFT',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    fontSize: 25
                };
                const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions);
                drawBox.draw(canvas);
                await delay(3000);
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
                landmarks = detections[0].landmarks
                ogx = landmarks._positions[30]._x
                ogy = landmarks._positions[30]._y
                ogEyeHeight = Math.abs(landmarks._positions[24].y - landmarks._positions[44].y);
                mainphase = true;
                return;
            }
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            landmarks = detections[0].landmarks
            const xpos = landmarks._positions[30]._x
            const ypos = landmarks._positions[30]._y
            const box = {
                x: xpos + 20,
                y: ypos - 120,
                width: 25,
                height: 25
            }
            let drawOptions
            if (ypos - ogy > 10) {
                drawOptions = {
                    lineWidth: 2,
                    boxColor: "red"
                }
                ScrollVertically(10)
            } else if (ypos - ogy < -10) {
                drawOptions = {
                    lineWidth: 2,
                    boxColor: "green"
                }
                ScrollVertically(-10)
            }

            // const targetHeight = ogEyeHeight * 1.2;
            // let lEyeHeight = Math.abs(landmarks._positions[19].y - landmarks._positions[37].y);
            // let rEyeHeight = Math.abs(landmarks._positions[24].y - landmarks._positions[44].y);
            // let avg = (lEyeHeight + rEyeHeight) / 2;
            // if (avg > targetHeight) {
            //     SelectNext();
            // } else if (avg < ogEyeHeight * 0.95) {
            //     SelectPrev();
            // }
            // if (rEyeHeight > targetHeight) {
            //     SelectPrev();
            // }

            /*
            if (scrollXOn){
                console.log("reached")
                if (xpos-ogx > 8){
                    ScrollHorizontally(-5)
                } else if (xpos-ogx < -8){
                    ScrollHorizontally(5)
                }
            }
            */

            const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
            drawBox.draw(document.getElementById('c1'))

            const rdist1 = Math.sqrt(((landmarks._positions[38].y) - (landmarks._positions[42].y)) ** 2 + ((landmarks._positions[38].x) - (landmarks._positions[42].x)) ** 2)
            const rdist2 = Math.sqrt(((landmarks._positions[37].y) - (landmarks._positions[40].y)) ** 2 + ((landmarks._positions[37].x) - (landmarks._positions[40].x)) ** 2)
            const rdist3 = Math.sqrt(((landmarks._positions[39].y) - (landmarks._positions[41].y)) ** 2 + ((landmarks._positions[39].x) - (landmarks._positions[41].x)) ** 2)

            const RAR = (rdist1 + rdist2) / (2 * rdist3)

            const ldist1 = Math.sqrt(((landmarks._positions[44].y) - (landmarks._positions[48].y)) ** 2 + ((landmarks._positions[44].x) - (landmarks._positions[48].x)) ** 2)
            const ldist2 = Math.sqrt(((landmarks._positions[43].y) - (landmarks._positions[46].y)) ** 2 + ((landmarks._positions[43].x) - (landmarks._positions[46].x)) ** 2)
            const ldist3 = Math.sqrt(((landmarks._positions[45].y) - (landmarks._positions[47].y)) ** 2 + ((landmarks._positions[45].x) - (landmarks._positions[47].x)) ** 2)

            const LAR = (rdist1 + rdist2) / (2 * rdist3)

            console.log("LAR:" + LAR)
            console.log("RAR:" + RAR)
            if (LAR < 0.2 && RAR > 0.2) {
                console.log("Left wink")
            } else if (LAR > 0.2 && RAR < 0.2) {
                console.log("Right wink")
            }
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    setInterval(mainLoop, 100);
})