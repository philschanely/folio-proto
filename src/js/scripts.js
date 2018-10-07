function toggleStatusPopout() {
  $(".status-popout").toggleClass("on");
}

function setupNav() {
  let $links = $('#collections a');
  $('.collection-group--active').removeClass('collection-group--active');
  $links.each(function(i, o) {
    var href = '/' + $(o).attr('href');
    var loc = window.location.pathname;
    if (href === loc) {
      $(o).closest('li').addClass('collection-group--active');
    }
  });
}

function snippinLoad(tplUrl, dataSrc, snippinSelector, callback) {
  $.get(tplUrl, function(tplSrc){
    $.getJSON(dataSrc, function(data){
      var tpl = Handlebars.compile(tplSrc);
      var tplHTML = tpl(data);
      $(snippinSelector).html(tplHTML);

      if (callback !== undefined) {
        callback();
      }
    });
  });
}

function snippin(tplSelector, dataSrc, snippinSelector, callback) {
  $.getJSON(dataSrc, function(data){
    var tplSrc = $(tplSelector)[0].innerHTML;
    var tpl = Handlebars.compile(tplSrc);
    var tplHTML = tpl(data);
    $(snippinSelector).html(tplHTML);

    if (callback !== undefined) {
      callback();
    }
  });
}

function showTray(tplUrl, dataUrl) {
  $(".tray").addClass("on");
  snippinLoad(tplUrl, dataUrl, ".tray");
}

function responderCloseTray($target) {
  if ($target.hasClass("tray")) {
    $(".tray").removeClass("on");
  }
}

function responderStudentList($target) {
  var isStudentListLabel = $target.hasClass("select-list__label") && $target.closest(".select-list").length > 0;
  var isStudentListNamed = $target.hasClass("select-list__item--selected") && $target.closest(".select-list").length > 0;
  if (isStudentListLabel || isStudentListNamed) {
    $(".select-list .select-list__options").toggleClass("select-list__options--on");
  }
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
    $("body").append(data);
  });

  $.get("templates/footer.tpl.html", function(data) {
    $("body").append(data);
  });

  switch ($("body").attr("class")) {
    case "page-all-work":
      snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
      snippinLoad("templates/work-tile.tpl.html", "data/works/all.json", "main .work-tiles");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderWorkTiles($target);
        responderCloseTray($target);
      });
      break;

    case "page-collection":
      snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
      snippin("main", "data/works/sophomore-review.json", "main");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderWorkTiles($target);
        responderCloseTray($target);
      });
      break;

    case "page-collection-faculty":
      snippinLoad("templates/nav-faculty.tpl.html", "data/collections.json", "nav", setupNav);
      snippin("main", "data/works/sophomore-review.json", "main");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderStudentList($target);
        responderCloseTray($target);
        if ($target.hasClass("btn-edit-collection")) {
          e.preventDefault();
          showTray("templates/form/edit-collection.tpl.html", "data/works/sophomore-review.json");
        }
        if ($target.hasClass("btn-edit-category") || $target.hasClass("btn-add-category")) {
          e.preventDefault();
          showTray("templates/form/edit-category.tpl.html", "data/works/sophomore-review.json");
        }
      });
      break;

    case "page-collection-faculty-review":
      snippinLoad("templates/nav.tpl.html", "data/collections.json", "nav", setupNav);
      snippin("main", "data/works/sophomore-review.json", "main");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderWorkTiles($target);
        responderStudentList($target);
        responderCloseTray($target);
      });
      break;

    case "page-collection-public":
      snippin("main", "data/works/sophomore-review.json", "main");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderWorkTiles($target);
        responderCloseTray($target);
      });
      break;

    case "page-work":
      snippinLoad("templates/nav-faculty.tpl.html", "data/collections.json", "nav", setupNav);
      snippin("main", "data/works/single.json", "main");
      $("body").on("click", function(e){
        var $target = $(e.target);
        responderWorkTiles($target);
        responderCloseTray($target);
      });
      break;

    case "page-work-public":
      snippin("main", "data/works/single.json", "main");
      break;
  }

});
