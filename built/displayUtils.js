function addColor(theColor, theText) {
    return '<span style="color:' + theColor + '">' + theText + "</span><br />";
}
function addToDisplay(newline, category) {
    displayindex++;
    var newItem = new DisplayItem(displayindex, newline, category);
    if (category === "gameSave") {
        newItem.txt = addColor("white", getPrettyTime(new Date()) + ": " + newline);
        textToDisplaygamesave.unshift(newItem);
        textToDisplaygamesave.splice(1);
    }
    else if (category === "achievement") {
        newItem.txt = addColor("blue", getPrettyTime(new Date()) + ": " + newline);
        textToDisplayachievement.unshift(newItem);
    }
    else if (category === "loot") {
        newItem.txt = addColor("green", getPrettyTime(new Date()) + ": " + newline);
        textToDisplayloot.unshift(newItem);
        textToDisplayloot.splice(100);
    }
    else if (category === "challenge") {
        newItem.txt = addColor("red", getPrettyTime(new Date()) + ": " + newline);
        textToDisplaychallenge.unshift(newItem);
        textToDisplaychallenge.splice(25);
    }
    else if (category === "story") {
        newItem.txt = addColor("yellow", getPrettyTime(new Date()) + ": " + newline);
        textToDisplaystory.unshift(newItem);
    }
    textToDisplay = textToDisplayachievement.concat(textToDisplaychallenge).concat(textToDisplaygamesave).concat(textToDisplayloot).concat(textToDisplaystory);
    textToDisplay.sort((a, b) => (a.index < b.index ? 1 : -1)); // eslint-disable-line no-ternary
}
function getDisplayText() {
    var val = "";
    for (var i = 0; i < textToDisplay.length; i++) {
        val += "\n" + textToDisplay[i].txt;
    }
    return val;
}
class DisplayItem {
    constructor(index, txt, type) {
        this.index = index;
        this.timeadded = new Date();
        this.txt = txt;
        this.type = type;
    }
}
function getPrettyTime(d) {
    var hr = d.getHours();
    var min = d.getMinutes();
    var hrdisplay = "";
    var mindisplay = "";
    var secdisplay = "";
    var sec = d.getSeconds();
    if (min < 10) {
        mindisplay = "0" + min.toString();
    }
    else {
        mindisplay = min.toString();
    }
    if (sec < 10) {
        secdisplay = "0" + sec.toString();
    }
    else {
        secdisplay = sec.toString();
    }
    if (hr < 10) {
        hrdisplay = "0" + hr.toString();
    }
    else {
        hrdisplay = hr.toString();
    }
    return hrdisplay + ":" + mindisplay + ":" + secdisplay;
}
function logMyErrors(e) {
    addToDisplay(e.message, 'challenge');
}
function getPrettyTimeFromMilliSeconds(millisecondsToEvaluate) {
    var work = millisecondsToEvaluate - 0;
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
    const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
    const MILLISECONDS_PER_MINUTE = 60 * 1000;
    const MILLISECONDS_PER_SECOND = 1000;
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var ddays = "";
    var dhours = "";
    var dminutes = "";
    var dseconds = "";
    while (work > MILLISECONDS_PER_DAY) {
        days++;
        work -= MILLISECONDS_PER_DAY;
    }
    while (work > MILLISECONDS_PER_HOUR) {
        hours++;
        work -= MILLISECONDS_PER_HOUR;
    }
    while (work > MILLISECONDS_PER_MINUTE) {
        minutes++;
        work -= MILLISECONDS_PER_MINUTE;
    }
    while (work > MILLISECONDS_PER_SECOND) {
        seconds++;
        work -= MILLISECONDS_PER_SECOND;
    }
    ddays = ("0" + days.toString()).slice(-2);
    dhours = ("0" + hours.toString()).slice(-2);
    dminutes = ("0" + minutes.toString()).slice(-2);
    dseconds = ("0" + seconds.toString()).slice(-2);
    if (days > 0) {
        return ddays + ":" + dhours + ":" + dminutes + ":" + dseconds;
    }
    else if (hours > 0) {
        return dhours + ":" + dminutes + ":" + dseconds;
    }
    else if (minutes > 0) {
        return dminutes + ":" + dseconds;
    }
    else {
        return ":" + dseconds;
    }
}
function changeNotation() {
    // eslint-disable-line no-unused-vars
    gameData.options.standardNotation++;
    if (gameData.options.standardNotation >= 6) {
        gameData.options.standardNotation = 0;
    }
    $("#btnNotation").text(notationDisplayOptions[gameData.options.standardNotation]);
}
//# sourceMappingURL=displayUtils.js.map