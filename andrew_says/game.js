var game;
var GAME_START_DELAY = 1000;
var DEBUG = true;

$(function(){
	game = new game();
	setTimeout(function(){
		game.start();
	}, GAME_START_DELAY);	
});

var game = function(){
	var _this = this;
	this._colors = ["red", "blue", "yellow", "green"];
	this._additionalColors = ["purple", "teal", "orange", "gray"]
	this._currentSequence = [];
	var COLOR_BLINK_DURATION = 500; // not really a constant but w/e
	var isPlayersTurn = false;
	var _sequenceStack = [];
	var DIFFICULT_RATIO = 4;
	var playerInputTimeout;

	var _correctGuesses = 0;
	var playerOscillator;

	$("body").on("mouseup touchend", ".square", function(){
		$(this).removeClass("active");
		handleSquareClick($(this));
	});

	$("body").on("mousedown touchstart", ".square",function(){
		$(this).addClass("active")
	});

	this.start = function(){
		$(".message").text("").hide();
		isPlayersTurn = false;
		this._currentSequence.push(getNextColor());
		displayColorSequence(this._currentSequence);
		isPlayersTurn = true;
	}

	this.restart = function(){
		this._currentSequence = [];
		_correctGuesses = 0;
		$(".square:not([data-sort])").remove();
		$(".square").removeClass("width-twentyfive").addClass("width-fifty");
		var ordered = $(".square");
		ordered.sort(function(a,b){
			return $(a).data("sort") > $(b).data("sort");
		})
		ordered.detach().appendTo(".container")
		this.nextSequence();
	}

	this.nextSequence = function(){
		setTimeout(function(){
			_this.start();
		}, GAME_START_DELAY);
	}

	function handleSquareClick(square){
		if(!isPlayersTurn){
			return;
		}

		var clickedColor = square.data("color");
		
		var currentColor = _sequenceStack.pop();
		if(clickedColor != currentColor){
			showMessage("Incorrect! Best " + _correctGuesses)
			debug("The correct order was: " + _this._currentSequence.join(", "));
			_this.restart();
			return;
		}

		if(_sequenceStack.length == 0){
			showMessage("Correct!", true);
			_correctGuesses++;

			if(_correctGuesses == 6 || _correctGuesses == 15){
				increaseDifficulty("shuffle")
			}

			if(_correctGuesses == 9){
				increaseDifficulty("addColors")
				
			}

			if(_correctGuesses % DIFFICULT_RATIO === 0){
				increaseDifficulty("faster");
			}		

			_this.nextSequence();
		}
	}

	function displayColorSequence(colors){
		for(var i = 0; i < colors.length; i++){
			blinkColor(colors[i], i);
		}

		_sequenceStack = $.extend(true, [], _this._currentSequence); // deep copy
		_sequenceStack.reverse(); // reverse to make it a poppable stack
	}

	function blinkColor(color, i){
		setTimeout(function(){
			debug("activating " + color);
			$("." + color).toggleClass("active");

			setTimeout(function(){
				$("." + color).toggleClass("active");
			}, COLOR_BLINK_DURATION)
		}, (COLOR_BLINK_DURATION * i) + 10);		
	}

	function increaseDifficulty(mode){
		if(mode == "faster"){
			debug('faster')
			COLOR_BLINK_DURATION -= 50;
			if(COLOR_BLINK_DURATION < 50){
				COLOR_BLINK_DURATION = 50;
			}
			showMessage("Faster!", true)	
		}

		if(mode == "addColors"){
			for(var i = 0; i < 4; i++){
				var color = _this._additionalColors.pop();
				_this._colors.push(color)
				var s = "<div class='square {color} height-fifty' data-color={color}></div>".replace("{color}", color).replace("{color}", color)
				$(".container").append(s);
			}
		
			$(".square").removeClass("width-fifty").addClass("width-twentyfive");
			showMessage("Harder!")
		}

		if(mode == "shuffle"){
			$(".container .square").shuffle();
			showMessage("Shuffle!")
		}		
	}


	function getNextColor(){
		var n = Math.floor((Math.random() * _this._colors.length));
		return _this._colors[n];
	}

	function debug(msg){
		if(DEBUG){
			console.log(msg)
		}
	}

	function showMessage(msg, animated){
		if(animated){
			$(".message").text(msg).show().addClass("animated fadeOut");
			setTimeout(function(){
				$(".message").text("").hide().removeClass("animated fadeOut");
			}, 300);
		}
		else{
			$(".message").text(msg).show()
		}		
	}

	function getColorSound(color){
		if(color == "red"){
			return 310;
		}

		if(color == "blue")
			return 209

		if( color == "green")
			return 415;

		if(color == "yellow")
			return 252;
	}

}

$.fn.shuffle = function() {
 
    var allElems = this.get(),
        getRandom = function(max) {
            return Math.floor(Math.random() * max);
        },
        shuffled = $.map(allElems, function(){
            var random = getRandom(allElems.length),
                randEl = $(allElems[random]).clone(true)[0];
            allElems.splice(random, 1);
            return randEl;
       });

    this.each(function(i){
        $(this).replaceWith($(shuffled[i]));
    });

    return $(shuffled);

};