//Javascript class: SlideFIB

/*
Requirements for use:
    -requires class MultiTextDisplay_170407.js (or any later version of MultiTextDisplay)
    -need a text field to input the time to transition between slides
    -need an area to display text
*/
var isIE = document.all;

function SlideFIB( arrBlankSent, arrAnswers, topUCW, displayID, timerID ) {        //SlideFIB = Slide Fill-In-the-Blanks
    //VAR: arrBlankSent = array of sentences that contains a blank sentence that requires an answer (retrieved from class FillInBlank)
    //VAR: arrAnswers = array that has answers that correspond to arrBlankSent (retrieved from class FillInBlank)
    //VAR: topUCW (topUCW = top Uncommon Words) = an array of the top Uncommon Words (retrieved from class FillInBlank)
    //VAR: displayID = string that is the ID where the text will be displayed
    //VAR: timerID = string that is the ID for an input field that will contain the seconds between transitions
    //CONSTRUCTOR: this is the constructor for the class SlideFIB
    this.tracker = 0;       //this tracks the current slide 
    this.direction = 1;     //this is the direction the text will be displayed - forward, backward, pause

    //create MultiTextDisplay instance
    this.topUCW = topUCW;
    this.mtd = new MultiTextDisplay( topUCW, [0, 1, 2, 3, 4] );

    //assign methods to show text
    this.arrBlankSent = arrBlankSent;
    this.arrAnswers = arrAnswers;
    this.displayID = displayID;

    //variables for timing slides
    this.timerID = timerID;
    this.intervalTimer;     //this is the interval timer for changing slides

    //class variables
    SlideFIB.boolPause = false;
    SlideFIB.offsetY = 50;       //used for the offset for letting text fade in & fade out
    SlideFIB.effectDelay = 600;

    //TEST::
    console.log( "SlideFIB start: show answers = ", this.arrAnswers );
}

//class variables
SlideFIB.slideDisappear = function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideFIB.offsetY,
            opacity: "0"
        }, SlideFIB.effectDelay );
}

//MAY DELETE THIS AS I ALREADY HAVE this.slideInterface
// SlideFIB.slideInterface = function( slideID, strSlide, strAnswer ) {
//     //VAR: slideID = integer that is the slide number
//     //VAR: strSlide = the string to display in the display area "displayID"
//     //VAR: strAnswer = string that is the answer to the slide
//     //METHOD: returns an html interface for fill-in-the-blank
//     //get window dimensions
//     var docWidth = $( window ).width();
//     var docHeight = $( window ).height();

//     //set the font-size
//     var percentFont = 0.05;
//     var textSize = docHeight * percentFont;       //global variable that sets the font-size

//     var dispSlide = "<span id='newSlide' style='position:relative; font-size:"+ textSize +"px;'>";
//     dispSlide += slideID + ": " + strSlide + "<br/>";

//     //Type answer & submit answer
//     dispSlide += "<input id = 'userAnswer' class = 'largeText' style = 'font-size:"+ textSize +"px;' type = 'text'/>";
//     dispSlide += "<button class = 'buttonBlue' onclick = 'SlideFIB.submitAnswer()' style = 'font-size:"+ textSize +"px;'>Submit Answer</button><br/>";
    
//     //button to help find answer
//     dispSlide += "<button class = 'buttonBlue' slideAnswer = '" + strAnswer + "' onclick = 'SlideFIB.showAnswer(event)'>Get Answer</button>&nbsp;&nbsp;&nbsp;";
//     dispSlide += "<button class = 'buttonRed'>Hint 1</button>&nbsp;&nbsp;&nbsp;";
//     dispSlide += "<button class = 'buttonRed' onclick = ''>Hint 2</button>";
//     dispSlide += "</span>";
//     dispSlide += "<input type = 'hidden' id = 'slideAnswer' value = '" + strAnswer + "'>";

//     return dispSlide;
// }

//MAY DELETE THIS AS I ALREADY HAVE
// SlideFIB.slideAppear = function( slideID, strSlide, strAnswer, displayID ) {
//     //VAR: slideID = integer that is the slide number
//     //VAR: strSlide = the string to display in the display area "displayID"
//     //VAR: strAnswer = string that is the answer to the blank in "strSlide"
//     //VAR: displayID = string that is the element ID where the slide will be displayed
//     //METHOD: makes a slide appear using slide animation

//     //create text that will be displayed
//     var dispSlide = SlideFIB.slideInterface( slideID, strSlide);
//     //add the displayed text to the larger display area
//     $( "#" + displayID ).html( dispSlide );

//     //get dimensions for display area
//     var outerHeight = $( "#newSlide" ).outerHeight(); 
//     var outerWidth = $( "#newSlide" ).outerWidth(); 

//     //get the middle point of the height & width
//     var midH = ( parseInt($( "#" + displayID ).css("height") ) - outerHeight ) / 2;
//     var midW = ( parseInt($( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
//     //position the string sentence
//     $( "#newSlide" ).css( {"top" : midH + SlideFIB.offsetY, "left" : midW, "opacity" : "0"} );

//     $( "#newSlide" ).animate( {
//             top: "-=" + SlideFIB.offsetY,
//             opacity: "1"
//         }, SlideFIB.effectDelay );

    
//     //TEST::
//     console.log( "cL in classSlideFIB = ", slideID, " & answer = ", strAnswer );

//     //Code for displaying & removing slide
//     //     $( "#newSlide" ).animate( {
//     //         top: "-=" + SlideFIB.offsetY,
//     //         opacity: "1"
//     //     }, "slow" ).delay( inputSpeed ).animate( {
//     //         top: "-=" + SlideFIB.offsetY,
//     //         opacity: "0"
//     //     }, "slow", function() {
//     //         thisObj.moveDirection();
//     //         thisObj.slideController();
//     //     });
// }

SlideFIB.submitAnswer = function( e ) {
    //METHOD: this shows the answer to the slide
    var userInput = $('#userAnswer').val();
    var answer = $('#slideAnswer').val();

    //display answer
    var strOutput = userInput + " | answer = " + answer;
    $('#userAnswer').val( strOutput );
}

SlideFIB.showAnswer = function( e ) {
    //METHOD: retrieves & shows the answer of the slide
    $('#userAnswer').val( $(e.target).attr('slideAnswer') );
}

SlideFIB.changeMCQColor = function( e ) {
    //METHOD: changes the color of the answer depending on if it is the correct answer or not. Correct answer will have attribute correctAns = 1, else if incorrect it will be correctAns = 0.
    if ( parseInt( $(e.target).attr('correctAns') ) == 1 )
        $(e.target).css( "background-color", "hsla(99, 100%, 50%, 1)" );
    else
        $(e.target).css( "background-color", "hsla(288, 100%, 50%, 1)" );
}

SlideFIB.prototype = {
    constructor: SlideFIB,

    /* Functions: Show 

    /* Functions: Display & Controls Slides*/

    //controller - change the direction of the controller
    setDirection: function( direction ) {
        this.direction = direction;
    },

    //move in desired direction
    moveDirection: function() {
        //decide the direction. 0 = pause, 1 = forward, 2 = backwards
        if ( this.direction == 0 )
            this.slidePause();
        else if ( this.direction == 1 )
            this.slideForward();
        else if ( this.direction == 2 )
            this.slideBackward();
    },

    //MIGHT DELETE LATER AS THIS MAY BE REPLACED BY slideInterfaceV2
    // slideInterface: function( slideID ) {
    //     //VAR: slideID = integer that is the slide number
    //     //VAR: strSlide = the string to display in the display area "displayID"
    //     //VAR: strAnswer = string that is the answer to the slide
    //     //METHOD: returns an html interface for fill-in-the-blank
    //     //retrieve the slide information & answer
    //     var strSlide = this.arrBlankSent[ slideID ];
    //     var strAnswer = this.arrAnswers[ slideID ];

    //     //get window dimensions
    //     var docWidth = $( window ).width();
    //     var docHeight = $( window ).height();

    //     //set the font-size
    //     var percentFont = 0.05;
    //     var textSize = docHeight * percentFont;       //global variable that sets the font-size

    //     var dispSlide = "<span id='newSlide' style='position:relative; font-size:"+ textSize +"px;'>";
    //     dispSlide += slideID + ": " + strSlide + "<br/>";

    //     //Type answer & submit answer
    //     dispSlide += "<input id = 'userAnswer' class = 'largeText' style = 'font-size:"+ textSize +"px;' type = 'text'/>";
    //     dispSlide += "<button class = 'buttonBlue' onclick = 'SlideFIB.submitAnswer()' style = 'font-size:"+ textSize +"px;'>Submit Answer</button><br/>";
        
    //     //button to help find answer
    //     dispSlide += "<button class = 'buttonBlue' slideAnswer = '" + strAnswer + "' onclick = 'SlideFIB.showAnswer(event)'>Get Answer</button>&nbsp;&nbsp;&nbsp;";     //NOTE: for this, keep attribute slideAnswer = '" + strAnswer + "' as it will help me remember how to call 
    //     dispSlide += "<button id = 'hintMCQ' class = 'buttonRed'>Hint MCQ</button>&nbsp;&nbsp;&nbsp;";
    //     dispSlide += "<button class = 'buttonRed' onclick = ''>Hint 2</button>";
    //     dispSlide += "<br/><span id = 'dispMCQ'></span>";
    //     dispSlide += "</span>";
    //     dispSlide += "<input type = 'hidden' id = 'slideAnswer' value = '" + strAnswer + "'>";

    //     return dispSlide;
    // },

    slideInterfaceV2: function( slideID ) {
        //VAR: slideID = integer that is the slide number
        //VAR: strSlide = the string to display in the display area "displayID"
        //VAR: strAnswer = string that is the answer to the slide
        //METHOD: returns an html interface for fill-in-the-blank
        //retrieve the slide information & answer
        var strSlide = this.arrBlankSent[ slideID ];
        var strAnswer = this.arrAnswers[ slideID ];

        //get window dimensions
        var docWidth = $( window ).width();
        var docHeight = $( window ).height();

        //set the font-size
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size

        //retrieve text slide from class MultiTextDisplay
        // var htmlSlide = this.mtd.displayTextArrayCustom( strSlide, strAnswer );
        var htmlSlide = this.mtd.selectTextDisplay( this.mtd.defaultView, strSlide, strAnswer );

        var dispSlide = "<span id = 'newSlide' style = 'position:relative; font-size:"+ textSize +"px;'>";
        dispSlide += slideID + ": " + htmlSlide + "<br/>";

        //buttons to select different text display (e.g. highlight words, single word blank, all words blank)
        dispSlide += "<button id = 'mtd_plain' class = 'buttonBlue'>Plain Text</button>&nbsp;&nbsp;&nbsp;"
        dispSlide += "<button id = 'mtd_hilite' class = 'buttonBlue'>Highlight Text</button>&nbsp;&nbsp;&nbsp;"
        dispSlide += "<button id = 'mtd_blank_all' class = 'buttonBlue'>Blank All</button>&nbsp;&nbsp;&nbsp;"
        dispSlide += "<button id = 'mtd_blank_ans' class = 'buttonBlue'>Blank Answer</button>&nbsp;&nbsp;&nbsp;"
        dispSlide += "<button id = 'mtd_blank_ans_hilte' class = 'buttonBlue'>Blank Answer w/ Highlight</button>&nbsp;&nbsp;&nbsp;"

        //Type answer & submit answer
        dispSlide += "<input id = 'userAnswer' class = 'largeText' style = 'font-size:"+ textSize +"px;' type = 'text'/>";
        dispSlide += "<button class = 'buttonBlue' onclick = 'SlideFIB.submitAnswer()' style = 'font-size:"+ textSize +"px;'>Submit Answer</button><br/>";
        
        //button to help find answer
        dispSlide += "<button class = 'buttonBlue' slideAnswer = '" + strAnswer + "' onclick = 'SlideFIB.showAnswer(event)'>Get Answer</button>&nbsp;&nbsp;&nbsp;";     //NOTE: for this, keep attribute slideAnswer = '" + strAnswer + "' as it will help me remember how to call 
        dispSlide += "<button id = 'hintMCQ' class = 'buttonRed'>Hint MCQ</button>&nbsp;&nbsp;&nbsp;";
        dispSlide += "<button class = 'buttonRed' onclick = ''>Hint 2</button>";
        dispSlide += "<br/><span id = 'dispMCQ'></span>";
        dispSlide += "</span>";
        dispSlide += "<input type = 'hidden' id = 'slideAnswer' value = '" + strAnswer + "'>";

        return dispSlide;
    },

    changeTextView: function( viewMode, slideID ) {
        //METHOD: changes the way the text is displayed, and changes the default view as well
        //change the default text display mode (e.g. plain text, highlight answers, etc.)
        this.mtd.setDefaultView( viewMode );

        //reshow slide
        this.slideAppear( slideID );
    },

    slideInterfaceFunctionality: function( slideID ) {
        //METHOD: establish functionality to slides
        //NOTE: look at playJS.html post "//16.7.18 - IMPORTANT: passing 'this' to a method or function using function.call()" --> describes 
        var that = this;
        $( '#hintMCQ' ).click( function() { SlideFIB.prototype.displayMultipleChoice.call( that, slideID ); } );
        //try using .bind( this ) - I DON'T KNOW HOW
        //set buttons for viewing string slide
        $( '#mtd_plain' ).click( function() { SlideFIB.prototype.changeTextView.call( that, 0, slideID ); } );
        $( '#mtd_hilite' ).click( function() { SlideFIB.prototype.changeTextView.call( that, 1, slideID ); } );
        $( '#mtd_blank_all' ).click( function() { SlideFIB.prototype.changeTextView.call( that, 2, slideID ); } );
        $( '#mtd_blank_ans' ).click( function() { SlideFIB.prototype.changeTextView.call( that, 3, slideID ); } );
        $( '#mtd_blank_ans_hilte' ).click( function() { SlideFIB.prototype.changeTextView.call( that, 4, slideID ); } );

        // var strSlide = this.arrBlankSent[ slideID ];
        // var strAnswer = this.arrAnswers[ slideID ];
        // $( '#mtd_plain' ).click( function() { this.mtd.prototype.selectTextDisplay.bind( this, 0, strSlide, null ); } );
        // $( '#mtd_hilite' ).click( function() { this.mtd.prototype.selectTextDisplay.bind( this, 1, strSlide, null ); } );
        // $( '#mtd_blank_all' ).click( function() { this.mtd.prototype.selectTextDisplay.bind( this, 2, strSlide, null ); } );
        // $( '#mtd_blank_ans' ).click( function() { this.mtd.prototype.selectTextDisplay.bind( this, 3, strSlide, strAnswer ); } );
        // $( '#mtd_blank_ans_hilte' ).click( function() { this.mtd.prototype.selectTextDisplay.bind( this, 4, strSlide, strAnswer ); } );
    },


    slideAppear: function( slideID ) {
        //VAR: slideID = integer that is the slide number
        //VAR: strSlide = the string to display in the display area "displayID"
        //VAR: strAnswer = string that is the answer to the blank in "strSlide"
        //VAR: displayID = string that is the element ID where the slide will be displayed
        //METHOD: makes a slide appear using slide animation
        var strSlide = this.arrBlankSent[ slideID ];
        var strAnswer = this.arrAnswers[ slideID ];

        //create text that will be displayed
        // var dispSlide = SlideFIB.slideInterface( slideID, strSlide, strAnswer );
        // var dispSlide = this.slideInterface( slideID );      //version 1 of displaying slide
        var dispSlide = this.slideInterfaceV2( slideID );       //version 2 of displaying slide
        //add the displayed text to the larger display area
        $( "#" + this.displayID ).html( dispSlide );

        //get dimensions for display area
        var outerHeight = $( "#newSlide" ).outerHeight(); 
        var outerWidth = $( "#newSlide" ).outerWidth(); 

        //get the middle point of the height & width
        var midH = ( parseInt($( "#" + this.displayID ).css("height") ) - outerHeight ) / 2;
        var midW = ( parseInt($( "#" + this.displayID ).css("width") ) - outerWidth ) / 2;
        
        //position the string sentence
        $( "#newSlide" ).css( {"top" : midH + SlideFIB.offsetY, "left" : midW, "opacity" : "0"} );

        $( "#newSlide" ).animate( {
                top: "-=" + SlideFIB.offsetY,
                opacity: "1"
            }, SlideFIB.effectDelay );

        //set functionality to each button
        this.slideInterfaceFunctionality( slideID );

        //Code for displaying & removing slide
        //     $( "#newSlide" ).animate( {
        //         top: "-=" + SlideFIB.offsetY,
        //         opacity: "1"
        //     }, "slow" ).delay( inputSpeed ).animate( {
        //         top: "-=" + SlideFIB.offsetY,
        //         opacity: "0"
        //     }, "slow", function() {
        //         thisObj.moveDirection();
        //         thisObj.slideController();
        //     });
    },

    displayMultipleChoice: function( slideID ) {
        //VAR: slideID = integer that is the slideID - will be used to retrieve the correct answer
        //METHOD: displays Multiple Choice Questions (MCQ) 

        console.log( "displayMultipleChoice: this = ", this, " & slideID = ", slideID );

        var getMCQ = this.createMultipleChoice( slideID );      //MCQ = Multiple Choice Questions
        $('#dispMCQ').html( getMCQ );
    },

    createMultipleChoice: function( slideID ) {
        //VAR: slideID = integer that is the slideID - will be used to retrieve the correct answer
        //METHOD: creates a set of multiple choice answers for the user to select from
        var strAnswer = this.arrAnswers[ slideID ];
        //retrieve an array of indices for answers
        var arrWC = this.topUCW.slice(0);       //this is a way to duplicate an array, and apparently ".slice(0)" is faster than ".slice()"
        arrWC.rmVal( strAnswer );

        //retrieve the list of multiple choice questions (MCQ) for presentation
        var listMCQ = [strAnswer];      //listMCQ = list of Multiple Choices for Question
        var numFakeAnswers = 3;
        for (var i = 0; i < numFakeAnswers; i++ ) {
            //randomly select an index that will be the answer
            var selectI = Math.floor( Math.random() * arrWC.length );
            listMCQ.push( arrWC[selectI] );
            arrWC.splice( arrWC[selectI], 1 );       //remove the index so it will not be double-selected
        }
        //shuffle list of answers
        listMCQ.shuffle();

        //display multiple choice results
        var statusAnswer;
        var buttonStyle = "padding: 5px; border: 0px; background-color: hsla(200, 100%, 50%, 1); color: #272b34; -moz-border-radius: 7px; -webkit-border-radius: 7px; border-radius: 7px; cursor: pointer;";
        var displayMCQ = "";
        for ( var mcq of listMCQ ) {
            ( mcq == strAnswer ) ? statusAnswer = 1 : statusAnswer = 0;
            displayMCQ += "<button onclick = 'SlideFIB.changeMCQColor(event)'  correctAns = '" + statusAnswer + "' style = '" + buttonStyle + "'>" + mcq + "</button><br/>";
        }

        return displayMCQ;
    },

    //NOTE: SHOULD RENAME THIS FUNCTION
    slideController: function( direction ) {
        //METHOD: controls the flow of slides being presented

        //prepare display text by incrementing to next slide and then prepare to show the slide
        this.setDirection( direction );
        this.moveDirection();

        //if element id = newSlide exists, then make it disappear
        SlideFIB.slideDisappear();

        //TEST:: console.log( "slideController: direction = ", direction, " & slideID = ", this.tracker );

        //display slide
        // SlideFIB.slideAppear( this.arrBlankSent[ this.tracker ], this.displayID );
        // setTimeout( SlideFIB.slideAppear, SlideFIB.effectDelay, this.tracker, this.arrBlankSent[this.tracker], this.displayID );
        //for using "setTimeout", need to reference "this" outside of setTimeout as "this" in setTimeout will refer to the Window object, not the object you are actually using.
        var that = this;
        setTimeout( function() { that.slideAppear( that.tracker ) }, SlideFIB.effectDelay );
    },

    slidePlay: function() {
        //retrieve time
        var slideRate = parseInt( $( "#" + this.timerID ).val() )
        if ( isNaN(slideRate) )     //if not a number, then set to default value of 5000 milliseconds
            slideRate = 3 * 1000;
        else
            slideRate *= 1000;

        //TEST::
        console.log( "slidePlay timer = ", slideRate );
        
        //set speed
        var t = this;
        clearInterval( this.intervalTimer );
        this.intervalTimer = setInterval( function() { t.slideController( 1 ); }, slideRate );
    },

    slidePause: function() {
        //METHOD: will pause on the current slide
        clearInterval( this.intervalTimer );
    },

    slideForward: function() {
        //METHOD: will play the slides forward
        this.tracker++;
        if ( this.tracker >= this.arrBlankSent.length )
            this.tracker = 0
    },

    slideBackward: function() {
        //METHOD: will play the slides backwards
        this.tracker--;
        if ( this.tracker < 0 )
            this.tracker = this.arrBlankSent.length - 1;
    },
};


//OTHER FUNCTIONS
function arrTools_shuffleArray( getArr ) {
    //METHOD: this function will shuffle the elements in an array
    return getArr.sort(function(){return 0.5 - Math.random();});
}

//NOTE: need to use 'enumerable, configurable, writable', especially when 
Object.defineProperty( Array.prototype, 'shuffle', {
    value: function() {
        //METHOD: shuffles elements in an array so it is randomized
        var currentIndex = this.length, temporaryValue, randomIndex;

        //while there are array elements to shuffle
        while ( 0 !== currentIndex ) {
            //generate a random number
            randomIndex = Math.floor( Math.random() * currentIndex );
            currentIndex -= 1;

            temporaryValue = this[currentIndex];
            this[currentIndex] = this[randomIndex];
            this[randomIndex] = temporaryValue;
        } 
    },
    enumerable: false,          //if enumerable NOT set to false, then will encounter this function when traversing any array
    configurable: false,
    writable: false,
});

Object.defineProperty( Array.prototype, 'rmVal', {
    value: function( rmVal ) {
        //METHOD: removes value 'rmVal' if present
        var i = this.indexOf( rmVal );
        if ( i > -1 )
            this.splice( i, 1 );
    },
    enumerable: false,          //if enumerable NOT set to false, then will encounter this function when traversing any array
    configurable: false,
    writable: false,
} );
