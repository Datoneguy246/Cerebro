navigator.mediaDevices.getUserMedia(
    { video: true },
    stream => video.srcObject = stream,
    err => console.error(err)
);