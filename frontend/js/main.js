(function(markmon){
    var highlighter = document.querySelector(".highlighter"),
        scroller = markmon.scroller,
        contentDisplay = markmon.contentDisplay,
        changeHighlighter = markmon.changeHighlighter;
    
    if(!window.location.hash) {
        window.location.hash = "#/";
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", window.location.hash.slice(1), true);
        xmlhttp.send();
    }

    var socket = io.connect(location.origin);
    socket.on("content", function(data){
        console.log("got data");
        if(data.path && window.location.hash.replace("#", "") !== data.path) {
            console.log('not this page');
            return;
        }
        var r = contentDisplay.update(data.html);
        console.log(r);
        if(!r) return;
        r.inserted = r.inserted.map(function(elm){
            while(elm && !elm.innerHTML) elm = elm.parentElement;
            return elm;
        }).filter(function(elm){
            return !!elm;
        });
        MathJax.Hub.Typeset(r.inserted, function(){
            setTimeout(function(){
                changeHighlighter.syncHighlighter();
                scroller.scorllTo(changeHighlighter.getMarkerY() - window.innerHeight / 2 | 0);
            }, 10);
        });
    });
})(window.markmon ? window.markmon : window.markmon = {});
