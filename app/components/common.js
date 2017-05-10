var songList = [];
var getloggerproto = function (text) {
    var log = false;

    return function (text) {
        if (!log) {
            log = document.createElement("div");
            log.setAttribute("id", "logger")
            document.getElementsByClassName("container")[0].appendChild(log)
        }
        log.innerText = text;
        setTimeout(function () {
            log.setAttribute("class", "show")
        }, 1000);
        setTimeout(function () {
            log.setAttribute("class", "hide")
        }, 2000);
    }
}
export default {songList,getloggerproto}