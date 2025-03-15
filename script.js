const logo = document.querySelector("#logo");
const blurElement = document.querySelector("#blur");

function intro() {
  const fullscreenTxt = document.querySelector("#fullscreen-txt");

  logo.style.translate = "0px 0px";
  fullscreenTxt.style.translate = "0px 20px";

  setTimeout(() => {
    logo.style.transform = "translate(0px, -40px)";

    setTimeout(() => {
      fullscreenTxt.style.opacity = "1";
      fullscreenTxt.style.translate = "0px -20px";
    }, 100);

    setTimeout(() => {
      applyTransition(
        logo,
        "all .6s cubic-bezier(1, 0.01, 1, 1)",
        "translate(0px, -80px)",
        "0"
      );

      setTimeout(() => {
        applyTransition(
          fullscreenTxt,
          "all .6s cubic-bezier(1, 0.01, 1, 1)",
          "0px -70px",
          "0"
        );

        setTimeout(() => {
          fadeIn("#animator");
          setTimeout(() => {
            fadeIn("#SpriteSheet");
            setTimeout(() => {
              fadeIn("#app-js", 0.5);
            }, 50);
          }, 50);
        }, 650);
      }, 100);
    }, 2300);
  }, 1000);
}

function applyTransition(element, transition, translate, opacity) {
  element.style.transition = transition;
  element.style.transform = translate;
  element.style.opacity = opacity;
}

function fadeIn(selector, opacity = 1) {
  const element = document.querySelector(selector);
  element.style.transform = "translate(0px, 0px)";
  element.style.opacity = opacity;
}

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  turnOnDarkMode();
} else {
  console.log("El dispositivo está en modo claro");
}

function turnOnDarkMode() {
  document.querySelector("body").style.backgroundColor = "#232323";

  document.querySelectorAll("p").forEach((element) => {
    element.style.color = "#fafafa";
  });
}

intro();

function handleBlurAndRedirect(elementId, redirectUrl) {
  blurElement.style.display = "block";
  requestAnimationFrame(() => blurElement.classList.add("visible"));

  setTimeout(() => {
    const element = document.getElementById(elementId);
    element.style.transform = "scale(1)";

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
  }, 600);
}

//document.querySelectorAll(".select").forEach((icn) => {
//  icn.addEventListener("click", () => {
//    handleBlurAndRedirect(`${icn}`, `${icn}.html`);
//  });
//});

document.getElementById("animator").addEventListener("click", () => {
  handleBlurAndRedirect("animator", "animator.html");
});

document.getElementById("SpriteSheet").addEventListener("click", () => {
  handleBlurAndRedirect("SpriteSheet", "spritesheet.html?v=2");
});
