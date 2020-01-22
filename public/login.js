// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById("btn-start");
var btnRegister = document.getElementById("btn-register");

// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var snapshot = document.getElementById("snapshot");

// The video stream
var cameraStream = null;

function promisify(xhr, failNon2xx = true) {
    const oldSend = xhr.send;
    xhr.send = function () {
        const xhrArguments = arguments;
        return new Promise(function (resolve, reject) {
            xhr.onload = function () {
                if (failNon2xx && (xhr.status < 200 || xhr.status >= 300)) {
                    reject({ request: xhr });
                } else {
                    resolve(xhr);
                }
            };
            xhr.onerror = function () {
                reject({ request: xhr });
            };
            oldSend.apply(xhr, xhrArguments);
        });
    }
}


function startStreamingRegister() {

    var mediaSupport = 'mediaDevices' in navigator;

    if (mediaSupport && null == cameraStream) {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (mediaStream) {

                cameraStream = mediaStream;

                stream.srcObject = mediaStream;

                stream.play();
                setTimeout(() => {

                    captureSnapshotsRegister();
                }, 1000);
            })
            .catch(function (err) {

                console.log("Unable to access camera: " + err);
            });
    }
    else {

        alert('Your browser does not support media devices.');

        return;
    }
}


async function captureSnapshotsRegister() {

    if (null != cameraStream) {

        const directions = ["At the camera", "Little Left"];
        var data = new FormData();
        const label = document.getElementById("name").value.trim()
        if (label.length === 0) {
            stopStreaming();
            return alert("Please enter name");
        }
        data.append("label", label);

        for (i = 0; i < 2; i++) {
            alert(`Please look ${directions[i]}`)
            var ctx = capture.getContext('2d');
            var img = new Image();

            ctx.drawImage(stream, 0, 0, capture.width, capture.height);

            img.src = capture.toDataURL("image/jpeg");
            img.width = 240;

            const res = await fetch(img.src)
            const blob = await res.blob()

            const file = new File([blob], `${i + 1}.jpg`, blob)

            data.append("image", file);
        }

        var xhr = new XMLHttpRequest();
        promisify(xhr);

        xhr.open("POST", "https://face-login-32570.web.app/register");
        xhr.send(data).then(res => {
            stopStreaming();
            document.getElementById("name").value = '';
        });






    }
}



// Start Streaming
function startStreaming() {

    var mediaSupport = 'mediaDevices' in navigator;

    if (mediaSupport && null == cameraStream) {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (mediaStream) {

                cameraStream = mediaStream;

                stream.srcObject = mediaStream;

                stream.play();
                setTimeout(() => {

                    captureSnapshot();
                }, 1000);
            })
            .catch(function (err) {

                console.log("Unable to access camera: " + err);
            });
    }
    else {

        alert('Your browser does not support media devices.');

        return;
    }
}

// Stop Streaming
function stopStreaming() {
    if (null != cameraStream) {
        var track = cameraStream.getTracks()[0];
        track.stop();
        stream.load();
        cameraStream = null;
    }
}

function captureSnapshot() {

    if (null != cameraStream) {

        var ctx = capture.getContext('2d');
        var img = new Image();

        ctx.drawImage(stream, 0, 0, capture.width, capture.height);

        img.src = capture.toDataURL("image/jpeg");
        img.width = 240;

        fetch(img.src)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'dot.jpg', blob)
                var data = new FormData();
                data.append("image", file);

                var xhr = new XMLHttpRequest();
                promisify(xhr);

                xhr.open("POST", "https://face-login-32570.web.app/");
                xhr.send(data).then(res => {
                    stopStreaming();
                    const result = JSON.parse(res.response)
                    document.getElementById("tracking").innerHTML = `Welcome ${result[0]['_label']}`
                });
            })





    }
}