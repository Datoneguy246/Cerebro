const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
    console.log("Attempting to start stream...");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            console.log(stream);
            video.srcObject = stream;
        })
        .catch(error => {
            // Handle error or permission denial
            console.error("Error obtaining camera stream in background script:", error);
        });
}
video.addEventListener('play', () => {
    const canvas = document.getElementById('c1')
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    mainphase = false
    const text = [
        'Align your face in a comfortable spot in the frame'
    ];
    const anchor = { x: 200, y: 200 }
    let ogx, ogy, ogeyertop, ogeyerbottom
    let ogset = false;
    const mainLoop = async () => {
        if (!mainphase) {
            const drawOptions = {
                anchorPosition: 'TOP_LEFT',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            };
            const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions);
            drawBox.draw(canvas);
            await delay(3000);
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
            landmarks = detections[0].landmarks
            if (!ogset){
                ogx = landmarks._positions[54]._x
                ogy = landmarks._positions[65]._y
                ogset = true;
            }
            
            mainphase = true;
            return;
        }
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        landmarks = detections[0].landmarks
        const xpos = landmarks._positions[54]._x
        const ypos = landmarks._positions[65]._y
        //console.log("ypos: " + ypos)
        const nosebox = { x: xpos, y: ypos, width: 25, height: 25 }
        let drawOptions
        if (ypos-ogy > 10){
            drawOptions = {
                lineWidth: 2,
                boxColor: "red"
            }
            //ScrollVertically(10)
        } else if (ypos-ogy < -10){
            drawOptions = {
                lineWidth: 2,
                boxColor: "green"
            }
            //ScrollVertically(-10)
        }

        const drawBox = new faceapi.draw.DrawBox(nosebox, drawOptions)
        drawBox.draw(document.getElementById('c1'))

    };
    
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    setInterval(mainLoop, 100);
})