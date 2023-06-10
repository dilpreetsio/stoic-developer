const LAST_DATE = "LAST_DATE",
    QUOTE = "QUOTE",
    IMAGE = "IMAGE",
    DOB = "DOB",COLLECTION_ID = 583204,
    DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000,
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"

let currentQuote = localStorage.getItem(QUOTE),
    currentImage = localStorage.getItem(IMAGE),
    currentDate = localStorage.getItem(LAST_DATE),
    dob = localStorage.getItem(DOB) || "1994-07-06"

const isSameDate = (oldDate, newDate) => {
    return (oldDate.getDate() == newDate.getDate() &&
        oldDate.getMonth() == newDate.getMonth() &&
        oldDate.getFullYear() == newDate.getFullYear())
}

const getAgeFromDOB = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)

const addTimeline = (type) => {
    let element = document.getElementById(`${type}-capsule`),
        percentageLabel = element.parentNode.querySelectorAll(".percentage-label") ,
        timePassed = document.createElement("div"),
        date = new Date(),
        lastDate = new Date(Date.parse(currentDate)),
        timePassedPercentage = 0;

    // set time to midnight
    lastDate.setHours(0)
    lastDate.setMinutes(0)
    lastDate.setSeconds(0)

    if (type === DAY) {
        timePassedPercentage = (date.getTime() - lastDate.getTime()) / DAY_IN_MILLISECONDS
    } else if (type === WEEK) {
        const lastMonday = new Date()

        if (lastMonday.getDay() !== 1)
            lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay() + 6) % 7);

        lastMonday.setHours(0)
        lastMonday.setMinutes(0)
        lastMonday.setSeconds(0)

        timePassedPercentage = (date.getTime() - lastMonday.getTime()) / (DAY_IN_MILLISECONDS * 7)

    } else if (type === MONTH) {
        lastDate.setDate(0)
        timePassedPercentage = (date.getDate()/lastDate.getDate())
    } else if (type === YEAR) {
        const firstDayOfYear = new Date(lastDate.getFullYear(), 0, 1)
        const numberOfDays = new Date(lastDate.getFullYear(), 1, 29).getDate() === 29 ? 366 : 365;

        timePassedPercentage = ((date.getTime() - firstDayOfYear.getTime())/ DAY_IN_MILLISECONDS) / numberOfDays

    }


    percentageLabel[0].innerHTML = `${parseInt(timePassedPercentage*100)}%`
    timePassed.className = `time-capsule-overlay`
    timePassed.style.width = `${Math.min(100, parseInt(timePassedPercentage * 100))}%`
    element.innerHTML = ""
    element.appendChild(timePassed)
}


const createTimelineComponent = (type) => {
    let timelineElement = document.createElement("div")
    timelineElement.id = `timeline-${type}`
    let timelineHeader = document.createElement("div"),
        timeCapsule = document.createElement("div"),
        headerName = document.createElement("span"),
        percentageLabel = document.createElement("span")

    headerName.innerHTML = type === DAY ? "Today" : `This ${type}`
    percentageLabel.className = "percentage-label"
    timeCapsule.className = "time-capsule"
    timeCapsule.id = `${type}-capsule`


    timelineHeader.appendChild(headerName)
    timelineHeader.appendChild(percentageLabel)
    timelineElement.appendChild(timelineHeader)
    timelineElement.appendChild(timeCapsule)

    return timelineElement
}

const store =  {
    init: async () => {
        let lastDate = localStorage.getItem(LAST_DATE),
            quote = localStorage.getItem(QUOTE),
            image = localStorage.getItem(IMAGE)
        if ((!lastDate || !quote || !image) || (!isSameDate(new Date(), new Date(Date.parse(lastDate))))) {
            const newQuote = await fetchQuote()
            const newImage = await fetchImage()
            currentQuote = newQuote
            currentImage = newImage
            currentDate = new Date()
            localStorage.setItem(QUOTE, JSON.stringify(newQuote))
            localStorage.setItem(IMAGE, newImage)
            localStorage.setItem(LAST_DATE, new Date())
        }
    },
    get: (name) => {
        return localStorage.getItem(name)
    }
}

const fetchQuote = async () => {
    let quote = await fetch("https://stoicquotesapi.com/v1/api/quotes/random").then(res => res.json())
    return quote
}

const fetchImage = async () => {
    let image = await fetch(`https://source.unsplash.com/collection/${COLLECTION_ID}/1920x1080/?sig=${Math.random()}`)
    return image.url
}

const renderTime = () => {
    setInterval(() => {
        const lastDate = new Date(Date.parse(currentDate)),
            today = new Date()

        if (lastDate.getDate() !== today.getDate()) {
            localStorage.setItem(LAST_DATE, new Date())
            currentDate = new Date()
        }
        addTimeline(DAY)
        addTimeline(WEEK)
        addTimeline(MONTH)
        addTimeline(YEAR)
        document.getElementById("time").innerHTML = time.innerHTML = `${(new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
    }, 1000)
}

const App = {
    renderApp: async () => {
        const quoteData = JSON.parse(currentQuote)

        const bg = document.createElement("div")
        bg.id = "bg"
        let bgImage = document.createElement("img")
        let bgOverlay = document.createElement("div")
        bgImage.id = "bg-image"
        bgOverlay.id = "bg-overlay"
        bgImage.src = currentImage
        bg.appendChild(bgOverlay)
        bg.appendChild(bgImage)

        let app = document.getElementById("app")
        let quoteContainer = document.createElement("div")
        quoteContainer.id = "quote-container"
        let time = document.createElement("h1")
        time.id = "time"
        let quote = document.createElement("h2")
        quote.id = "quote"
        let author = document.createElement("h3")
        author.id = "author"
        time.innerHTML = `${(new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
        quote.innerHTML = `"${quoteData.body}"`
        author.innerHTML = `${quoteData.author}`
        quoteContainer.appendChild(time)
        quoteContainer.appendChild(quote)
        quoteContainer.appendChild(author)

        let widgetContainer = document.createElement("div")
        widgetContainer.id = "widget-container"

        let wakaWidget = document.createElement("img")
        wakaWidget.id = "waka-widget"
        wakaWidget.src = "https://wakatime.com/share/@016631ad-8be2-449f-9adb-1e631d3f5143/a0cc7c87-4db2-4719-82a9-3c7e851fbfd5.svg"

        let sideWidgetContainer = document.createElement("div")
        sideWidgetContainer.id = "side-widget-container"

        let githubChart = document.createElement("img")
        githubChart.id = "github-img"
        githubChart.src = "http://ghchart.rshah.org/dilpreetsio"

        //memento mori generator
        let timeContainer = document.createElement("div")
        timeContainer.id = "time-container"

        let mementoMori = document.createElement("div")
        mementoMori.id = "memento-mori"
        let mementoMoriHeader = document.createElement("div")
        mementoMoriHeader.innerHTML = "Memento mori"
        mementoMoriHeader.id = "memento-mori-header"
        mementoMori.appendChild(mementoMoriHeader)

        const age = getAgeFromDOB(dob)

        for(let i=0;i<9;i++) {
            const yearLine = document.createElement("div")
            yearLine.className = "year-line"
            for(let j=0;j<10;j++) {
                const yearElement = document.createElement("div")
                let year = i * 10 + j;

                if (year < age) {
                    yearElement.className = "year dot-fill"
                } else {
                    yearElement.className = "year dot-outline"

                }
                yearLine.appendChild(yearElement)
            }
            mementoMori.appendChild(yearLine)
        }

        //timeline monitor
        let timeline = document.createElement("div")
        timeline.id = "timeline"

        //individual times
        const timelineDay = createTimelineComponent(DAY),
        timelineWeek = createTimelineComponent(WEEK),
        timelineMonth = createTimelineComponent(MONTH),
        timelineYear = createTimelineComponent(YEAR)

        timeline.appendChild(timelineDay)
        timeline.appendChild(timelineWeek)
        timeline.appendChild(timelineMonth)
        timeline.appendChild(timelineYear)

        timeContainer.appendChild(mementoMori)
        timeContainer.appendChild(timeline)
        widgetContainer.appendChild(wakaWidget)
        sideWidgetContainer.appendChild(githubChart)
        sideWidgetContainer.appendChild(timeContainer)
        widgetContainer.appendChild(sideWidgetContainer)

        app.appendChild(bg)
        app.appendChild(widgetContainer)
        app.appendChild(quoteContainer)
        renderTime()
    }
}

const init =() => {
    store.init()
    App.renderApp()
}
init()

