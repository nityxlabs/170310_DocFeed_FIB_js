//Class FIB_V1.js
//METHOD: creates fill in the blank sentences

/*
Requires:
-classStemmer.js: need class DocManip class (use to remove common words)
-DocAnalysis_17310.js
    -retrieve the top X words that are uncommon
*/

/*
-Q: Should I use string text or array of sentences?
    -A: Use array of sentences
-Q: How should I generate FillInBlanks?
    -Method 1: Upload document -> generate fill in the blanks for each sentence -> have reset button that will generate new blanks for each sentence
-Q: How to create each fill-in-blank sentence?
    -Method 1: find unique words in each sentence (remove common words) -> select one of the words randomly (perhaps can use stemmer as well) -> find word in sentence and make a blank
        -CONS:
            -need to randomly select word until word is found 
    -Method 2: ??
*/

function FillInBlank( arrSents, numBlanks, topXWords ) {
    //VAR: arrSents = array where each element is a full sentence. This usually comes from class FullSent.js
    //VAR: numBlanks = integer that is the number of blanks that should be presented per sentence
    //VAR: topXWords = integer that is the top X uncommon words in the document
    this.arrSents = arrSents;
    this.numBlanks = numBlanks;
    this.topXWords = topXWords;
    //class DocManip - used to manipulate text
    this.objDocManip = new DocManip();
    
    //get all uncommon words and index words for faster search (index is the form of hash table)
    var strText = arrSents.join(". ");
    var listUCW = this.getUncommonWords( strText );      //listUCW = list Uncommon Words
    //create DocAnalysis instance to quantify & extract top X words
    var strUCW = this.objDocManip.process_text( strText );     //strUCW = similar to listUCW, but does not remove duplicate occurrences of words - need this to quantify uncommon word frequency
    this.objDocAnalysis = new DocAnalysis( strUCW, arrSents );
    this.topUCW = this.objDocAnalysis.top_words_num( topXWords );       //topUCW = top Uncommon Words - this is basically a linear version of this.hashWordIndex
    this.hashWordIndex = FillInBlank.indexWordList( this.topUCW );      //creates an index of words to be searched based on first letter (key = a character (e.g. 'a', 'j', 'r'), value = array of all words that begin with that character in the key)

    //TEST::
    // console.log( "FIB: topUCW = ", this.topUCW );
    
    //TEST:: console.log( "hashWordList:\n", this.hashWordIndex );

    //create an array of sentences with blanks & corresponding answer
    var hashBlankSetup = this.createFillInBlanks();
    this.arrSentBlanks = hashBlankSetup['arrSentBlanks'];
    this.arrAnswers = hashBlankSetup['arrAnswers'];

    //TEST::
    // for (var i in this.arrSentBlanks)
    //     console.log( i, ": answer = ",this.arrAnswers[i] , "\nsentBlank = ", this.arrSentBlanks[i] );
}

// FillInBlank.getUncommonWords = function( strText ) {
//     //METHOD: removes common words to find the "uncommon" words

//     //homogoenize text (lowercase text, remove single characters & punctuation, and remove common words)
//     strText = this.objDocManip.process_text( strText );

//     //retrieve the 
//     var listUCW = this.objDocManip.doc_words( strText, false );
//     console.log( "textUCW = ", listUCW );
//     return listUCW;

//     // //homogoenize text (lowercase text, remove single characters & punctuation, and remove common words)
//     // strText = strTools_homogenizeText( strText )

//     // //use XDoc_StrTools function strTools_retrieveDocWords - do not need to remove common words because this is already performed in strTools_homogenizeText()
//     // var listUCW = strTools_retrieveDocWords( strText, false );     //textUCW = text Uncommon Words
//     // console.log( "textUCW = ", listUCW );
//     // return listUCW;
// }

FillInBlank.indexWordList = function( listWords ) {
    //VAR: listWords = array of words
    //METHOD: creates a hash table that indexes the words by creating a hash table - this should help speed up the process when searching for words
    var startLetter;
    var hashWordList = {};      //k = starting letter of words, v = array of all words
    for ( var word of listWords ) {
        // if ( typeof word === 'number' || word instanceof Number )
        //     word = word.toString();
        if ( word === undefined )
            continue

        startLetter = word.toLowerCase().split('')[0];
        //if hash does not contain starting letter, then add to hash and add array as value of hash
        if ( !(startLetter in hashWordList) )
            hashWordList[startLetter] = [];
        hashWordList[startLetter].push( word.toLowerCase() ); 
    }

    return hashWordList;
}

FillInBlank.prototype = {
    constructor: FillInBlank,

    getUncommonWords: function( strText ) {
        //METHOD: removes common words to find the "uncommon" words - returns an array where each element is an "uncommon" word
        //homogenize text (lowercase text, remove single characters & punctuation, and remove common words)
        strText = this.objDocManip.process_text( strText );
        //retrieve the "uncommon words" from the document
        return this.objDocManip.doc_words( strText, false );
    },

    addFIBWords: function() {       //addFIBWords = add Fill-In-the-Blank Words
        //METHOD: adds words to this.topUCW to include other words

    },

    subtractFIBWords: function() {      //subtractFIBWords = add Fill-In-the-Blank Words
        //METHOD: removes words from this.topUCW to include other words - may want to reset blanks based on new set of words
    },

    resetFIBSents: function() {     //resetFIBSents = reset Fill-In-the-Blanks Sentences
        //METHOD: resets this.arrSentBlanks & this.arrAnswers, in other words the Fill-In-the-Blanks for each sentence
    },

    sentenceContainUCW: function( sent ) {
        //VAR: sent = string that will be used to see if any words in this.topUCW exists
        //METHOD: determines if words in this.topUCW are in string 'sent'. Returns a list of words that are in the sentence, else returns an empty array
        var sentLowerCase = sent.toLowerCase();
        var arrExists = [];
        for (var eachWord of this.topUCW)
            if (sentLowerCase.includes(eachWord))
                arrExists.push( eachWord );

        return arrExists;
    },

    selectWordForBlank: function( sent ) {
        //METHOD: selects a word from a sentence to be the blank word
        var arrUniqWords, randI, randWord, startChar;

        //retrieve all uncommon words in sentence
        arrUniqWords = this.sentenceContainUCW( sent );
        if (arrUniqWords.length == 0)      //if no words are found, then skip
            return "";

        //select a word that is still preserved in this.hashWordIndex (record of all words that are uncommon and the user wants to be tested on)
        do {
            randI = Math.floor( Math.random() * arrUniqWords.length );
            randWord = arrUniqWords[randI];

            console.log( "selectWordForBlank: ", randI, " & randWord = ", randWord );

        } while( this.hashWordIndex[ randWord.split('')[0] ].indexOf( randWord ) == -1 );

        //return the selected answer for the slide
        return randWord;
    },

    createFillInBlanks: function() {
        //METHOD: create a fill-in-the-blank sentence
        var uniqWords, getBlankWord;
        var arrSentBlanks = [];     //
        var arrAnswers = [];        //will record word answers

        //create a "fill-in-the-blank" version of each sentence 
        for ( var i in this.arrSents ) {
            //TEST::
            console.log( "cFIB 1 - ", i, " & this.arrSents[i] = ", this.arrSents[i] );

            if ( (this.arrSents[i] === undefined) || !(/\S/.test(this.arrSents[i])) ) 
                continue

            //TEST::
            console.log( "cFIB 2 - ", i, " & this.arrSents[i] = ", this.arrSents[i] );

            getBlankWord = this.selectWordForBlank( this.arrSents[i] );
            arrSentBlanks.push( this.arrSents[i] );
            arrAnswers.push( getBlankWord );

            //TEST::
            console.log( "cFIB 3 - ", i, " & this.arrSents[i] = ", this.arrSents[i], " & word = ", getBlankWord );
        }

        return {'arrSentBlanks': arrSentBlanks, 'arrAnswers': arrAnswers};
    },

    showTopXWords: function() {
        //METHOD: shows the top X uncommon words selected
        var dispStr = "";
        var counter = 1;
        var hashWordFreq = this.objDocAnalysis.disp_word_freq( this.topUCW );        //retrieve frequency of all words

        //TEST::
        console.log( "hashWordFreq = ", hashWordFreq, " & this.topUCW = ", this.topUCW );

        for (var k of this.topUCW) {
            dispStr += "[" + counter + "] " + k + ": " + hashWordFreq[k] + "<br/>";
            counter++; 
        }

        return dispStr;
    },

    showTopXWordsV2: function() {
        //METHOD: shows the top X uncommon words selected
        var dispStr = "";
        var counter = 1;
        var hashWordFreq = this.objDocAnalysis.disp_word_freq( this.topUCW );        //retrieve frequency of all words

        //retrieve the words that are selected & the words that are not -> display in 2 different lists, allowing the user to select or de-select words -> 

        //TEST::
        console.log( "hashWordFreq = ", hashWordFreq, " & this.topUCW = ", this.topUCW );

        for (var k of this.topUCW) {
            dispStr += "[" + counter + "] " + k + ": " + hashWordFreq[k] + "<br/>";
            counter++; 
        }

        return dispStr;
    },
}