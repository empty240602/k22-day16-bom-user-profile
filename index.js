const statusElement = document.getElementById("connection-status");
const connectionIndicator = document.getElementById("connection-indicator");
const connectionDot = document.getElementById("connection-dot");
const locationElement = document.getElementById("current-location");
const addressElement = document.getElementById("address");
const deviceNameElement = document.getElementById("device-info");
const browserElement = document.getElementById("browser");
const browserVersionElement = document.getElementById("browser-version");
const osElement = document.getElementById("operating-system");
const languageElement = document.getElementById("language");
const screenSizeElement = document.getElementById("screen-size");
const orientationElement = document.getElementById("orientation");
const fingerprintingButton = document.getElementById("fingerprinting-button");
const homeElement = document.getElementById("home");
const fingerPrintingElement = document.getElementById("fingerprinting");
const returnButton = document.getElementById("return-button");
const fingerprintDataElement = document.getElementById("fingerprint-data");

// Display Status
const updateConnectionStatus = () => {
  if (!navigator.onLine) {
    statusElement.innerText = "Đang Offline";
    statusElement.classList.replace("text-green-700", "text-red-700");
    connectionIndicator.classList.replace("bg-green-200", "bg-red-200");
    connectionDot.classList.replace("bg-green-600", "bg-red-600");
  } else {
    statusElement.innerText = "Đang Online";
    statusElement.classList.replace("text-red-700", "text-green-700");
    connectionIndicator.classList.replace("bg-red-200", "bg-green-200");
    connectionDot.classList.replace("bg-red-600", "bg-green-600");
  }
};

updateConnectionStatus();
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

// Get location from API of Nominatim Manual, after have information and then display information
const getLocation = () => {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toFixed(4);
          const longtitude = position.coords.longitude.toFixed(4);

          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longtitude}&format=jsonv2&addressdetails=1&accept-language=en`;

          // Start call API
          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu từ API");
              }
              return response.json();
            })
            .then((data) => {
              // Check the API response before displaying information on the website
              // console.log(data);
              // console.log(data.address);

              //If there is data, start displaying it on the website
              addressElement.innerText = `${data.address.city}, ${data.address.country}`;
            })
            .catch((error) => {
              console.error(
                "The mistake occure when call API: ",
                error.message,
              );
            });

          locationElement.innerText = `${latitude}, ${longtitude}`;
          resolve({
            latitude: latitude,
            longitude: longtitude,
          });
        },
        (error) => {
          console.error(`Lỗi lấy vị trí ${error.message}`);
          locationElement.innerText = `${error.message}`;
          reject(error);
        },
      );
    });
  } else {
    console.log("Browser don't have support Geolocation");
  }
};

// Display client's browser is using
const displayClientInfo = () => {
  const userAgent = navigator.userAgent;
  // Device Information
  deviceNameElement.textContent = userAgent || "Client device Info";

  // Browser Information
  const browser = userAgent.match(
    /(MSIE|Trident.*rv:|Edge|Edg|Opera|OPR|Firefox|Chrome|Safari)(?:\/|\s)([\d.]+)/i,
  );

  const browserName = browser ? browser[1] : "Unknown Browser";
  const browserVersion = browser ? browser[2] : "Unknown Browser Version";
  browserElement.textContent = browserName;
  browserVersionElement.textContent = `Phiên Bản: ${browserVersion}`;

  // Operating System Information
  const operatingSystem = userAgent.match(
    /(Windows NT [\d.]+|Mac OS X [\d_]+|Android [\d.]+|iPhone OS [\d_]+)/i,
  );

  const operatingSystemName = operatingSystem
    ? operatingSystem[1]
    : "Unknown Operating System";

  osElement.textContent = operatingSystemName;

  // Language
  const language = navigator.languages;
  languageElement.textContent = language.length
    ? language.join(", ")
    : "Unknown Language";

  // Screen Size
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  screenSizeElement.textContent = `${screenWidth} x ${screenHeight}`;

  // Screen Orientation
  const orientation = screen.orientation;
  orientationElement.textContent = orientation.type;

  return {
    userAgent: userAgent,
    browserName: browserName,
    browserVersion: browserVersion,
    os: operatingSystemName,
    languages: language,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    orientation: orientation.type,
  };
};

const initializeApp = async () => {
  const locationData = await getLocation();
  const clientInfo = displayClientInfo();

  const bomData = {
    ...locationData,
    ...clientInfo,
  };

  return bomData;
};

const showHome = () => {
  fingerPrintingElement.classList.add("hidden");
  homeElement.classList.remove("hidden");
};

const showFingerPriting = () => {
  fingerPrintingElement.classList.remove("hidden");
  homeElement.classList.add("hidden");
};

fingerprintingButton.addEventListener("click", async () => {
  const data = await initializeApp();

  history.pushState(data, "", "/fingerprinting");
  showFingerPriting();
  getData();
});

returnButton.addEventListener("click", () => {
  history.back();
});

const getData = () => {
  const fingerprintData = history.state;

  console.log(fingerprintData);

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

  fingerprintDataElement.textContent = fingerData;
};

window.addEventListener("popstate", () => {
  const pathName = location.pathname;

  if (pathName === "/fingerprinting") {
    showFingerPriting();

    getData();
  } else {
    showHome();
  }

  console.log("popstate");
  console.log(history.state);
});

initializeApp();
