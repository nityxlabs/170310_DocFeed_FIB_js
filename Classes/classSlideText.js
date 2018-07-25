//Javascript class: SlideText

/*
Requirements for use:
    -need a text field to input the time to transition between slides
    -need an area to display text
*/


function SlideText( arrSlides, displayID, timerID ) {
    //VAR: arrSlides = array of text that will be displayed transiently
    //VAR: displayID = string that is the ID where the text will be displayed
    //VAR: timerID = string that is the ID for an input field that will contain the seconds between transitions
    //CONSTRUCTOR: this is the constructor for the class SlideText
    this.tracker = 0;       //this tracks the current slide 
    this.direction = 1;     //this is the direction the text will be displayed - forward, backward, pause    

    this.arraySlides = arrSlides;
    this.displayID = displayID;
    this.timerID = timerID;
    this.intervalTimer;     //this is the interval timer for changing slides

    //class variables
    SlideText.boolPause = false;
    SlideText.offsetY = 50;       //used for the offset for letting text fade in & fade out
    SlideText.effectDelay = 600;
}

//class variables
SlideText.slideDisappear = function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "0"
        }, SlideText.effectDelay );
}

SlideText.slideAppear = function( slideID, strSlide, displayID ) {
    //VAR: strSlide = the string to display in the display area "displayID"
    //METHOD: makes a slide appear using slide animation
    //get window dimensions
    var docWidth = $( window ).width();
    var docHeight = $( window ).height();

    //set the font-size
    var percentFont = 0.05;
    var textSize = docHeight * percentFont;       //global variable that sets the font-size

    //create text that will be displayed
    var dispSent = "<span id='newSlide' style='position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + slideID + ": " + strSlide + "</span>";
    //add the displayed text to the larger display area
    $( "#" + displayID ).html( dispSent );

    //get dimensions for display area
    var outerHeight = $( "#newSlide" ).outerHeight(); 
    var outerWidth = $( "#newSlide" ).outerWidth(); 

    //get the middle point of the height & width
    var midH = ( parseInt($( "#" + displayID ).css("height") ) - outerHeight ) / 2;
    var midW = ( parseInt($( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
    //position the string sentence
    $( "#newSlide" ).css( {"top" : midH + SlideText.offsetY, "left" : midW, "opacity" : "0"} );

    $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "1"
        }, SlideText.effectDelay );

    
    //TEST::
    console.log( "cL in classSlideText = ", slideID );

    //Code for displaying & removing slide
    //     $( "#newSlide" ).animate( {
    //         top: "-=" + SlideText.offsetY,
    //         opacity: "1"
    //     }, "slow" ).delay( inputSpeed ).animate( {
    //         top: "-=" + SlideText.offsetY,
    //         opacity: "0"
    //     }, "slow", function() {
    //         thisObj.moveDirection();
    //         thisObj.slideController();
    //     });
}

SlideText.prototype = {
    constructor: SlideText,

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

    //NOTE: SHOULD RENAME THIS FUNCTION
    slideController: function( direction ) {
        //METHOD: controls the flow of slides being presented

        //prepare display text by incrementing to next slide and then prepare to show the slide
        this.setDirection( direction );
        this.moveDirection();

        //if element id = newSlide exists, then make it disappear
        SlideText.slideDisappear();


        //TEST::
        console.log( "slideController: direction = ", direction, " & slideID = ", this.tracker );

        //display slide
        // SlideText.slideAppear( this.arraySlides[ this.tracker ], this.displayID );
        setTimeout( SlideText.slideAppear, SlideText.effectDelay, this.tracker, this.arraySlides[this.tracker], this.displayID );
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
        if ( this.tracker >= this.arraySlides.length )
            this.tracker = 0
    },

    slideBackward: function() {
        //METHOD: will play the slides backwards
        this.tracker--;
        if ( this.tracker < 0 )
            this.tracker = this.arraySlides.length - 1;
    },
};



//Functional Programming: Flash Sentence
// function flashSentV4_display( arrSentI, loopCounter, boolStat )
// {
//     //VAR: arrSentI = array of sentence indices that are shuffled
//     //VAR: loopCounter = integer that will access each index in the array "arrSentI"
//     //VAR: boolStat = boolean that, if true, will continue to randomly show sentences, else if false will stop showing sentences
//     //METHOD: this function will display sentences in a fading manner
//     //STEP: retrieve the sentence to display
//     var offsetY=50;
//     var inputSpeed=parseInt($("#setSpeed").val())*1000;     //Need to convert it into milliseconds
//     var currSentI=arrSentI[loopCounter%(arrSentI.length)];

//     console.log("fSV4_All - currSentI = "+currSentI+" | "+g_objDoc.arrCompSent[currSentI]);

//     //STEP: place text within flash window & position it
//     var dispSent="<span id='newSent' style='position:relative;font:"+g_fontSize+"px Rockwell, Georgia, serif;'>"+g_objDoc.arrCompSent[currSentI]+"</span>";
//     $("#displayText").html(dispSent);


//     //STEP: get the offset height & width - will only retrieve the height & width of an element after it exists in the DOM
//     var getOuterHeight=$("#newSent").outerHeight();
//     var getOuterWidth=$("#newSent").outerWidth();

//     //STEP: get the middle point of the height & width
//     var midHeight=(parseInt($("#displayText").css("height"))-getOuterHeight)/2;
//     var midWidth=(parseInt($("#displayText").css("width"))-getOuterWidth)/2;
    
//     //STEP: position the string sentence
//     $("#newSent").css({"top":midHeight+offsetY,"left":midWidth,"opacity":"0"});

//     //STEP: Start the animation 
//     if(boolStat)
//     {
//         $("#newSent").animate({
//             top: "-="+offsetY,
//             opacity: "1"
//         },"slow").delay(inputSpeed).animate({
//             top: "-="+offsetY,
//             opacity: "0"
//         },"slow", function(){
//             loopCounter++;
//             flashSentV4_display(arrSentI,loopCounter,boolStat);
//         });
//     }
//     //Else cease the animation
//     //METHOD 1: remove all text from viewing box
//     // else
//     // {
//     //  $("#newSent").animate({
//     //      top: "-="+offsetY,
//     //      opacity: "1"
//     //  },"slow").stop();
//     // }
//     //METHOD 2: leave last sentence showing
//     else
//     {
//         $("#newSent").stop();
//         $("#newSent").animate({
//             top: "-="+offsetY,
//             opacity: "1"
//         },"slow");
//     }
// }

// function flashSentV4( boolStat )
// {
//     //VAR: boolStat = boolean that, if true, will continue to randomly show sentences, else if false will stop showing sentences
//     //METHOD: this function will prepare variables needed for function flashSentV4_display()

//     //STEP: retrieve the sentence indices of interest, should return an array of indices
//     var arrSentI=flashSentV2_getSentI_v0(g_objDoc.arrCompSent,false);

//     //STEP: go through each sentence index, displaying each sentence
//     var loopCounter=0;      //loopCounter = this will continue to access different elements in the array "g_arrFullSent"
//     flashSentV4_display(arrSentI,loopCounter,boolStat);
// }