navigator.mediaDevices.getUserMedia(
    { video: true, audio: true },
    stream => video.srcObject = stream,
    err => console.error(err)
);