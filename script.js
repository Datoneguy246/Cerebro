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