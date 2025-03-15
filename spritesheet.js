const nameInput = document.querySelector("#name");
const blurElement = document.querySelector("#blur");
const darkModeInput = document.querySelector("#darkmode-input");
let headsImported = 0;
let bodiesImported = 0;
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  ChangeTheme("dark");
} else {
  ChangeTheme("white");
}
setTimeout(() => {
  blurElement.style.opacity = "1";
  setTimeout(() => {
    blurElement.style.opacity = "0";
    setTimeout(() => {
      blurElement.style.display = "none";
    }, 240);
  }, 250);
}, 400);
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

    document.querySelectorAll("label, h1, h3, p").forEach((textElement) => {
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

    document.querySelectorAll("label, h1, h3, p").forEach((textElement) => {
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
  } else {
    console.error(`color theme not recognized [${t}]`);
  }
}
document.querySelector("#bodyInput").addEventListener("change", () => {
  bodiesImported = document.querySelector("#bodyInput").files.length;
  if (headsImported > 0 && bodiesImported > 0) {
    document.querySelector("#generate-bt").style.display = "block";
    document.querySelector("#note").style.display = "none";
  }
});

document.querySelector("#headInput").addEventListener("change", () => {
  headsImported = document.querySelector("#headInput").files.length;
  if (headsImported > 0 && bodiesImported > 0) {
    document.querySelector("#generate-bt").style.display = "block";
    document.querySelector("#note").style.display = "none";
  }
});

function toggleBlur(visible) {
  blurElement.style.display = visible ? "block" : "none";
  blurElement.style.opacity = visible ? "1" : "0";
  if (visible) {
    setTimeout(() => (blurElement.style.opacity = "0"), 250);
    setTimeout(() => (blurElement.style.display = "none"), 490);
  }
}
setTimeout(() => toggleBlur(true), 400);
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  turnOnDarkMode();
  darkModeInput.checked = true;
} else {
  console.log("El dispositivo está en modo claro");
}
document.body.style.overflow = "visible";
function createSpritesheet() {
  const bodyInput = document.getElementById("bodyInput");
  const headInput = document.getElementById("headInput");
  const canvas = document.getElementById("spriteCanvas");
  const ctx = canvas.getContext("2d");
  const bodyFiles = Array.from(bodyInput.files);
  const headFiles = Array.from(headInput.files);

  if (!bodyFiles.length || !headFiles.length) {
    return alert("please at least upload one head and body");
  }
  const bodyImages = [];
  const headImages = [];
  let loadedImagesCount = 0;
  const loadImage = (file, index, imagesArray) => {
    const img = new Image();
    img.onload = () => {
      imagesArray[index] = img;
      if (++loadedImagesCount === bodyFiles.length + headFiles.length) {
        createAndDownloadSpritesheet(bodyImages, headImages);
      }
    };
    img.src = URL.createObjectURL(file);
  };
  bodyFiles.forEach((file, index) => loadImage(file, index, bodyImages));
  headFiles.forEach((file, index) => loadImage(file, index, headImages));
}
function createAndDownloadSpritesheet(bodyImages, headImages) {
  const canvas = document.getElementById("spriteCanvas");
  const ctx = canvas.getContext("2d");
  const HEAD_WIDTH = 164;
  const HEAD_HEIGHT = 199;
  const BODY_WIDTH = 164;
  const BODY_HEIGHT = 380;
  const HEADS_PER_ROW = 6;
  const totalWidth = Math.max(
    bodyImages.length * BODY_WIDTH,
    HEADS_PER_ROW * HEAD_WIDTH
  );
  const totalHeight =
    BODY_HEIGHT + Math.ceil(headImages.length / HEADS_PER_ROW) * HEAD_HEIGHT;
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  let xOffset = 0;
  bodyImages.forEach((img) => {
    ctx.drawImage(img, xOffset, 0, BODY_WIDTH, BODY_HEIGHT);
    xOffset += BODY_WIDTH;
  });
  let headXOffset = 0;
  let headYOffset = BODY_HEIGHT;
  headImages.forEach((img, index) => {
    ctx.drawImage(img, headXOffset, headYOffset, HEAD_WIDTH, HEAD_HEIGHT);
    headXOffset += HEAD_WIDTH;
    if ((index + 1) % HEADS_PER_ROW === 0) {
      headXOffset = 0;
      headYOffset += HEAD_HEIGHT;
    }
  });
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.style.display = "block";
  if (canvas.width > 950) {
    canvas.style.transform = `scale(${canvas.width / 2 / 700})`;
    document.querySelector("#sheet").style.width = `${canvas.width}px`;
    document.querySelector("#sheet").style.height = `${canvas.height}px`;
    document.querySelector("#downloadLink-bt").style.display = "block";
  }
}
