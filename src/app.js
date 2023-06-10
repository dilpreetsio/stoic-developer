export default App = {
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
      quoteContainerComponent = ComponenetCreator.createQuoteComponent(),
      wakaComponent = ComponenetCreator.createWakaComponent(),
      githubComponent = ComponenetCreator.createGithubComponent(),
      mementoMoriComponent = ComponenetCreator.createMementoMoriComponent();

    //timeline monitor
    let timeline = document.createElement("div");
    timeline.id = "timeline";

    //individual timelines

    let dayTimeline = ComponenetCreator.createTimeLineComponent(DAY),
      weekTimeline = ComponenetCreator.createTimeLineComponent(WEEK),
      monthTimeline = ComponenetCreator.createTimeLineComponent(MONTH),
      yearTimeline = ComponenetCreator.createTimeLineComponent(YEAR);

    timeline.appendChild(dayTimeline);
    timeline.appendChild(weekTimeline);
    timeline.appendChild(monthTimeline);
    timeline.appendChild(yearTimeline);

    let widgetContainer = document.createElement("div");
    widgetContainer.id = "widget-container";

    let sideWidgetContainer = document.createElement("div");
    sideWidgetContainer.id = "side-widget-container";

    if (wakaComponent) widgetContainer.appendChild(wakaComponent);
    if (timeline) widgetContainer.appendChild(timeline);
    if (mementoMoriComponent) widgetContainer.appendChild(mementoMoriComponent);
    if (githubComponent) sideWidgetContainer.appendChild(githubComponent);
    widgetContainer.appendChild(sideWidgetContainer);

    app.appendChild(settingsBtn);
    app.appendChild(bgComponent);
    app.appendChild(widgetContainer);
    app.appendChild(quoteContainerComponent);
    renderTime();
  },
  renderWaka: () => {},
  renderGithub: () => {},
  renderTimeline: () => {},
  renderMementoMori: () => {},
};
