//DocAnalysis.js
//Function: will analysis a document and return information about the document

function DocAnalysis( docText, arrSents ) {
    //VAR: docText = CONJ: I think this is the text of the document, but make sure that common words are removed if I do not want to quantify common words (e.g. the, and, but, is). NOTE: make sure not to remove duplicate words
    //VAR: arrSents = array of sentences processed by FullSent.js. This should be full sentences without the common words removed because the length of each sentence (in terms of words) is used.
    var arrDocWords = this.uniq_words( docText ); 
    this.totalWordCount = arrDocWords[0];
    this.arrUniqWords = arrDocWords[1];
    //calculate average number of words per sentence
    this.sentWordAvg = parseFloat(arrSents.length) / this.totalWordCount;
    
    //quantify words
    this.quantWords = this.quant_each_word(docText);      //quantWords = hash where key = word, & value = word count

    //TEST::
    console.log("this.quantWords = ", this.quantWords);

    //record average word usage & standard deviation within the document
    var docStat = this.stat_word( this.quantWords );
    this.wordAvg = docStat[ 0 ];        //average use of each word in the document, e.g. if wordA = 2.8, this means on average each word occurs approx. 3 times
    this.wordStd = docStat[ 1 ];

    //record word average & standard for each sentence
    var sentStat = this.stat_sent( arrSents );
    this.sentWordAvg = sentStat[ 0 ];       //average number of words in each document
    this.sentWordStd = sentStat[ 1 ];
}

DocAnalysis.prototype = {
    constructor: DocAnalysis,

    split_doc: function( text ) {
        //METHOD: returns an array of all words in the document
        //remove all special characters
        text = homogenize_text( text );

        //split document into individual words, remove blanks array elements, & quantify the total # of words & unique words
        var arrWords = text.split( /\s/ );
        return arrWords.filter( function( i ) { return i != undefined; } );
    },

    uniq_words: function( text ) {
        //METHOD: returns an array of all unique words in the document

        //retrieve all individual words in the document
        var arrWords = this.split_doc( text );
        var totalWordCount = arrWords.length;
        //remove duplicate words
        arrWords = arr_rm_dup( arrWords );

        return [ totalWordCount, arrWords ];
    },

    quant_all_words: function( text ) {
        //METHOD: quantifies number of words in the text
        var words = this.split_doc( text );
        return words.length;
    },

    quant_each_word: function( text ) {
        //METHOD: quantifies frequency of each word in document
        //split document into individual words & quantify each word
        var arrWords = this.split_doc( text );
        //quantify each word
        var quantWords = {};
        for ( var i in arrWords ) {
            //if word exists, then increment value, else begin by adding 1
            quantWords[ arrWords[i] ] ? quantWords[ arrWords[i] ] += 1 : quantWords[ arrWords[i] ] = 1;
        }

        return quantWords;
    },

    stat_word: function( objWordFreq ) {
        //VAR: objWordFreq = object where key = word, value = integer that is the word frequency
        //METHOD: calculate the average word count & standard deviation

        //calculate standard deviation
        var arrFreq = Object.keys( objWordFreq ).map( function( a ) { return objWordFreq[a]; } );
        // var wordAvg = float( this.totalWordCount ) / this.arrUniqWords.length;       //calculate average version 1
        var wordAvg = calc_mean( arrFreq );         //calculate average version 2
        var wordStd = calc_std( arrFreq );

        return [ wordAvg, wordStd ];
    },

    top_words_stat: function( thresStd ) {
        //VAR: thresStd = the standard deviation that will be used to calculate the threshold for considering words
        //METHOD: retrieves the top occurring words based on the average word usage frequency & standard deviation

        //calculate threshold
        var threshold = this.wordAvg + ( thresStd * this.wordStd );

        //return all words with frequency
        var objTopWords = {};
        for( var k in this.quantWords ) {
            if( this.quantWords[k] >= threshold )
                objTopWords[k] = this.quantWords[k];
        }

        return objTopWords;
    },

    top_words: function( thresStd ) {
        //VAR: thresStd = integer that is a threshold value. So if thresStd = 1, then selects words above 1 frequency threshold. If -2, then selects words whose frequency is above -2.
        //METHOD: returns the top frequently used words above a specific threshold
        var objTopWords = this.top_words_stat( thresStd );

        return Object.keys( objTopWords );
    },

    top_words_num: function( numTop ) {
        //VAR: numTop = integer that is the top X words to select based on occurrence
        //METHOD: retrieves the top X words based on frequency
        var listWordFreqSorted = obj_sort( this.quantWords, true );
        var topXWords = listWordFreqSorted.map( function( w, i ) {      //x = word, i = index
            while (i <= numTop)
                return w;
        } ).filter( function(x) { return x });

        return topXWords;
    },

    disp_word_freq: function( arrWords ) {
        //VAR: arrTopWords = array of words that should be keys in hash this.quantWords 
        //METHOD: returns a hash of words & their frequencies, where key = word, & value = frequency of that word
        var hashWordFreq = {};      //key = word, & value = frequency of that word
        for (var k of arrWords)
            if (k in this.quantWords)
                hashWordFreq[k] = this.quantWords[k];

        return hashWordFreq;
    },

    stat_sent: function( arrSents ) {
        //METHOD: calculate average number of words per sentence & the standard deviation
        //quantify number of words per sentence
        var arrSentWordCount = [];
        for( var i in arrSents )
            arrSentWordCount.push( this.quant_all_words( arrSents[ i ] ) );

        //calculate the average number of words per sentence & standard deviation
        var sentWordAvg = calc_mean( arrSentWordCount );         //calculate average version 2
        var sentWordStd = calc_std( arrSentWordCount );

        return [ sentWordAvg, sentWordStd ]
    },
}

/* END OF CLASS */

function homogenize_text( getText ) {
    // getText = getText.toLowerCase();
    // getText = strTools_remove_punct( getText.toLowerCase() )
    // return getText;

    // return remove_punct( getText.toLowerCase() );

    return getText.toLowerCase().replace( /[\W]/g, " " )
}

function remove_punct( getText ) {
    //METHOD: this function will remove punctuations by replacing punctuations with blanks
    return getText.replace( /[\W]/g, " " );           //removes non-word characters
}


function remove_punct_letters( str ) {
    //str = str.replace(/[\W,\s]/g," ");
    str = str.replace(/[\W]/g," ");           //removes non-word characters
    str = str.replace(/\b[a-z]\b/gi," ");     //removes single letters
    str = strTools_removeSingleDigits(str);   //remove single digits from string
    return str;
}

function arr_rm_dup( getArr ) {
    //METHOD: removes duplicate elements in "getArr" and returns an array of unique elements
    var arrUniq = [];
    for ( var x in getArr ) {
        if ( arrUniq.indexOf( getArr[x] ) < 0 )
            arrUniq.push( getArr[x] );
    }

    return arrUniq
}

function obj_sort( getObj, boolGtoL ) {
    //VAR: getObj = object that has keys & values
    //VAR: boolGtoL (boolean Greatest to Least) = boolean that, if true, will sort getObj from greatest to least. Else, if false, will sort getObj from least to greatest
    //METHOD: returns an array of keys sorted by their respective values
    
    if( boolGtoL )      //sort from greatest to least
        return Object.keys( getObj ).sort( function( a, b ) { return getObj[b] - getObj[a]; } );
    else                //else sort from least to greatest
        return Object.keys( getObj ).sort( function( a, b) { return getObj[a] - getObj[b]; } );
}

//MATH TOOLS
function calc_sum( arrVals ) {
    //METHOD: this function will sum the values in the array
    //make sure elements in array are integers
    arrVals = arrVals.map( function( i ) { return parseFloat( i ); } );
    return arrVals.reduce( function( a, b ) { return a + b; } );
}

function calc_mean( arrVals ) {
    //METHOD: this function will calculate the average of values in an array
    var getSum = calc_sum( arrVals );
    return getSum / parseFloat( arrVals.length );
}

function calc_variance( arrVals ) {
    //METHOD: this function calculates the variance of a list of values in an array
    //NOTE: the equation for variance = [x-mean(x)]^2/(population size), st.dev = sqrt(variance)
    //convert array to float just in case
    arrVals = arrVals.map( function( i ) { return parseFloat( i ); } );
    
    //STEP: calculate mean value for array values
    var meanArr = calc_mean( arrVals );
    //sum the difference between a point value and the mean, and calculate the mean
    var sumOfDiff_Squared = 0;
    for( var x in arrVals )
        sumOfDiff_Squared += ( meanArr - arrVals[x] ) * ( meanArr - arrVals[x] );
    
    //STEP: calculate variance
    return sumOfDiff_Squared / ( arrVals.length );
}

function calc_std( arrVals ) {
    //METHOD: this function will calculate the standard deviation of a list of values in an array
    //STEP: calculate variance
    var variance = calc_variance( arrVals );
    //STEP: calculate standard deviation
    return Math.sqrt( variance );      //std = standard deviation
}