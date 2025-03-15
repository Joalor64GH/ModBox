const nameInput = document.querySelector("#name"),
  blurElement = document.querySelector("#blur");
const img = document.getElementById("head");
const body = document.getElementById("body");
let cropwidth = 0,
  cropheight = 381,
  headwidth = 164,
  headheight = 199,
  translateX = 0,
  translateY = 0,
  x = 55,
  y = 30,
  props = [],
  maximunWidth = headwidth,
  currentProp = 0,
  fileName = "",
  fileURL = "",
  SpritesheetWidth = 0,
  SpritesheetHeight = 0,
  mouseOverImagePreview = false,
  YInImagePreview = 0,
  XInImagePreview = 0,
  keyPressed = "",
  mousedown = false,
  isDragging = false,
  startX = 0,
  startY = 0,
  progress = {
    chName: "",
    frames: "0",
    width: "164",
    height: "328",
    propsArray: [],
  };
document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

setTimeout(() => {
  blurElement.style.display = "block";
  blurElement.style.opacity = "1";
  setTimeout(() => {
    blurElement.style.opacity = "0";
    setTimeout(() => {
      blurElement.style.display = "none";
    }, 240);
  }, 250);
}, 400);

const darkModeInput = document.querySelector("#darkmode-input");

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  ChangeTheme("dark");
  darkModeInput.checked = true;
} else {
  ChangeTheme("white");
}

img.addEventListener("touchstart", (e) => {
  img.style.cursor = "grabbing";
  isDragging = true;
  startX = e.touches[0].pageX - translateX;
  startY = e.touches[0].pageY - translateY;
});

document.addEventListener("touchmove", (e) => {
  if (isDragging) {
    translateX = e.touches[0].pageX - startX;
    translateY = e.touches[0].pageY - startY;

    document.querySelector("#xpos").value = `${translateX - 55}`;
    document.querySelector("#ypos").value = `${translateY - 30}`;
    img.style.transform = `translate(${translateX * 1.6}px, ${
      translateY * 1.6
    }px)`;
    x = translateX;
    y = translateY;
    if (document.querySelector("#drag-and-add-input").checked) {
      newProp();
    }
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
  img.style.cursor = "grab";
});

document.addEventListener("keydown", (event) => {
  keyPressed = event.key;
});
document.addEventListener("keyup", () => {
  keyPressed = "";
});
const addClickEvent = (selector, callback) => {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener("click", callback);
  }
};
addClickEvent("#homeButton", () => {
  window.location.href = "index.html";
});
addClickEvent("#playAudio", playAudioPreview);
addClickEvent("#trackBt", showAudiotrack);
addClickEvent("#play", play);
addClickEvent("#rem-head", removeProp);
addClickEvent("#add-head", newProp);
addClickEvent("#prevhead", prevF);
addClickEvent("#nexthead", nextF);
addClickEvent("#blur", closeDialog);
addClickEvent("#download", downloadJSON);
addClickEvent("#info", infoDialog);
addClickEvent("#prev-prop", previousProp);
addClickEvent("#nex-prop", nextProp);
darkModeInput.addEventListener("change", () => {
  darkModeInput.checked ? ChangeTheme("dark") : ChangeTheme("white");
});

document.querySelector("#file").addEventListener("click", function () {
  blurElement.style.display = "block";
  blurElement.style.opacity = "0.7";
  blurElement.style.animation = "ob2 .25s cubic-bezier(0.165, 0.84, 0.44, 1)";
  document.querySelector("#import-dialog").style.opacity = "1";
  document.querySelector("#import-dialog").style.display = "block";
  document.querySelector("#import-dialog").style.transform =
    "translate(0px, -460px)";
  document.querySelector("#import-dialog").style.animation =
    "o 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)";
});

document.querySelector("#character").style.transform = "translate(0px, 380px)";
setTimeout(() => {
  document.querySelector("#character").style.transform = "translate(0px, 10px)";
}, 600);

document.querySelector("#image").addEventListener("mouseover", () => {
  mouseOverImagePreview = true;
});

document.querySelector("#image").addEventListener("mouseout", () => {
  mouseOverImagePreview = false;
});

document.querySelector("#image").addEventListener("wheel", function (event) {
  if (
    (mouseOverImagePreview && YInImagePreview > SpritesheetHeight) ||
    YInImagePreview < SpritesheetHeight
  ) {
    if (event.deltaY > 0 && keyPressed != "Shift") {
      YInImagePreview -= 40;
    } else if (event.deltaY < 0 && keyPressed != "Shift") {
      YInImagePreview += 40;
    }
    if (event.deltaY > 0 && keyPressed == "Shift") {
      XInImagePreview -= 40;
    } else if (event.deltaY < 0 && keyPressed == "Shift") {
      XInImagePreview += 40;
    }
    document.querySelector(
      "#image"
    ).style.backgroundPosition = `${XInImagePreview}px ${YInImagePreview}px`;
  }
});

document.querySelector("#import").addEventListener("change", (event) => {
  const file = event.target.files[0];
  const importDialog = document.querySelector("#import-dialog");
  const warning = document.querySelector("#warning-import");
  const preview = document.querySelector("#image");

  if (file) {
    fileURL = URL.createObjectURL(file);
    const fileName = file.name.split(".").slice(0, -1).join(".");
    const image = new Image();

    image.src = fileURL;
    image.onload = () => {
      setTimeout(() => {
        preview.style.backgroundImage = `url(${fileURL})`;

        // Configuración por tipo de archivo
        const isMini = fileName.includes("mini");
        const isHD = fileName.includes("HD") || fileName.includes("hd");
        importDialog.style.scale = "0.8";

        if (isMini || isHD) {
          importDialog.style.height = "755px";
          importDialog.style.transform = "translate(0px, -715px)";
          importDialog.style.animation = isMini
            ? "u 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)"
            : "uw 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)";
          warning.innerHTML = isMini
            ? "this Sprite is a mini version which can cause importing problems"
            : "this Sprite is a HD version which can cause importing problems";
        } else {
          importDialog.style.height = "680px";
          importDialog.style.transform = "translate(0px, -800px)";
          importDialog.style.animation =
            "u 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)";
          warning.innerHTML = "";
          preview.style.height = "500px";
        }

        character.style.animation = "none";
        character.offsetHeight;
        SpritesheetHeight = image.height;
        SpritesheetWidth = image.width;
      }, 250);
    };
  }
});

document.querySelector("#import-button").addEventListener("click", () => {
  const importDialog = document.querySelector("#import-dialog");
  importDialog.style.animation = "none";
  void importDialog.offsetWidth; // Forzar reflujo
  importDialog.style.animation = "c 0.35s ease";

  importDialog.addEventListener("animationend", (e) => {
    if (e.animationName === "c") {
      // Verificar si es la animación "c"
      blurElement.style.display = "none";
      importDialog.style.display = "none";
      importCharacter();
    }
  });
});

document.querySelector("#audioInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const audioElement = document.getElementById("track");
    audioElement.src = URL.createObjectURL(file);
  }
});
function updateTransform(axis, value) {
  if (axis === "x") {
    x = 55 + parseInt(value);
  } else if (axis === "y") {
    y = 30 + parseInt(value);
  }
  img.style.transform = `translateX(${x}px) translateY(${y}px)`;
  console.log(
    `value: ${value} and ${axis.toUpperCase()}: ${axis === "x" ? x : y}`
  );
}
document.querySelector("#xpos").addEventListener("input", function () {
  updateTransform("x", this.value);
});
document.querySelector("#ypos").addEventListener("input", function () {
  updateTransform("y", this.value);
});
document.querySelector("#headspl").addEventListener("input", () => {
  maximunWidth = headwidth * parseInt(document.getElementById("headspl").value);
  ["nexthead", "prevhead"].forEach((id) => {
    document.getElementById(id).style.opacity = 1;
  });
});
function updateDimension(d, v) {
  if (d === "height") {
    headheight = v;
    img.style.height = `${headheight}px`;
  } else if (d === "width") {
    headwidth = v;
    img.style.width = `${headwidth}px`;
  }
}

document.querySelector("#height-input").addEventListener("input", function () {
  updateDimension("height", this.value);
});

document.querySelector("#width-input").addEventListener("input", function () {
  updateDimension("width", this.value);
});

function ChangeTheme(t) {
  if (t == "dark") {
    document.body.style.backgroundColor = "#232323";
    const styles = {
      buttons: {
        backgroundColor: "#232323",
        color: "#fafafa",
        borderColor: "#fafafa",
      },
      text: { color: "#fafafa" },
      dialogs: { backgroundColor: "#232323" },
      canvas: { backgroundColor: "#292929" },
      input: { color: "white", backgroundColor: "#303030" },
    };

    document.querySelectorAll("button").forEach((button) => {
      Object.assign(button.style, styles.buttons);
      button.classList.add("dark-bt");
    });

    document.querySelectorAll("h1, h3, p").forEach((textElement) => {
      Object.assign(textElement.style, styles.text);
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
      Object.assign(dialog.style, styles.dialogs);
    });

    document.querySelectorAll("canvas").forEach((canvas) => {
      Object.assign(canvas.style, styles.canvas);
    });

    document.querySelectorAll("input").forEach((input) => {
      Object.assign(input.style, styles.input);
    });

    document.querySelector("#box").style.backgroundColor = "#232323";
    document.querySelector("#upper-cover").style.backgroundColor = "#232323";
  } else if (t == "white") {
    document.body.style.backgroundColor = "#fafafa";
    const styles = {
      buttons: {
        backgroundColor: "#fafafa",
        color: "black",
        borderColor: "gray",
      },
      text: { color: "black" },
      dialogs: { backgroundColor: "#fafafa" },
      canvas: { backgroundColor: "#fififi" },
      input: { color: "black", backgroundColor: "gray" },
    };

    document.querySelectorAll("button").forEach((button) => {
      Object.assign(button.style, styles.buttons);
      button.classList.remove("bt-dark");
    });

    document.querySelectorAll("h1, h3, p").forEach((textElement) => {
      Object.assign(textElement.style, styles.text);
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
      Object.assign(dialog.style, styles.dialogs);
    });

    document.querySelectorAll("canvas").forEach((canvas) => {
      Object.assign(canvas.style, styles.canvas);
    });

    document.querySelectorAll("input").forEach((input) => {
      Object.assign(input.style, styles.input);
    });

    document.querySelector("#box").style.backgroundColor = "#fafafa";
    document.querySelector("#upper-cover").style.backgroundColor = "#fafafa";
  } else {
    console.error(`color theme not recognized [${t}]`);
  }
}

function playAudioPreview() {
  const track = document.querySelector("#track");
  const progressLine = document.querySelector("#progress-line");
  const playButton = document.querySelector("#playAudio");

  const updateButtonState = (isPlaying) => {
    if (isPlaying) {
      playButton.classList.remove("play");
      playButton.classList.add("stop");
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect x="20" y="20" width="60" height="60" fill="black" /></svg>';
    } else {
      playButton.classList.remove("stop");
      playButton.classList.add("play");
      playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><polygon points="30,20 80,50 30,80" fill="black" /></svg>';
    }
  };

  if (playButton.classList.contains("play")) {
    updateButtonState(true);
    track.play();
    progressLine.style.display = "block";

    const duration = track.duration;

    progressLine.style.animation = "none";
    void progressLine.offsetWidth;
    progressLine.style.animation = `progressLine ${duration}s linear`;

    setTimeout(() => {
      progressLine.style.animation = "none";
      progressLine.style.display = "none";
      track.currentTime = 0;
      track.pause();
      updateButtonState(false);
    }, duration * 1000);
  } else {
    progressLine.style.animation = "none";
    progressLine.style.display = "none";
    track.pause();
    track.currentTime = 0;
    updateButtonState(false);
  }
}

function importCharacter() {
  const character = document.querySelector("#character");
  const nameField = document.querySelector("#name");
  const nextHead = document.querySelector("#nexthead");
  const prevHead = document.querySelector("#prevhead");
  const headsplField = document.querySelector("#headspl");
  nameField.value = fileName.includes("-sprite")
    ? fileName.replace("-sprite", "")
    : fileName;
  progress.chName = fileName.includes("-sprite")
    ? fileName.replace("-sprite", "")
    : fileName;
  [nextHead, prevHead].forEach((element) => (element.style.opacity = 1));
  console.info(`el nombre de el personaje es ${progress.chName}`);

  img.style.backgroundImage = `url(${fileURL})`;
  body.style.backgroundImage = `url(${fileURL})`;
  headsplField.value = Math.round(SpritesheetWidth / headwidth - 1);
  maximunWidth = headwidth * headsplField.value;
  resetAnimation(character, "j .3s ease");
}
function resetAnimation(element, animation) {
  element.style.animation = "none";
  void element.offsetWidth;
  element.style.animation = animation;
}

function resetCharacter() {
  img.style.backgroundPosition = `0px 400px`;
}

function play() {
  const playButton = document.querySelector("#play");
  const track = document.querySelector("#track");
  const head = document.querySelector("#head");

  if (playButton.innerHTML === "play") {
    if (props.length > 0) {
      playButton.innerHTML = "stop";
      track.currentTime = 0;
      head.style.transform = `translate(55px, 30px)`;
      let item = 0;
      track.play();

      intervalId = setInterval(() => {
        if (item < props.length) {
          switchto(item);
          item++;
        } else {
          resetPlayback(playButton, track);
          switchto(props.length - 1);
        }
      }, 41.67);
    }
  } else {
    resetPlayback(playButton, track);
    switchto(props.length - 1);
  }
}

function resetPlayback(button, track) {
  button.innerHTML = "play";
  clearInterval(intervalId);
  track.pause();
  track.currentTime = 0;
}

function previousProp() {
  currentProp = Math.max(0, currentProp - 1);
  switchto(currentProp);
}

function nextProp() {
  currentProp = Math.min(props.length - 1, currentProp + 1);
  switchto(currentProp);
}

function removeProp() {
  if (props.length > 0) {
    props.splice(currentProp, 1);
    currentProp = Math.max(0, currentProp - 1);
    switchto(currentProp);
  }
}

function closeDialog() {
  const infoDialog = document.querySelector("#infoDialog");
  const importDialog = document.querySelector("#import-dialog");
  const blur = document.querySelector("#blur");

  applyAnimation(infoDialog, "c 0.35s ease");
  applyAnimation(importDialog, "c 0.35s ease");

  setTimeout(() => {
    [infoDialog, importDialog].forEach(
      (dialog) => (dialog.style.display = "none")
    );
    blur.style.opacity = "0";
  }, 320);

  setTimeout(() => {
    blur.style.display = "none";
  }, 680);
}

function infoDialog() {
  const infoDialog = document.getElementById("infoDialog");
  const blur = document.getElementById("blur");

  infoDialog.style.display = "block";
  applyAnimation(infoDialog, "oi .25s cubic-bezier(0.165, 0.84, 0.44, 1)");
  blur.style.display = "block";
  blur.style.opacity = "0.7";
}

function showAudiotrack() {
  const trackButton = document.querySelector("#trackBt");
  const audioTrack = document.getElementById("audioTrack");

  if (trackButton.innerHTML === "audio Track") {
    toggleAudioTrack(audioTrack, trackButton, true);
  } else {
    toggleAudioTrack(audioTrack, trackButton, false);
  }
}

function toggleAudioTrack(audioTrack, trackButton, show) {
  audioTrack.style.display = show ? "block" : "none";
  document.body.style.transform = show
    ? "translate(0px, -400px)"
    : "translate(0px, 0px)";
  trackButton.innerHTML = show ? "hide Track" : "audio Track";
}

function applyAnimation(element, animation) {
  element.style.animation = animation;
}

function switchto(p) {
  let prop = props[p].split("-");
  cropwidth = parseInt(prop[0]);
  cropheight = parseInt(prop[1]);
  x = parseInt(prop[2]);
  y = parseInt(prop[3]);
  img.style.backgroundPosition = `-${cropwidth}px -${cropheight}px`;
  img.style.transform = `translate(${x}px, ${y}px)`;
  currentProp = p;
  document.getElementById(
    "propsCounter"
  ).innerHTML = `prop ${currentProp}/${props.length}`;
}

function newProp() {
  props.push(`${cropwidth}-${cropheight}-${x}-${y}`);
  console.log(props);
  currentProp++;
  updatePropsCounter();
}

// Actualiza el contador de propiedades
function updatePropsCounter() {
  document.getElementById(
    "propsCounter"
  ).innerHTML = `prop ${currentProp}/${props.length}`;
}

function closeError() {
  updateStyle("errorDialog", { display: "none" });
  document.getElementById("errorText").innerHTML =
    "[ CANNOT GET HEAD PER ROW ]";
  updateStyle("blur", { display: "none", opacity: "0" });
}

function nextF() {
  const headsplValue = parseInt(document.getElementById("headspl").value);

  if (headsplValue > 0) {
    if (cropwidth < maximunWidth) {
      cropwidth += headwidth;
    } else {
      cropwidth = 0;
      cropheight += parseInt(document.getElementById("height-input").value);
    }
    enablePrevHeadButton();
    updateBackgroundPosition();
  }
}

function prevF() {
  const headsplValue = parseInt(document.getElementById("headspl").value);

  if (headsplValue > 0) {
    if (cropwidth === 0 && cropheight > 381) {
      cropwidth = maximunWidth;
      cropheight -= parseInt(document.getElementById("height-input").value);
    } else if (cropwidth > 0) {
      cropwidth -= headwidth;
      console.log(headwidth);
    }
    updateBackgroundPosition();
  }
}
function updateBackgroundPosition() {
  img.style.backgroundPosition = `-${cropwidth}px -${cropheight}px`;
}
function enablePrevHeadButton() {
  document.getElementById("prevhead").style.opacity = "1";
}

function updateStyle(elementId, styles) {
  const element = document.getElementById(elementId);
  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value;
  }
}

function downloadJSON() {
  let data = {
    animeName: document.getElementById("name").value,
    percentageMax: "0.2",
    totalFrame: props.length.toString(),
    width: headwidth.toString(),
    height: (headheight + 20).toString(),
    headHeight: document.getElementById("height-input").value,
    arrayFrame: generateProps(),
  };
  let jsonData = JSON.stringify(data, null, 2);
  let blob = new Blob([jsonData], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `${document.getElementById("name").value}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  document.getElementById("downloaded").style.display = "block";
  setTimeout(() => {
    document.getElementById("downloaded").style.display = "none";
  }, 1800);
}

function getProp(p) {
  let prop = props[p].split("-");
  cropwidth = parseInt(prop[0]);
  cropheight = parseInt(prop[1]);
  x = parseInt(prop[2]);
  y = parseInt(prop[3]);
  return { prop: `${cropwidth},${cropheight - 20},${x - 55},${y - 30}` };
}

function generateProps() {
  let array = [];
  for (let i = 0; i < props.length; i++) {
    array.push(getProp(i));
  }
  console.log(array);
  return array;
}

const audioInput = document.getElementById("audioInput");
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");

audioInput.addEventListener("change", function (event) {
  document.querySelector("#playAudio").style.display = "block";
  const file = event.target.files[0];
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const reader = new FileReader();

  reader.onload = function (event) {
    audioContext.decodeAudioData(event.target.result, function (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const dataArrayBuffer = buffer.getChannelData(0);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 7;
      canvasCtx.strokeStyle = "rgb(92, 118, 204)";

      canvasCtx.beginPath();

      const sliceWidth = canvas.width / dataArrayBuffer.length;
      let x = 0;

      for (let i = 0; i < dataArrayBuffer.length; i++) {
        const v = dataArrayBuffer[i] * 0.5 + 0.5;
        const y = v * canvas.height;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height);
      canvasCtx.stroke();
    });
  };

  reader.readAsArrayBuffer(file);
});
