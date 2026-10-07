const sourceElement = document.getElementById("sourceElement");
const campaignElement = document.getElementById("campaignElement");
const returnButton = document.getElementById("return-button");

let query = location.search;

const getParams = (query) => {
  const params = new URLSearchParams(query);
  const source = params.get("utm_source");
  const campaign = params.get("utm_campaign");

  sourceElement.textContent = source;
  campaignElement.textContent = campaign;
};

getParams(query);

returnButton.addEventListener("click", () => {
  history.back();
});
