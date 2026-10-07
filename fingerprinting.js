const fingerPrintingElement = document.getElementById("fingerprinting");
const returnButton = document.getElementById("return");

const getData = () => {
  const fingerprintData = history.state;

  if (!fingerprintData) {
    fingerPrintingElement.textContent = "";
    return;
  }

  let fingerData = "";
  const entries = Object.entries(fingerprintData);
  entries.forEach((item, index) => {
    if (index === entries.length - 1) {
      fingerData += item[1];
    } else {
      fingerData += item[1] + " + ";
    }
  });

  fingerPrintingElement.textContent = fingerData;
};

returnButton.addEventListener("click", () => {
  history.back();
});

window.addEventListener("popstate", () => {
  console.log("popstate");
  console.log(history.state);
});
