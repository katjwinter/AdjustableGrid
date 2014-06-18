// NOTE: We know the DOM is ready because this script isn't called until the background file is triggered,
// which will only be triggered after the DOM has been fully created. This is per Google.

// Add markup placeholder at the body level with which will be programmatically filled
// with the markup produced in lineTemplate.
// In the css file, this element will have absolute position of 0,0 and width and height of 100%
// which will allow it to overlay the entire page so when we draw lines, they appear across the page contents.
$("body").append( $("<cover></cover>") );

var baseSelected = false;
var comparatorSelected = false;

// Draw vertical and horizontal lines to make a grid across the page, overtop of content
var lineList = [{top:"100"},{top:"200"}, {top:"300"}, {top:"400"}]; // example for testing
var vLineList = [{left:"100"},{left:"200"},{left:"300"},{left:"400"}];
var lineTemplate = "<% _.each(lineList, function(line) { %>" + 
						"<div class='hline' style='top: <%=line.top%>px;'>" +
						"</div>" +
					"<% } ); %>" +
					"<% _.each(vLineList, function(line) { %>" +
					"<div class='vline' style='left: <%=line.left%>px;'>" +
					"</div>" +
					"<% } ); %>";
var temp = (_.template(lineTemplate, {lineList: lineList, vLineList: vLineList}));
$("cover").append(temp);
$("cover").append("<canvas id='hcounter' width='50' height='50' style='position:absolute; top:10px; left:10px; border:1px solid black; display:none;'></canvas>");

// Attach actions to the line elements for clicking and for dragging
$(".hline").draggable( {
    cursor:"move",
    containment:"cover",
    stop:handleStop,
    start:handleStart,
	drag:handleDrag,
    helper:"clone",
    appendTo:"parent"
});

$(".vline").draggable( {
	cursor:"move",
	containment:"cover",
	stop:handleVStop,
	start:handleStart,
	helper:"clone",
	appendTo:"parent"
});

$(".hline, .hline .thick").hover( 
    function() {
        var pos = $(this).position();
        var newPos = pos.top - 5;
        $(this).css({top:newPos});
        $(this).addClass("thick");
    },
    function() {
        $(this).removeClass("thick");
        var pos = $(this).position();
        var newPos = pos.top + 5;
        $(this).css({"top":newPos});
    }
)

$(".vline, .vline .thick").hover( 
    function() {
        var pos = $(this).position();
        var newPos = pos.left - 5;
        $(this).css({left:newPos});
        $(this).addClass("thick");
    },
    function() {
        $(this).removeClass("thick");
        var pos = $(this).position();
        var newPos = pos.left + 5;
        $(this).css({"left":newPos});
    }
)

$(".hline, .vline, .thick").click(
    function() {
        if (baseSelected) {
            if (comparatorSelected) {
                if ( $(this).attr("base") ) {
                    $("[base='base']").removeAttr("base");
                    $("[comparator='comparator']").removeAttr("comparator");
                    baseSelected = false;
                    comparatorSelected = false;
                }
                else if ( $(this).attr("comparator") ) {
                    $(this).removeAttr("comparator");
                    comparatorSelected = false;
                }
                else {
                    $("[comparator='comparator']").removeAttr("comparator");
                    $(this).attr("comparator","comparator");
                }
            }
            else {
                if ( $(this).attr("base") ) {
                    $(this).removeAttr("base");
                    baseSelected = false;
                }
                else {
                    $(this).attr("comparator","comparator");
                    comparatorSelected = true;
                }
            }
        }
        else {
            $(this).attr("base", "base");
            baseSelected = true;
        }
    }
)

function handleDrag(event, line) {
	var hcounterContext = $("#hcounter")[0].getContext('2d');
	var left = event.pageX;
	var top = event.pageY;
	if (event.pageY > 60) {
		top = top - 60;
	}
	else {
		top = top + 10;
	}
	$("#hcounter").css( {"top":top, "left":left} );
	hcounterContext.clearRect(0,0, 50,50);
	hcounterContext.font = "10px Arial";
	hcounterContext.fillText(event.pageY,8,8);
}

function handleStart(event, line) {
    line.helper.removeClass("thick");
	$("#hcounter").show();
}

function handleStop(event, line) {
    var y = line.position.top;
    $(this).css({"top":y});
	$("#hcounter").hide();
}

function handleVStop(event, line) {
	var x = line.position.left;
	$(this).css({"left":x});
}