//Class MultiTextDisplay.js
//METHOD: controls visibility of specific words in document

/*
Requires:
-classStemmer.js: need class DocManip class (use to remove common words)
-DocAnalysis_17310.js
    -retrieve the top X words that are uncommon
*/

function MultiTextDisplay( listWords, listDisplayModes ) {
    /*
    VAR: listWords = array of words that will be used to see if they are contained in a given text. These words are considsered the "words of interest" that should be highlighted (or even "blanked")
    VAR: listDisplayModes = array that contains integer values of types of displays. Each integer corresponds to the following:
        -0 = plain text
        -1 = highlighted text -> highlight words that are in this.listWords
        -2 = "blank" all words -> takes words from this.listWords and replaces with a "blank"
        -3 = "blank" specific word -> replaces a specific word in the slide, does not highlight any of the other words
        -4 = "blank" specific word, highlight other words -> combines 1 & 3, where it removes one of the words & highlights all the words in this.listWords
    */

    this.listWords = listWords;
    this.wordColors = MultiTextDisplay.assignWordColors( listWords );        //hash where key = word, value = hsla color
    this.listDisplayModes = listDisplayModes;
    // this.defaultView = listDisplayModes[0];      //should do this if I will continue using function displayTextArrayCustom()
    this.defaultView = 0;       //related to modes of listDisplayModes written above

    //assign functions to hash
    this.hashMTDFunc = {        //hashMTD = hash MultiTextDisplay Functions
        0: MultiTextDisplay.prototype.returnPlainText,
        1: MultiTextDisplay.prototype.textHiLiteWords.bind( this ), 
        2: MultiTextDisplay.prototype.textHideWords.bind( this ),
        3: MultiTextDisplay.prototype.textHideSingleWord.bind( this ),
        4: MultiTextDisplay.prototype.textHSWHLW.bind( this ),
    };

    //hashMTDLabels = labels for each function
    //HSW_HLW = text Hide Single Word / HighLight Word
    this.hashMTDLabels = {
        0: 'Plain',
        1: 'Highlight',
        2: 'Hide Words',
        3: 'Single Word',
        4: 'HSW_HLW',
    };

    console.log( "MTD.__init__ -> this.wordColors = ", this.wordColors );
}

MultiTextDisplay.assignWordColors = function( listWords ) {
    //METHOD: assigns a color to each word (most likely using hsla)
    var numColors = 340 / listWords.length;     //I don't want to make it exactly 360 because I don't want the first & last word to be the same color
    
    //create array of colors for words
    var hslaStr = "";
    var hashWordColors = {};
    for (var i in listWords) {
        hslaStr = "hsla(" + (numColors * i) + ", 100%, 50%, 1)";
        hashWordColors[ listWords[i] ]  = hslaStr;
    }

    return hashWordColors;
}

MultiTextDisplay.toggleTV = function( val ) {
    //METHOD: toggles between different text slides
    // val = parseInt( val );
    var selectElem = $( "[id*=mtd_tv_]" ).css('display', 'none' );
    $( "[id=mtd_tv_" + val + "]" ).css('display', 'block');
}

MultiTextDisplay.prototype = {
    constructor: MultiTextDisplay,

    setDefaultView: function( setView ) { 
        //METHOD: sets the property for the default text view (see this.hashMTDFunc to see the available views)
        this.defaultView = setView;
    },

    returnPlainText: function( getText ) {
        //METHOD: I made this function for this.hashMTDFunc()
        return getText;
    },

    findWords: function( getText ) {
        //METHOD: this returns an array of all words found in string 'getText'
        return this.listWords.map( function( w, i ) {       //w = element in array, i = index of element in array
            var objRegEx = new RegExp( w, 'gi' );
            if ( objRegEx.test( getText ) )
                return w;
        }).filter( function(x){ return x; } );      //the filter step is to remove any blank elements (blank elements will be created when the word isn't in the text, therefore nothing is returned)
    },

    textHiLiteWords: function( getText ) {
        //VAR: getText = string where words will be highlighted
        //METHOD: highlights words in array 'this.listWords' in the text 'getText'
        var wordHL, objRegExp;
        //find which words are present
        var wordsPresent = this.findWords( getText );

        console.log( "MTD.HiLite 0: wordsPresent =", wordsPresent );

        //create text version that highlights the words
        var cssHL = "color:#111111;-moz-border-radius:3px;-webkit-border-radius:3px;";
        // var that = this;     //don't need this since I'm using .bind( this )
        wordsPresent.forEach( function( w, i ) {
            objRegExp = new RegExp( w, 'gi' );
            wordHL = "<span style = 'background-color:" + this.wordColors[w] + ";" + cssHL + "'>" + w + "</span>";
            getText = getText.replace( objRegExp, wordHL );
            console.log( "MTD.HiLite loop END ", i, "  - ", w );
        }.bind( this ) );       //NOTE: Need to use .bind( this ) as "this" in .forEach refers to "Window" object instead of "MultiTextDisplay" is  using .bind(this) replaces the use of "var that = this;"

        return getText;
    },

    textHideSingleWord: function( getText, rmWord ) {
        //VAR: getText = string where words will be manipulated based on words present in this.listWords
        //VAR: rmWord = word that will be removed from getText
        //METHOD: return string 'getText' by replacing string 'word' with '______'
        var objRegExp = new RegExp( rmWord, 'gi' );
        return getText.replace( objRegExp, '______' );
    },

    textHSWHLW: function( getText, rmWord ) {     //textHSWHLW = text Hide Single Word / HighLight Word
        //METHOD: combines functions textHideSingleWord() and then textHiLiteWords()
        var textRSW = this.textHideSingleWord( getText, rmWord );     //textRSW = text Remove Single Word
        return this.textHiLiteWords( textRSW );
    },

    textHideWords: function( getText ) {
        //VAR: getText = string where words will be manipulated based on words present in this.listWords
        //METHOD: hides words in array 'this.listWords' in the text 'getText'
        //find which words are present
        var wordsPresent = this.findWords( getText );

        //create text version that hides the words
        wordsPresent.forEach( function( w, i ) {
            var objRegExp = new RegExp( w, 'gi' );
            getText = getText.replace( objRegExp, '______' );
        }.bind( this ) );       //NOTE: Need to use .bind( this ) as "this" in .forEach refers to "Window" object instead of "MultiTextDisplay" is  using .bind(this) replaces the use of "var that = this;"

        return getText;
    },

    //MAY DELETE THIS - OBSOLETE BY displayTextArrayCustom()
    // displayTextArray: function( getText ) {
    //     //VAR: getText = string that will be displayed in multiple
    //     //VAR: this.defaultView = integer that will make a specific element visible, where 1 = plain text visible, 2 = highlighted text is visible, & 3 = text with blanks is visible.
    //     //METHOD: display the text in multiple ways, including plain, highlighted, and blank
    //     var htmlText = ""; var htmlButtons = ""; var visibleText = ""; var fullHTML = "";

    //     //get the highlighted text
    //     var textHiLite = this.textHiLiteWords( getText );
    //     var textBlanks = this.textHideWords( getText );

    //     //prepare text for being displayed
    //     var listTV = [ getText, textHiLite, textBlanks ];       //listTV = array of Text Version
    //     var hashLabel = {0: 'Plain', 1: 'Highlight', 2: 'Blank'};       //this is the label for each type of text
    //     for (var i in listTV) {
    //         //determine if text should be visible or not. NOTE: mtd_tv = MultiTextDisplay Text Version
    //         (i == this.defaultView) ? visibleText = 'block' : visibleText = 'none';
    //         htmlText += "<div id = 'mtd_tv_" + i + "' version = '" + i + "' style = 'display:" + visibleText + ";'>" + listTV[i] + "</div>";
    //         htmlButtons += "<button onclick = 'MultiTextDisplay.toggleTV(" + i + ")'>" + hashLabel[i] + "</button>&nbsp;&nbsp;&nbsp;";
    //     }
    //     fullHTML = htmlText + "<br/>" + htmlButtons;

    //     return fullHTML;
    // },

    selectTextDisplay: function( mode, getText, rmWord ) {
        //VAR: mode = integer that corresponds to keys in hash this.hashMTDFunc --> calls a specific method to display text. Look a class declaration to see what each number means.
        //VAR: getText = string that will be manipulated for display
        //VAR: rmWord = for certain methods, may specify a word to remove from string "getText". This variable can be 'null' if not calling a function that needs to remove a specific word.
        //METHOD: display text in specific manner (e.g. highlights all words, all blank words)
        return ( mode >= 3 ) ? this.hashMTDFunc[ mode ]( getText, rmWord ) : this.hashMTDFunc[ mode ]( getText );
    },

    //DO NOT DELETE THIS YET, BUT I MAY DELETE THIS BECAUSE IT IS DIFFICULT TO DISPLAY THIS IN FIB_Slides
    displayTextArrayCustom: function( getText, rmWord ) {
        //METHOD: display the text in multiple ways, depending on arrangement in this.listDisplayModes
        var htmlText = ""; var htmlButtons = ""; var visibleText = ""; var fullHTML = "";

        //retrieve each function  - this won't work, I need a hash that will save the key (for this.hashMTDLabels) & the modified text
        // var listTV = this.listDisplayModes.map( function( funcNum, index ) {        //listTV = array of Text Version
        //     ( funcNum > 2 ) ?  return this.hashMTDFunc[ funcNum ]( getText, rmWord ) : return this.hashMTDFunc[ funcNum ]( getText );
        // }.bind( this ) );

        var hashTV = {};        //key = integer that should correspond to this.hashMTDLabels, value = modified text
        for (var funcNum in this.listDisplayModes)
            ( funcNum >= 3 ) ? hashTV[ funcNum ] = this.hashMTDFunc[ funcNum ]( getText, rmWord ) : hashTV[ funcNum ] = this.hashMTDFunc[ funcNum ]( getText );

        for (var i in hashTV) {
            console.log( "MTD.DTA Loop - ", i );

            //determine if text should be visible or not. NOTE: mtd_tv = MultiTextDisplay Text Version
            (i == this.defaultView) ? visibleText = 'block' : visibleText = 'none';
            htmlText += "<div id = 'mtd_tv_" + i + "' version = '" + i + "' style = 'display:" + visibleText + ";'>" + hashTV[i] + "</div>";
            htmlButtons += "<button onclick = 'MultiTextDisplay.toggleTV(" + i + ")'>" + this.hashMTDLabels[i] + "</button>&nbsp;&nbsp;&nbsp;";
        }
        fullHTML = htmlText + "<br/>" + htmlButtons;

        return fullHTML;
    },
}