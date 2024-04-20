/*

function setup(){   //add a parameter to this function that represents the canvas video feed
    let countdown = 5;
    let starttime = new Date().getTime();
    let elapsed = 1000;

    const intervalId = setInterval(() => {
        //display some text on the canvas element that says "align your nose with the line"
        //draw that line on the canvas
    
        const currtime = new Date().getTime();
    
        if ((currtime - starttime) > elapsed) {
            console.log(countdown);
            countdown -= 1;
            elapsed += 1000;
        }
    
        if (countdown === 0) {
            clearInterval(intervalId);
        }
    }, 100);
}

async function scroll(){
    
    let landmarks = await faceapi.detectFaceLandmarks(camera); //faceImage should be the canvas image
    let nose = landmarks.positions[33];
    //^this is an array of Points, which have an x and y field
    const ogpos = nose;
    var x1, x2, y1, y2;
    while(true){
        landmarks = await faceapi.detectFaceLandmarks(camera);
        nose = landmarks.positions[33];
        x1 = nose.getx - 10;
        x2 = nose.getx + 10;
        y1 = nose.gety - 20;
        y2 = nose.gety;
        if (y2 > ogpos){ //scroll down
            //cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 1); 
            //pyautogui.scroll(-10)
      } else if (y2 < ogpos - 30){ //scroll up
            //cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 1)
            //pyautogui.scroll(10)
      } else {
            //cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 1)
      }
      //break out of the loop by checking toggle
    }
}

*/

const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
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
    let ogx, ogy
    const mainLoop = async () => {
        if (!mainphase) {
            for (let i = 0; i < 3; i++) {
                const drawOptions = {
                    anchorPosition: 'TOP_LEFT',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                };
                const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions);
                drawBox.draw(canvas);
                await delay(1000);
            }
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
            landmarks = detections[0].landmarks
            ogx = landmarks._positions[54]._x
            ogy = landmarks._positions[65]._y
            mainphase = true;
            return;
        }
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        landmarks = detections[0].landmarks
        const xpos = landmarks._positions[54]._x
        const ypos = landmarks._positions[65]._y
        const box = { x: xpos, y: ypos, width: 25, height: 25 }
        let drawOptions
        if (ypos-ogy > 10){
            drawOptions = {
                lineWidth: 2,
                boxColor: "red"
            }
        } else if (ypos-ogy < -10){
            drawOptions = {
                lineWidth: 2,
                boxColor: "green"
            }
        }
        
        const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
        drawBox.draw(document.getElementById('c1'))
    };
    
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    setInterval(mainLoop, 100);
})