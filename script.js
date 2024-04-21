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
    let landmarks
    const mainLoop = async () => {
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
            x: xpos - 80,
            y: ypos + 20,
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
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    setInterval(mainLoop, 100);

    let prev = 1.0
    setInterval(function() {
        const rdist1 = faceapi.euclideanDistance([landmarks._positions[38].x, landmarks._positions[38].y,], [landmarks._positions[40].x, landmarks._positions[40].y,])
        const rdist2 = faceapi.euclideanDistance([landmarks._positions[36].x, landmarks._positions[36].y,], [landmarks._positions[39].x, landmarks._positions[39].y,])
        const rdist3 = faceapi.euclideanDistance([landmarks._positions[37].x, landmarks._positions[37].y,], [landmarks._positions[41].x, landmarks._positions[41].y,])

        //console.log("r1: " , rdist1)
        //console.log("r2: " , rdist2)
        //console.log("r3: " , rdist2)

        const RAR = (rdist1 + rdist3) / (2.0 * rdist2)
        //console.log("RAR: ", RAR)
        const ldist1 = faceapi.euclideanDistance([landmarks._positions[43].x, landmarks._positions[43].y,], [landmarks._positions[47].x, landmarks._positions[47].y,])
        const ldist2 = faceapi.euclideanDistance([landmarks._positions[42].x, landmarks._positions[42].y,], [landmarks._positions[45].x, landmarks._positions[45].y,])
        const ldist3 = faceapi.euclideanDistance([landmarks._positions[44].x, landmarks._positions[44].y,], [landmarks._positions[46].x, landmarks._positions[46].y,])

        const LAR = (ldist1 + ldist3) / (2.0 * ldist2)

        //console.log("LAR:" + LAR)
        console.log ("Ratio: " + LAR/RAR);
        if (LAR / RAR > 1.023 && prev > 1.023) {
            SelectNext()
        } else if (LAR / RAR < 1 && prev < 1) {
            SelectPrev()
        }
        prev = LAR / RAR
    }, 300)

})