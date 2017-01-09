function toggleStatusPopout() {
    $(".status-popout").toggleClass("on");
}

function setupNav() {
    if ($("body").hasClass("page-all-work")) {

    }
}

function snippinLoad(tplUrl, dataSrc, snippinSelector, callback) {
    $.get(tplUrl, function(tplSrc){
        $.getJSON(dataSrc, function(data){
            var tpl = Handlebars.compile(tplSrc);
            var tplHTML = tpl(data);
            $(snippinSelector).html(tplHTML);
        });
    });

    if (callback !== undefined) {
        callback();
    }
}

function snippin(tplSelector, dataSrc, snippinSelector, callback) {
    $.getJSON(dataSrc, function(data){
        var tplSrc = $(tplSelector)[0].innerHTML;
        var tpl = Handlebars.compile(tplSrc);
        var tplHTML = tpl(data);
        $(snippinSelector).html(tplHTML);
    });

    if (callback !== undefined) {
        callback();
    }
}

function showTray(tplUrl, dataUrl) {
    $(".tray").addClass("on");
    snippinLoad(tplUrl, dataUrl, ".tray");
}

function responderWorkTiles($target) {
    if ($target.hasClass("btn-status")) {
        toggleStatusPopout();
    } else if ($target.hasClass("btn-comments")) {
        showTray("templates/comments.tpl.html", "data/works/single.json");
    } else if ($target.closest("li").hasClass("work-tile") || $target.closest("li").hasClass("work-tile-placeholder")) {
        showTray("templates/form/edit-work.tpl.html", "data/works/single.json");
    }
}

function responderStudentList($target) {
    var isStudentListLabel = $target.hasClass("label") && $target.closest(".select-students").length > 0;
    var isStudentListNamed = $target.hasClass("selected-student") && $target.closest(".select-students").length > 0;
    if (isStudentListLabel || isStudentListNamed) {
        $(".select-students .students").toggleClass("on");
    }
}


$(function(){

    Handlebars.registerHelper('date', function(txt) {
        var date = Date.parse(Handlebars.escapeExpression(txt));

        return date === null ? "" : date.toString("MMM d, yyyy");
    });

    Handlebars.registerHelper('workTiles', function(data) {
        $.get("templates/work-tile.tpl.html", function(tplSrc){
            console.log(data, tplSrc);
            var tpl = Handlebars.compile(tplSrc);
            var tplHTML = tpl(data);

            return tplHTML;
        });
    });

    $.get("templates/prototype-nav.tpl.html", function(data) {
        $("body").prepend(data);
    });

    $.get("templates/footer.tpl.html", function(data) {
        $("body").append(data);
    });

    switch ($("body").attr("class")) {
        case "page-all-work":
            snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
            snippinLoad("templates/work-tile.tpl.html", "data/works/all.json", "main .work-tiles");
            break;

        case "page-collection":
            snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
            snippin("main", "data/works/sophomore-review.json", "main");
            $("body").on("click", function(e){
                var $target = $(e.target);
                responderWorkTiles($target);
            });
            break;

        case "page-collection-faculty":
            snippinLoad("templates/nav-faculty.tpl.html", "data/collections.json", "nav", setupNav);
            snippin("main", "data/works/sophomore-review.json", "main");
            $("body").on("click", function(e){
                var $target = $(e.target);
                responderStudentList($target);
            });
            break;

        case "page-collection-faculty-review":
            snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
            snippin("main", "data/works/sophomore-review.json", "main");
            $("body").on("click", function(e){
                var $target = $(e.target);
                responderWorkTiles($target);
                responderStudentList($target);
            });
            break;

        case "page-collection-public":
            snippin("main", "data/works/sophomore-review.json", "main");
            $("body").on("click", function(e){
                var $target = $(e.target);
                responderWorkTiles($target);
            });
            break;

        case "page-work":
            snippinLoad("templates/nav-faculty.tpl.html", "data/collections.json", "nav", setupNav);
            snippin("main", "data/works/single.json", "main");
            break;

        case "page-work-public":
            snippin("main", "data/works/single.json", "main");
            break;
    }

});