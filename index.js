// Constants
const LAST_DATE = "LAST_DATE",
  QUOTE = "QUOTE",
  IMAGE = "IMAGE",
  DOB = "DOB",
  COLLECTION_ID = 583204, // unsplash collection id
  DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000,
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  WAKA = "wakatime",
  WAKA_TOGGLE = "waka_toggle",
  TIMELINE = "timeline",
  MEMENTO_MORI = "memento_mori",
  MEMENTO_MORI_TOGGLE = "memento_mori_toggle",
  GITHUB = "github",
  GITHUB_TOGGLE = "github_toggle";

// widgets data
const WIDGET_DATA = [
  {
    id: 3,
    name: "Wakatime",
    key: WAKA_TOGGLE,
    type: "toggle",
    valueKey: WAKA,
    inputType: "text",
    placeholder: "Wakatime url",
    info: "Get your embeddable link here",
    url: "https://wakatime.com/share/embed",
  },
  {
    id: 4,
    name: "Github",
    key: GITHUB_TOGGLE,
    valueKey: GITHUB,
    type: "toggle",
    inputType: "text",
    placeholder: "Github username",
  },
  {
    id: 2,
    name: "Memento Mori",
    key: MEMENTO_MORI_TOGGLE,
    type: "toggle",
    inputType: "date",
    placeholder: "Date of birth in DD-MM-YYYY format",
    valueKey: MEMENTO_MORI,
  },
  {
    id: 1,
    name: "Timeline",
    key: TIMELINE,
    type: "toggle",
  },
];

// store management
const store = {
  init: async () => {
    await updateAppState();
  },
  get: (key) => {
    return localStorage.getItem(key);
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  },
};

let currentQuote = store.get(QUOTE),
  currentImage = localStorage.getItem(IMAGE),
  currentDate = localStorage.getItem(LAST_DATE),
  dob = localStorage.getItem(MEMENTO_MORI) || "06-07-1994";

// fetch functions
const fetchImage = async () => {
  let image;

  try {
    image = await fetch(
      `https://source.unsplash.com/collection/${COLLECTION_ID}/1920x1080/?sig=${Math.random()}`
    );
  } catch (e) {}
  return image.url;
};

// alternative source of quotes https://stoic-quotes.com/api/quote
const fetchQuote = async () => {
  let quote = {};
  try {
    quote = await fetch("https://api.themotivate365.com/stoic-quote").then(
      (res) => res.json()
    );
  } catch (e) {}

  return quote;
};

const renderTime = () => {
  setInterval(() => {
    updateAppState();
    addTimeline(DAY);
    addTimeline(WEEK);
    addTimeline(MONTH);
    addTimeline(YEAR);
    document.getElementById("time").innerHTML =
      time.innerHTML = `${new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;
  }, 1000);
};

const isSameDate = (oldDate, newDate) => {
  return (
    oldDate.getDate() == newDate.getDate() &&
    oldDate.getMonth() == newDate.getMonth() &&
    oldDate.getFullYear() == newDate.getFullYear()
  );
};

const getAbsoluteAgeFromDOB = (birthDate) =>
  Math.floor(new Date() - new Date(birthDate).getTime());

const getAgeFromDOB = (birthDate) =>
  getAbsoluteAgeFromDOB(birthDate) / 3.15576e10;

const isStoreValueTrue = (key) => {
  return store.get(key) === "true";
};

// timeline functions
const addTimeline = (type) => {
  if (!isStoreValueTrue(TIMELINE)) {
    return;
  }
  let element = document.getElementById(`${type}-capsule`),
    percentageLabel = element.parentNode.querySelectorAll(".percentage-label"),
    timePassed = document.createElement("div"),
    date = new Date(),
    lastDate = new Date(Date.parse(currentDate)),
    timePassedPercentage = 0;

  // set time to midnight
  lastDate.setHours(0);
  lastDate.setMinutes(0);
  lastDate.setSeconds(0);

  if (type === DAY) {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    timePassedPercentage =
      (date.getTime() - today.getTime()) / DAY_IN_MILLISECONDS;
  } else if (type === WEEK) {
    const lastMonday = new Date();

    if (lastMonday.getDay() !== 1)
      lastMonday.setDate(
        lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7)
      );

    lastMonday.setHours(0);
    lastMonday.setMinutes(0);
    lastMonday.setSeconds(0);

    timePassedPercentage =
      (date.getTime() - lastMonday.getTime()) / (DAY_IN_MILLISECONDS * 7);
  } else if (type === MONTH) {
    lastDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    lastDate.setHours(23);
    lastDate.setMinutes(59);
    lastDate.setSeconds(59);

    const firstDay = new Date(currentDate);
    firstDay.setDate(1);

    const timePassed = date.getTime() - firstDay.getTime();
    const timeInMonth = lastDate.getTime() - firstDay.getTime();
    timePassedPercentage = timePassed / timeInMonth;
  } else if (type === YEAR) {
    const firstDayOfYear = new Date(lastDate.getFullYear(), 0, 1);
    const numberOfDays =
      new Date(lastDate.getFullYear(), 1, 29).getDate() === 29 ? 366 : 365;

    timePassedPercentage =
      (date.getTime() - firstDayOfYear.getTime()) /
      DAY_IN_MILLISECONDS /
      numberOfDays;
  }
  timePassedPercentage = timePassedPercentage % 100;
  percentageLabel[0].innerHTML = `${parseInt(timePassedPercentage * 100)}%`;
  timePassed.className = `time-capsule-overlay`;
  timePassed.style.width = `${Math.min(
    100,
    parseInt(timePassedPercentage * 100)
  )}%`;
  element.innerHTML = "";
  element.appendChild(timePassed);
};

// App updater function
const updateAppState = async () => {
  let lastDate = store.get(LAST_DATE),
    quote = store.get(QUOTE),
    image = store.get(IMAGE);

  if (
    !lastDate ||
    !quote ||
    quote.toString() == "{}" ||
    !image ||
    !isSameDate(new Date(), new Date(Date.parse(lastDate)))
  ) {
    const newQuote = await fetchQuote();
    const newImage = await fetchImage();

    currentQuote = newQuote;
    currentImage = newImage;
    currentDate = new Date();
    store.set(QUOTE, JSON.stringify(newQuote));
    store.set(IMAGE, newImage);
    store.set(LAST_DATE, new Date());
  }
};

const EventHandler = {
  handleSettingsClick: (e) => {
    const settingsPanel = document.getElementById("settings");

    if (settingsPanel) {
      settingsPanel.remove();
    } else {
      App.renderSettings();
    }
  },
  handleToggleChange: (e) => {
    const key = e.currentTarget.id;
    const value = e.currentTarget.checked;
    const settingData = WIDGET_DATA.find((item) => item.key === key);
    store.set(key, value);

    if (value) {
      if (settingData.placeholder && settingData.valueKey)
        DomKeeper.addInputComponent(settingData);
      App.renderComponentByKey(settingData);
    } else {
      if (settingData.placeholder)
        DomKeeper.removeElementById(`${settingData.valueKey}_input`);
      if (document.getElementById(settingData.valueKey || settingData.key))
        DomKeeper.removeElementById(settingData.valueKey || settingData.key);
    }
  },
  handleSaveClick: (e) => {
    let key = e.currentTarget.id;
    key = key.substring(0, key.lastIndexOf("_"));
    const settingData = WIDGET_DATA.find((item) => item.valueKey === `${key}`);
    const inputValue = document.getElementById(`${key}_value`).value;

    if (document.getElementById(settingData.valueKey || settingData.key))
      DomKeeper.removeElementById(settingData.valueKey || settingData.key);

    store.set(key, inputValue);
    App.renderComponentByKey(settingData);
  },
};

const DomKeeper = {
  addInputComponent: (settingData) => {
    const elementContainer = document.getElementById(
        `${settingData.key}_toggle`
      ),
      inputContainer = ComponenetCreator.createInputComponent(settingData);
    elementContainer.appendChild(inputContainer);
  },
  removeElementById: (key) => {
    const element = document.getElementById(key);
    element.remove();
  },
  updateApp: () => {},
};

// Create dom components
const ComponenetCreator = {
  createTimeLineComponent: () => {
    if (!isStoreValueTrue(TIMELINE)) {
      return;
    }

    let timeline = document.createElement("div"),
      timelineData = [DAY, WEEK, MONTH, YEAR];
    timeline.id = TIMELINE;
    timeline.className = "timeline widget padded-widget";
    timeline.dataset.id = WIDGET_DATA.find((item) => item.key === TIMELINE).id;

    timelineData.forEach((type) => {
      let timelineElement = document.createElement("div");
      timelineElement.id = `timeline-${type}`;
      let timelineHeader = document.createElement("div"),
        timeCapsule = document.createElement("div"),
        headerName = document.createElement("span"),
        percentageLabel = document.createElement("span");

      headerName.innerHTML = type === DAY ? "Today" : `This ${type}`;
      percentageLabel.className = "percentage-label";
      timeCapsule.className = "time-capsule";
      timeCapsule.id = `${type}-capsule`;

      timelineHeader.appendChild(headerName);
      timelineHeader.appendChild(percentageLabel);
      timelineElement.appendChild(timelineHeader);
      timelineElement.appendChild(timeCapsule);

      timeline.appendChild(timelineElement);
    });

    return timeline;
  },
  createBgImageComponent: () => {
    const bg = document.createElement("div");
    bg.id = "bg";
    let bgImage = document.createElement("img");
    let bgOverlay = document.createElement("div");
    bgImage.id = "bg-image";
    bgOverlay.id = "bg-overlay";
    bgImage.src = currentImage;
    bg.appendChild(bgOverlay);
    bg.appendChild(bgImage);

    return bg;
  },
  createQuoteComponent: () => {
    const quoteData = JSON.parse(store.get(QUOTE));
    let quoteContainer = document.createElement("div");
    quoteContainer.id = "quote-container";
    let time = document.createElement("h1");
    time.id = "time";
    let quote = document.createElement("h2");
    quote.id = "quote";
    let author = document.createElement("h3");
    author.id = "author";
    time.innerHTML = `${new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
    quote.innerHTML = `"${quoteData.quote}"`;
    author.innerHTML = `${quoteData.author}`;
    quoteContainer.appendChild(time);
    quoteContainer.appendChild(quote);
    quoteContainer.appendChild(author);

    return quoteContainer;
  },
  createMementoMoriComponent: () => {
    if (!isStoreValueTrue(MEMENTO_MORI_TOGGLE)) {
      return;
    }

    let mementoMori = document.createElement("div");
    mementoMori.id = MEMENTO_MORI;
    mementoMori.className = "widget padded-widget memento-mori";
    let mementoMoriHeader = document.createElement("div");
    mementoMoriHeader.innerHTML = "Memento mori";
    mementoMoriHeader.id = "memento-mori-header";
    mementoMori.dataset.id = WIDGET_DATA.find(
      (item) => item.key === MEMENTO_MORI_TOGGLE
    ).id;

    mementoMori.appendChild(mementoMoriHeader);

    const dobArray = dob.split("-"),
      age = getAgeFromDOB(dobArray[2] + "-" + dobArray[1] + "-" + dobArray[0]),
      absoluteAge = parseInt(age);

    for (let i = 0; i < 9; i++) {
      const yearLine = document.createElement("div");
      yearLine.className = "year-line";
      for (let j = 0; j < 10; j++) {
        const yearElement = document.createElement("div");
        let year = i * 10 + j;

        if (year < absoluteAge) {
          yearElement.className = "year dot-fill";
        } else if (year === absoluteAge) {
          yearElement.className = "year dot-outline";
          const currentYear = document.createElement("div");
          currentYear.className = "current-year";
          currentYear.style.width = `${parseInt((age - absoluteAge) * 100)}%`;
          yearElement.appendChild(currentYear);
        } else {
          yearElement.className = "year dot-outline";
        }
        yearLine.appendChild(yearElement);
      }
      mementoMori.appendChild(yearLine);
    }

    return mementoMori;
  },
  createWakaComponent: () => {
    const wakaUrl = store.get(WAKA);
    if (!isStoreValueTrue(WAKA_TOGGLE) || !wakaUrl) {
      return;
    }
    let wakaWidget = document.createElement("img");
    wakaWidget.id = WAKA;
    wakaWidget.className = "widget padded-widget waka-widget";
    wakaWidget.dataset.id = WIDGET_DATA.find(
      (item) => item.valueKey === WAKA
    ).id;
    wakaWidget.src = wakaUrl;

    return wakaWidget;
  },
  createGithubComponent: () => {
    if (!isStoreValueTrue(GITHUB_TOGGLE)) {
      return;
    }

    const githubToggle = store.get(GITHUB_TOGGLE);

    if (!githubToggle) {
      return;
    }
    const githubUsername = store.get(GITHUB);
    let githubChart = document.createElement("img");
    githubChart.id = GITHUB;
    githubChart.className = "github-img";
    githubChart.src = `http://ghchart.rshah.org/${githubUsername}`;

    return githubChart;
  },
  createToggleBtnComponent: (settingData) => {
    const elementContainer = document.createElement("div"),
      toggleComponent = document.createElement("div"),
      toggleLabel = document.createElement("span"),
      toggleBtnContainer = document.createElement("label"),
      toggleInput = document.createElement("input"),
      toggleSlider = document.createElement("span"),
      settingToggleValue = store.get(settingData.key);

    elementContainer.id = `${settingData.key}_toggle`;
    toggleComponent.className = "toggle-component";
    toggleLabel.innerHTML = settingData.name;
    toggleBtnContainer.className = "switch";
    toggleInput.type = "checkbox";
    toggleInput.checked = settingToggleValue === "true";
    toggleInput.id = settingData.key;

    toggleInput.addEventListener("change", EventHandler.handleToggleChange);
    toggleSlider.className = "slider round";
    toggleBtnContainer.appendChild(toggleInput);
    toggleBtnContainer.appendChild(toggleSlider);
    toggleComponent.appendChild(toggleLabel);
    toggleComponent.appendChild(toggleBtnContainer);
    elementContainer.appendChild(toggleComponent);

    if (settingToggleValue == "true" && settingData.placeholder) {
      const inputComponent =
        ComponenetCreator.createInputComponent(settingData);

      elementContainer.appendChild(inputComponent);
    }
    return elementContainer;
  },
  createInputComponent: (settingData) => {
    const inputContainer = document.createElement("div"),
      inputElementContainer = document.createElement("div"),
      inputElement = document.createElement("input"),
      saveBtn = document.createElement("button");

    inputContainer.className = "input-container";
    saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
   <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
   <path d="M14 4l0 4l-6 0l0 -4"></path>
</svg>`;
    saveBtn.className = "icon-btn";
    saveBtn.id = `${settingData.valueKey}_btn`;
    inputElement.id = `${settingData.valueKey}_value`;
    inputElement.placeholder = settingData.placeholder;
    inputElement.className = "text-input";
    inputElement.value = store.get(settingData.valueKey);

    saveBtn.addEventListener("click", EventHandler.handleSaveClick);
    inputContainer.id = `${settingData.valueKey}_input`;

    inputElementContainer.className = "input-element-container";
    inputElementContainer.appendChild(inputElement);
    inputElementContainer.appendChild(saveBtn);
    inputContainer.appendChild(inputElementContainer);
    if (settingData.info) {
      const info = document.createElement("a");
      info.href = settingData.url;
      info.innerHTML = settingData.info;
      info.className = "input-info";
      inputContainer.appendChild(info);
    }

    return inputContainer;
  },
  createSettingsPanelComponent: () => {
    let settings = document.createElement("div");
    WIDGET_DATA.forEach((item) => {
      let settingComponenet;

      if (item.type === "toggle") {
        settingComponenet = ComponenetCreator.createToggleBtnComponent(item);
      }

      settings.appendChild(settingComponenet);
    });
    return settings;
  },
  addInputComponent: (settingData) => {},
};

// App class
const App = {
  renderWelcome: async () => {
    const app = document.getElementById("app"),
      bgComponent = ComponenetCreator.createBgImageComponent(),
      quoteContainerComponent = ComponenetCreator.createQuoteComponent();

    app.appendChild(bgComponent);
    app.appendChild(quoteContainerComponent);
    App.renderSettings();
    store.set("init", true);
  },
  renderSettings: async () => {
    const app = document.getElementById("app"),
      settingsContainer = document.createElement("div"),
      settingPanel = document.createElement("div"),
      closeBtn = document.createElement("img");
    settings = ComponenetCreator.createSettingsPanelComponent();

    closeBtn.src = "/assets/img/x.svg";
    closeBtn.className = "close-btn";

    closeBtn.addEventListener("click", EventHandler.handleSettingsClick);

    settingsContainer.id = "settings";
    settingsContainer.className = "setting-container";

    settingPanel.className = "setting-panel";
    const settingsHeader = document.createElement("div");
    settingsHeader.className = "setting-header";
    settingsHeader.innerHTML = "Settings";

    settingsHeader.appendChild(closeBtn);
    settingPanel.appendChild(settingsHeader);
    settingPanel.appendChild(settings);
    settingsContainer.appendChild(settingPanel);

    app.appendChild(settingsContainer);
  },
  renderApp: async () => {
    let app = document.getElementById("app");
    let settingsBtn = document.createElement("img");
    settingsBtn.src = "/assets/img/settings.svg";
    settingsBtn.className = "setting-btn";

    settingsBtn.addEventListener("click", EventHandler.handleSettingsClick);

    const bgComponent = ComponenetCreator.createBgImageComponent(),
      quoteContainerComponent = ComponenetCreator.createQuoteComponent();

    let widgetContainer = document.createElement("div");
    widgetContainer.id = "widget-container";

    app.appendChild(settingsBtn);
    app.appendChild(bgComponent);
    app.appendChild(widgetContainer);
    app.appendChild(quoteContainerComponent);

    App.renderWidgets();
    renderTime();
  },
  renderWidgets: () => {
    WIDGET_DATA.forEach((item) => {
      if (isStoreValueTrue(item.key)) {
        App.renderComponentByKey(item);
      }
    });
  },
  renderWidgetInContainer: (widgetComponent, widgetDataKey) => {
    const widgetContainer = document.getElementById("widget-container"),
      widgetData = WIDGET_DATA.find((item) => item.key === widgetDataKey);

    if (widgetContainer.children.length > 0) {
      let index = widgetData.id - 1,
        previousWidget;
      while (index > 0) {
        previousWidget = document.querySelector(`[data-id="${index}"]`);
        if (previousWidget) {
          break;
        }
        index--;
      }

      if (index > 0) {
        previousWidget.parentNode.insertBefore(widgetComponent, previousWidget);
      } else {
        widgetContainer.insertBefore(
          widgetComponent,
          widgetContainer.firstChild
        );
      }
    } else {
      widgetContainer.appendChild(widgetComponent);
    }
  },
  renderGithub: () => {
    let githubWidget = ComponenetCreator.createGithubComponent(),
      quoteContainer = document.getElementById("quote-container");
    app = document.getElementById("app");

    let sideWidgetContainer = document.createElement("div");
    sideWidgetContainer.id = "side-widget-container";

    if (githubWidget) sideWidgetContainer.appendChild(githubWidget);

    if (quoteContainer) {
      app.insertBefore(sideWidgetContainer, quoteContainer);
    } else {
      app.appendChild(sideWidgetContainer);
    }
  },
  renderComponentByKey: (item) => {
    const key = item.valueKey || item.key,
      itemValue = store.get(key);

    let componentCreator, componentKey;

    if (!itemValue) {
      return;
    }

    switch (key) {
      case WAKA:
        componentCreator = ComponenetCreator.createWakaComponent;
        componentKey = WAKA_TOGGLE;
        break;
      case TIMELINE:
        componentCreator = ComponenetCreator.createTimeLineComponent;
        componentKey = TIMELINE;
        break;
      case MEMENTO_MORI:
        componentCreator = ComponenetCreator.createMementoMoriComponent;
        componentKey = MEMENTO_MORI_TOGGLE;
        break;
      case GITHUB:
        App.renderGithub();
        break;
      default:
        break;
    }

    if (componentCreator) {
      App.renderWidgetInContainer(componentCreator(), componentKey);
    }
  },
};

//populate the store for first time
const initStore = () => {
  //waka time
  store.set(WAKA_TOGGLE, false);
  store.set(WAKA, "");

  // timeline
  store.set(TIMELINE, true);

  // memento mori
  store.set(MEMENTO_MORI_TOGGLE, false);
  store.set(MEMENTO_MORI, `01-01-2000`);

  //github
  store.set(GITHUB_TOGGLE, false);
  store.set(GITHUB, "");
};

const init = async () => {
  if (store.get("init") === "false") {
    initStore();
    App.renderSettings();
    store.set("init", true);
  }
  App.renderApp();
};
init();
