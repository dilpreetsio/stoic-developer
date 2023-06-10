const ComponenetCreator = {
  createTimeLineComponent: (type) => {
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

    return timelineElement;
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
    const quoteData = JSON.parse(currentQuote);

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
    const mementoMoriToggle = store.get(MEMENTO_MORI);

    if (!isStoreValueTrue(MEMENTO_MORI)) {
      return;
    }

    console.log("creating memento mori");
    let mementoMori = document.createElement("div");
    mementoMori.id = "memento-mori";
    mementoMori.className = "widget";
    let mementoMoriHeader = document.createElement("div");
    mementoMoriHeader.innerHTML = "Memento mori";
    mementoMoriHeader.id = "memento-mori-header";
    mementoMori.appendChild(mementoMoriHeader);

    const age = getAgeFromDOB(dob),
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
    if (!isStoreValueTrue(WAKA_TOGGLE) || !wakaUrl) {
      return;
    }
    let wakaWidget = document.createElement("img");
    wakaWidget.id = "waka-widget";
    wakaWidget.className = "widget";
    wakaWidget.src = wakaUrl;

    return wakaWidget;
  },
  createGithubComponent: () => {
    const githubToggle = store.get(GITHUB_TOGGLE);

    console.log(githubToggle);
    if (!githubToggle) {
      return;
    }
    const githubUsername = store.get(GITHUB);
    let githubChart = document.createElement("img");
    githubChart.id = "github-img";
    githubChart.src = `http://ghchart.rshah.org/${githubUsername}`;

    return githubChart;
  },
  createToggleBtn: (settingData) => {},
  createToggleBtnComponent: (settingData) => {
    const elementContainer = document.createElement("div"),
      toggleComponent = document.createElement("div"),
      toggleLabel = document.createElement("span"),
      toggleBtnContainer = document.createElement("label"),
      toggleInput = document.createElement("input"),
      toggleSlider = document.createElement("span"),
      settingToggleValue = store.get(settingData.key);

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

    if (settingToggleValue && settingData.placeholder) {
      const inputComponent =
        ComponenetCreator.createInputComponent(settingData);

      elementContainer.appendChild(inputComponent);
    }
    return elementContainer;
  },
  createInputComponent: (settingData) => {
    const inputContainer = document.createElement("div"),
      inputElement = document.createElement("input");
    inputElement.id = settingData.valueKey;
    inputElement.placeholder = settingData.placeholder;
    inputElement.className = "text-input";
    inputElement.value = store.get(settingData.valueKey);

    inputElement.addEventListener("change", EventHandler.handleInputChange);
    inputContainer.appendChild(inputElement);

    if (settingData.info) {
      const info = document.createElement("a");
      info.href = settingData.url;
      info.innerHTML = settingData.info;
      info.className = "input-info";
      inputContainer.appendChild(info);
    }

    return inputContainer;
  },
  createDateInputComponent: (name, key) => {},
  createSettingsPanelComponent: () => {
    let settings = document.createElement("div");
    SETTINGS_ITEMS.forEach((item) => {
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
