import "../src/style/main.css";
import "../src/style/header.css";
import "../src/style/content.css";
import "normalize.css";
import UserInterface from "./view";

// Import all weather icons with code + day/night config

function resize() {
  var ratio = window.innerWidth / 1920;
  document
    .querySelector("#sunset-rise-curve")
    .style.setProperty("--sun-scale", ratio);

  document.querySelector(".sunrise").style.setProperty("--sun-scale", ratio);

  document.querySelector(".sunset").style.setProperty("--sun-scale", ratio);

  document.querySelector(".sun-curve").style.setProperty("--sun-scale", ratio);

  document.querySelector(".uv-curve").style.setProperty("--sun-scale", ratio);
}

window.addEventListener("resize", resize);

const userInterface = new UserInterface();

userInterface.hookEventListeners();
