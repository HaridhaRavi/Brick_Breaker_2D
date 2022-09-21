const btnStart = document.getElementById("start");
btnStart.onclick = function () {
  location.href = "./main.js";
};

function displayInstruction() {
  const instructionsElm = document.createElement("div");
  instructionsElm.setAttribute("id", "instruction");
  instructionsElm.innerHTML =
    "<p><h2><u>Instructions</u><h2>➡️ - To move the paddle in the right direction<br><br>⬅️ - To move the paddle in left direction</p>";
  //parent
  const parentElm = document.querySelector("body");
  console.log(parentElm);
  parentElm.appendChild(instructionsElm);
}

const btnAbout = document.getElementById("about");
btnAbout.onclick = function () {
  displayInstruction();
};
