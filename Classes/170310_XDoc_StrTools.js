//Regular Expression - characters that need to be escaped are . \ + * ? [ ^ ] $ ( ) { } = ! < > | : - " '
//START strTools. These are functions that manipulate strings
//REQUIRE: need to include hash.js external files
//common words list
var commonWordsText="the,be,to,of,and,a,in,that,have,I,it,for,not,on,with,he,as,you,do,does,at,this,but,his,by,from,they,we,say,her,she,or,an,will,my,one,all,would,there,their,what,so,up,out,if,about,who,get,which,go,me,when,make,can,like,time,no,just,him,know,take,people,into,year,your,good,some,could,them,see,other,than,then,now,look,only,come,its,over,think,also,back,after,use,two,what,when,where,why,how,our,work,first,well,way,even,new,want,because,any,these,give,day,most,us,time,person,year,way,day,thing,man,world,life,hand,part,child,eye,woman,place,work,week,case,point,government,company,number,fact,be,have,do,say,said,get,make,go,know,take,see,come,think,look,want,give,use,find,tell,ask,work,seem,feel,try,leave,call,good,new,first,last,long,great,little,own,other,old,right,big,high,different,small,large,such,next,early,young,important,few,public,bad,same,able,was,were,is,are,has,have,it,those,had,did,run,ran,between,within,more,less,across,been,require,requires,however,where,whereas,though,although,furthermore,moreover,show,both,according,accordingly,begin,begun,determine,yet,many,often,may,might,et,al,must,during,include,includes,exclude,excludes,meanwhile,sent,send,sends,sending,while,upon,work,working,across";


function escapeRegExp(str) {
	//METHOD: this function will return a string where all escapable characters will be escaped, so then it can be used with "new RegExp"
	//SOURCE: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
  	// return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>\:\"\'\=\!\/]/g, "\\$&");
}

function checkForAsterisks(getWord)
{
	//starStat records value corresponding to position of asterisks at beginning or end of the word. 
	var checkAsterisk=/[\*\+]/i;		//the "*" means 0 or more occurrences of character (e.g. car* = ca, car, carrr) & "+" means 1 or more occurrences (e.g. car+ = car, carrr, carrrrrr)
	var frontStar=false;
	var endStar=false;
	var firstChar=getWord.charAt(0);
	var lastChar=getWord.charAt(getWord.length-1);
	if(firstChar.match(checkAsterisk)){
		frontStar=true;
	}
	if(lastChar.match(checkAsterisk)){
		endStar=true;
	}

	return [frontStar, endStar];
}

function formatSearchWord(getWord,modifier)
{
	//VARS: getWord = the string that will be checked for special characters; modifier = the RegExp modifier that will be appended to the start & end of string "getWord"
	//METHOD: this function formats a word for RegExp formatting by appending modifiers (e.g. word boundary "\b") to the start & end of the string "getWord" unless special characters such as "*" or "+" occur in the beginning
	//if word contains "*", this is a wildcard character & should consider other characters where the "*" is presents
	if(modifier!=null)
	{
		var formattedWord=modifier+""+getWord+""+modifier;
		var cCLen=modifier.length;
	}
	else
	{
		var formattedWord=getWord;
		var cCLen=0;
	}

	//STEP: check for "*" or "+" at the ends (start & end) of the word
	var starStat=checkForAsterisks(getWord);
	if(starStat[0]){
		formattedWord=formattedWord.substring(cCLen+1);
	}
	if(starStat[1]){
		formattedWord=formattedWord.substring(0,formattedWord.length-cCLen-1);
	}

	return formattedWord;
}

function strTools_retrieveDocWords(docText,boolRmCW)
{
	//VAR: docText = string that is the document of interest
	//VAR: boolRmCW (boolean Remove Common Words) = boolean that, if true, will remove the common words from docText, else will keep the common words
	//METHOD: this function will return all individual words in the document. Also, this will split compound words or words with non-word characters (e.g. words with hyphens, apostrophes, etc.)
	//OUTPUT: this function will output an array with all the words in the document.

	//STEP: homogenize text (e.g. make all lettering lowercase)
	docText = strTools_homogenizeTextV0(docText);

	//STEP: if boolRmCW is true, then remove common words
	if(boolRmCW)
		docText = strTools_removeCommonWords_SelectText(docText);

	//STEP: remove all the non-word characters (regExp_NWC_EWS) and then split the document into individual words
	var regExp_NWC_EWS = /[^\w\s]/g;					//regExp_NWC_EWS (Non-word characters Except White Spaces) = this detects all non-word characters via not considering word characters (\w) nor blank spaces (\s)
	// var newText=docText.replace(regExp_NWC_EWS,"");		//NOTE: I don't think I need to do this after using function "strTools_homogenizeTextV0"
	var arrWords = docText.split(" ");
	arrWords = strTools_arrayRemoveDuplicates(arrWords);
	arrWords = arrTools_removeBlanks(arrWords);

	return arrWords;
}


function strTools_findShortestStrInArr(arrStr)
{
	//VARS: arrWords = an array of strings
	//METHOD: this function will find the shortest string in an array
	var shortestStr=arrStr.sort(function (a, b) {return a.length - b.length;})[0];

	return shortestStr;
} 

function strTools_findLongestStrInArr(arrStr)
{
	//VARS: arrWords = an array of strings
	//METHOD: this function will find the longest string in an array
	var longestStr=arrStr.sort(function (a, b) {return b.length - a.length;})[0];

	return longestStr;
}

function strTools_CheckIfRegExp(strOI,strOI_modifier)
{
	//VARS: strOI = a string that can be either just a string or in the format for RegExp
	//METHOD: This function checks if strOI is the form of a RegExp or not
	if(strOI.constructor!=RegExp)
	{
		// strOI=escapeRegExp(strOI);		//escape all characters that need to be escaped before creating new RegExp element
		var getFormattedWord=formatSearchWord(strOI,strOI_modifier);
		var wordsOIRE=new RegExp(getFormattedWord,"gi");	//wordsOIRE = word Of Interest RegExp
	}
	else
	{
		var wordsOIRE=strOI;
	}

	return wordsOIRE;
}

function strTools_CheckIfBlank(strOI)
{
	//METHOD: check to see if the string "strOI" is blank or not
	
	strOI=strOI.trim();
	var boolBlank=false;
	if(strOI==""){boolBlank=true;}

	return boolBlank;
}

function strTools_CheckIfWord(strOI)
{
	//VARS: strOI = the string used to see if word characters are found in this variable
	//METHOD: this function checks if a string contains character words
	var wordStat=false;
	//STEP: check if word variables exist in "strOI"
	if(/\S/.test(strOI)){wordStat=true;}

	return wordStat;
}

function strTools_CheckIfStrPresent(fullStr,searchStr,modifiers)
{
	//VARS: fullStr = this is the larger string that will be searched; searchStr = this is the string that will be searched for in larger string "fullStr"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
	//METHOD: this function checks if string "searchStr" is present in "fullStr"
	// searchStr=escapeRegExp(searchStr);		//escape all characters that need to be escaped before creating new RegExp element
	var getFormattedWord=formatSearchWord(searchStr,"\\b");
	
	//STEP: create regular expression and search for word
	var reSearchStr=new RegExp(getFormattedWord,modifiers);
	if(fullStr.search(reSearchStr)===-1){var findStat=false;}
	else{var findStat=true;}

	return findStat;
}


function strTools_checkFirstCharCap_Strict(getStr)
{
	//VARS: getStr = a string parameter that will be checked to see if the first character is a capital letter
	//METHOD: this function will be "true" if the first character of a string "getStr" is capital.
	//NOTE: this is "STRICT" because it also excludes all non-word characters such as numbers & punctuations
	//NOTE: for curly double & single quotation marks, need to use Unicode to identify them in regular expression. \u201C = left double quotation marks, \u201D = right double quotation marks, \u2018 = left single quotation mark, \u2019 = right single quotation mark
	getStr=getStr.trim();		//remove blanks from both ends of the string
	var getStat=false;
	//COMPARISON 1: this comparison REJECTS non-word characters, numbers, and whitespaces
	// if((getStr[0]===getStr[0].toUpperCase()) && (getStr[0].match(/[^\d\W\s\"\']/))){getStat=true;}
	//COMPARISON 2: this compare ACCEPTS characters between A-Z & single & double quotations
	//NOTE: for curly double & single quotation marks, need to use Unicode to identify them in regular expression
	if((getStr[0]===getStr[0].toUpperCase()) && (getStr[0].match(/[A-Z\[\"\'\u201C\u201D\u2018\u2019]/i)))
		getStat=true;		//NOTE: added "[" as it is used for references within a paper (e.g. car is red. [1] But the other car is blue.)

	return getStat;		
}

function strTools_checkFirstCharCap_Lax(getStr)
{
	//VARS: getStr = a string parameter that will be checked to see if the first character is a capital letter
	//METHOD: this function will be "true" if the first character of a string "getStr" is capital.
	//NOTE: this is "STRICT" because it DOES NOT exclude non-word characters such as numbers & punctuations
	getStr=getStr.trim();		//remove blanks from both ends of the string
	var getStat=false;
	if(getStr[0]===getStr[0].toUpperCase()){getStat=true;}

	return getStat;		
}

function strTools_compileList(currWordList,newWordList,delimCurr,delimNew)
{
	//METHOD: split the string of words "newWordList" separated by string "delimNew" & adds to the string of words "currWordList" with words separated by string "delimCurr"
	var arrNewWords=newWordList.split(delimNew);
	for(var x in arrNewWords)
	{
		currWordList+=arrNewWords[x]+""+delimCurr;
	}

	return currWordList;
}

//START: StrTools Search - functions used to search for words
function strTools_findWordMatch(searchStr,strDB,modifiers)
{
	//VARS: searchStr = the string to search for in larger string "strDB"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
	//METHOD: this function finds only the whole word unless there are "*" are present in the string
	//OUTPUT: this function will return the occurrence of "searchStr" if it occurs in string "strDB", else will return null if string is not found.
	//NOTE: this function is similar to "strTools_findMatch", but is responsive to the wildcard character "*", therefore this is good for text searches

	//STEP: format the word to either search for the whole word unless there are "*" present
	// searchStr=escapeRegExp(searchStr);		//escape all characters that need to be escaped before creating new RegExp element
	var getFormattedWord=formatSearchWord(searchStr,"\\b");
	
	//STEP: create regular expression and search for word
	var reSearchStr=new RegExp(getFormattedWord,modifiers);
	var strPresent=strDB.match(reSearchStr);

	return strPresent;
}

function strTools_findMatch(searchStr,strDB,modifiers)
{
	//VARS: searchStr = the string to search for in larger string "strDB"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
	//METHOD: searches for "str" in "strDB". Returns true if "str" is present & false if it is not
	//OUTPUT: this function will return the occurrence of "searchStr" if it occurs in string "strDB", else will return null if string is not found.
	//NOTE: can't use certain special characters in regular expression, such as *
	//NOTE: can use the following special characters, ">>", "}}", ":", ";"
	var reSearchStr=new RegExp(searchStr,modifiers);
	var strPresent=strDB.match(reSearchStr);
	return strPresent;
}

function strTools_findFirstMatch(strMatch,strLookInto)
{
	//METHOD: return the first occurrence of "strMatch" into strLookInto
	var wordsOIRE=strTools_CheckIfRegExp(strMatch,"");
	//if "strMatch" is found, then return position of word in "strLookInto", else 
	var getI;
	//if word is not present, then getI=-1, else getI > -1
	getI=strLookInto.search(wordsOIRE);

	return getI;
}

function findAllMatches_FormatSearchWord(strOI,strOI_modifier)
{
	//METHOD: this function will format the string "strOI"
	var wordsOIRE, strOI;
	if(strOI.match("META:WHITESPACE"))		//This is code for white spaces
	{
		wordsOIRE=/\s/;
		strOI_Len=1;
	}
	else if(strOI.match("META:DIGIT"))		//This is code for any number
	{
		wordsOIRE=/\d/;
		strOI_Len=1;
	}
	else
	{
		wordsOIRE=strTools_CheckIfRegExp(strOI,strOI_modifier);
		strOI_Len=strOI.length;
	}

	return {wordsOIRE: wordsOIRE, strOI_Len: strOI_Len};
}

function strTools_findAllMatches(strOI,strOI_modifier,strLookInto)
{
	//VARS: strOI = the string (CANNOT BE A REGULAR EXPRESSION) being searched for in "strLookInto"; strOI_modifiers = anything that will be added to the ends of the string (e.g. \\b)
	//METHOD: finds all instances of string "strOI" in the string "strLookInto" & returns all the positions
	//NOTE: strOI cannot not be in RegExp form because of strOI.length
	//NOTE: strOI can be special characters (e.g. white space, any digit) - see function "findAllMatches_FormatSearchWord()". Example - "META:WHITESPACE" means prepare search for white spaces (i.e. /\s/ with length=1)
	var traverseStr=strLookInto;
	var arrTrackIndices=new Array();
	var stillSearch=true;
	//this keeps track of the previously recorded position of the occurrence of the previous word
	var keepLastIndex=0;
	//STEP: need to format strOI for search - this could include spaces (/\s/), all numbers (/\d/) or other special characters
	formatStrOI=findAllMatches_FormatSearchWord(strOI,strOI_modifier);
	var wordsOIRE=formatStrOI.wordsOIRE;
	var strOI_Len=formatStrOI.strOI_Len;

	//STEP: begin search through string
	while(stillSearch)
	{
		//find first instance of word in sentence
		if(traverseStr.match(wordsOIRE))
		{
			var getI=traverseStr.search(wordsOIRE);
			//record instance
			var trueGetI=getI+keepLastIndex;
			arrTrackIndices.push(trueGetI);
			//truncate "strLookInto" to find next occurrence of word
			var getNextPos=parseInt(getI)+parseInt(strOI_Len);
			//"keepLastIndex" will keep track of absolute position of the last found word
			keepLastIndex=trueGetI+parseInt(strOI_Len);
			//shorten string to find next instance of word
			traverseStr=traverseStr.substring(getNextPos);
			stillSearch=true;
		}
		else{stillSearch=false;}
	}

	return arrTrackIndices;
}

function strTools_SentRange(wordOI,getDoc,sentSeparator)
{
	//VARS: wordOI = string being looked for in text body "getDoc"; sentSeparator = delimiter that separates the each sentence in text body "getDoc"
	//METHOD: this function will find and return the sentence index of where the string "wordOI" occurs first

	//STEP: split the document into individual sentences - getDoc must be processed by "setDoc_organizeOrigText()"
	var arrDoc=getDoc.split(sentSeparator);

	var firstSentI=strTools_FindFirstSentI(arrDoc,wordOI,false);
	var lastSentI=strTools_FindFirstSentI(arrDoc,wordOI,true);

	var numOfSents=lastSentI-firstSentI+1;		//need to add "+1" as the word is also present in the "firstSentI" sentence as well

	return {
		firstSentI: firstSentI,
		lastSentI: lastSentI,
		numOfSents: numOfSents
	};
}

function strTools_SentRange_SubDoc(wordOI,getDoc,sentSeparator,startI,endI)
{
	//METHOD: this function will find and return the sentence index of where the string "wordOI" occurs first within the range startI to endI.
	//NOTE: the minimum value for startI = 0 (the first sentence), and the maximum value is the last sentence index (arrDoc.length-1)
	startI=parseInt(startI);
	endI=parseInt(endI);

	//STEP: get the subDoc from getDoc
	var arrDoc=getDoc.split(sentSeparator);
	var strSubDoc="";
	for(var a=startI;a<endI;a++){strSubDoc+=arrDoc[a]+""+sentSeparator;}
	strSubDoc+=arrDoc[endI];		//this is so the delimiter "sentSeparator" isn't added at the end - don't want to split this document and have an empty element

	var arrSentInfo=strTools_SentRange(wordOI,getDoc,sentSeparator);
	var trueFirstSentI=arrSentInfo.firstSentI+startI;
	var trueLastSentI=arrSentInfo.lastSentI+startI;

	return {
		firstSentI: trueFirstSentI,
		lastSentI: trueLastSentI,
		numOfSents: numOfSents
	};
}

function strTools_FindFirstSentI(arrDoc,wordOI,boolBackwards)
{
	//VARS: arrDoc = a document that is split into an array, where each element contains a full sentence; wordOI = string that is being searched for in arrDoc; boolBackwards = boolean that, if true, will search arrDoc backwards and find the last sentence index that contains the string wordOI
	//METHOD: this function will find the first sentence index with the string "wordOI"
	var getSentI=null;
	if(!boolBackwards)			//else go through the sentences in ascending order (i.e. go forward through document) to find the first sentence I
	{
		for(var x=0;x<arrDoc.length;x++)
		{
			var findStr=strTools_findWordMatch(wordOI,arrDoc[x],"i");
			if(findStr)
			{
				getSentI=x;
				break;
			}
		}
	}
	else 				//go through the document backwards to find the last sentence I
	{
		for(var x=arrDoc.length-1;x>=0;x--)
		{
			var findStr=strTools_findWordMatch(wordOI,arrDoc[x],"i");		//(searchStr,strDB,modifiers)
			if(findStr)
			{
				getSentI=x;
				break;
			}
		}
	}

	getSentI=parseInt(getSentI);		//make sure sentence index is an integer

	return getSentI;
}

function findNearestStr_increment(arrNumPosSorted,numPos,increment)
{
	//VARS: arrNumPosSorted = an array of all the numerical positions where string "searchStr" matches within string "fullStr" (from function strTools_findNearestStr); numPos = the numerical position in "fullStr" to where the nearest is being compared; increment = the incrementer for the loop, should be either +1 or -1
	//METHOD: this function will find the nearest non-zero value near position numPos in fullStr from function "strTools_findNearestStr"
	var i_numPos=arrNumPosSorted.indexOf(numPos);
	var i=i_numPos;
	var dist=0;
	var arrVal=0;
	//STEP: look for element that is closest, traverse each position until the first 
	while((dist==0) && (i>=0) && (i<arrNumPosSorted.length))
	{
		//increment to the next index position
		i+=increment;
		//see if the next element is different in position to numPos
		arrVal=arrNumPosSorted[i];
		dist=arrVal-numPos;
	}

	// if(dist==0){i=-1;}		//if nothing is found, then return -1 meaning no match was found

	return {nearestPos: arrVal, dist: dist};
}

function strTools_findNearestStr(fullStr,numPos,searchStr,direction)
{
	//VARS: searchStr = the string (or regular expression) to search for in larger string "fullStr"; numPos = the position to begin the search in the string "fullStr"; direction = an integer that is -1,0,1, where -1 means before numPos, +1 means after numPos, and 0 means no direction
	//METHOD: this function will find the closest string "searchStr" to position "numPos" in the string "fullStr"
	
	//STEP: find all positions of a string
	var arrAllPos=strTools_findAllMatches(searchStr,"",fullStr);

	//STEP: see if there preference for a direction - NOTE that arrTools_ThresholArr returns a sorted array (least to greatest)
	if(direction==1){arrAllPos=arrTools_ThresholdArr(arrAllPos,numPos,true);}
	else if(direction==-1){arrAllPos=arrTools_ThresholdArr(arrAllPos,numPos,false);}
	else
	{
		arrAllPos=arrTools_strToFloat(arrAllPos);
		arrAllPos=arrAllPos.sort();
	}

	//STEP: search for positions closest to numPos
	if(direction==1)				//searching forward of numPos
	{
		var nearestInfo=findNearestStr_increment(arrAllPos,numPos,direction);
	}
	else if(direction==-1)			//searching backward of numPos
	{
		var nearestInfo=findNearestStr_increment(arrAllPos,numPos,direction);
	}
	else							//searching in both directions of numPos
	{
		//need to retrieve in both directions 
		var nearestBefore=findNearestStr_increment(arrAllPos,numPos,-1);
		var nearestAfter=findNearestStr_increment(arrAllPos,numPos,1);
		//see which distance is shorter
		if(nearestAfter.dist<nearestBefore.dist){var nearestInfo=nearestAfter;}
		else{var nearestInfo=nearestBefore;}
	}

	return nearestInfo.nearestPos;
}

function strTools_FindFullWord(fullStr,numPos)
{
	//METHOD: this function will find the full word at the given position

	//need to convert to a float (since numbers are converted to float in function arrTools_ThresholdArr() in function strTools_findNearestStr()
	numPos=parseFloat(numPos);
	//need to cap the string with blank spaces as to not encounter any issues with the boundaries of the text - BUT also need to correct numPos
	fullStr=strTools_CapEnds(fullStr," ");
	numPos=numPos+1;				//need to correct adding " " to the ends of fullStr


	//STEP: find first occurrence of blanks before and after the numPos in fullStr
	var blankBeforeI=strTools_findNearestStr(fullStr,numPos,"META:WHITESPACE",-1);
	var blankAfterI=strTools_findNearestStr(fullStr,numPos,"META:WHITESPACE",1);

	//STEP: using the positions of blankBefore & blankAfter, extract the position of the text
	var fullWord=fullStr.substring(blankBeforeI,blankAfterI);
	fullWord=fullWord.trim();		//remove whitespaces before and after

	return fullWord;
}

function strTools_FindAllMatchesFullWord(searchStr,fullStr)
{
	//VARS: searchStr = the string to search for in larger string "fullStr";
	//METHOD: this function will find all full words that are similar to string "searchStr"
	//NOTE: searchStr can be special characters (e.g. white space, any digit) - see function "findAllMatches_FormatSearchWord()". Example - "META:WHITESPACE" means prepare search for white spaces (i.e. /\s/ with length=1)
	var arrFullWords=new Array();
	
	//STEP: retrieve all positions where the string "searchStr" is found in the larger string "fullStr"
	var arrAllPos=strTools_findAllMatches(searchStr,"\\b",fullStr);
	//STEP: find the full word for each position
	for(var x in arrAllPos)
	{
		var getFullWord=strTools_FindFullWord(fullStr,arrAllPos[x]);
		arrFullWords.push(getFullWord); 
	}

	return arrFullWords;
}

function strTools_CompareStrWithCaps(str1,str2,delimCap,boolCaseInsen)
{
	//VARS: str1 & str2 = the strings that will be compared; delimCap = string that will serve as the cap, this will be at both ends of the string; boolCaseInsen = boolean that, if true, will disregard case sensitivity, else if false will consider case sensitivity
	//METHOD: this function will compare if str1 & str2 are the same by using a cap to establish the boundaries of the string

	//STEP: see if letter casing should be considered
	if(boolCaseInsen)
	{
		str1=str1.toLowerCase();
		str2=str2.toLowerCase();
	}

	//STEP: cap the strings
	var str1_Cap=strTools_CapEnds(str1,delimCap);
	var str2_Cap=strTools_CapEnds(str2,delimCap);

	//STEP: compare the string
	if(str1_Cap.match(str2_Cap)){var boolMatch=true;}
	else{var boolMatch=false;}

	return boolMatch;
}

function strTools_ReturnMatches(listI_1,listI_2,delim_1,delim_2)
{
	//VAR: listI_1 = a string where each element is separated by delimiter "delim_1"; 
	//VAR: listI_2 = a string where each element is separated by delimiter "delim_2";
	//METHOD: this function will check compare elements between listI_1 & listI_2, & return the matches
	var arrMatchesFound=new Array();
	var arrI_1=listI_1.split(delim_1);
	arrI_1=arrTools_removeBlanks(arrI_1);		//remove any blank elements
	listI_2=strTools_CapEnds(listI_2,delim_2);

	//STEP: see if an element from arrI_1 is present in listI_2
	for(var a in arrI_1)
	{
		//format element as to be able to compare in string
		var formatElem=strTools_CapEnds(arrI_1[a],delim_2);
		//see if the index is present, if so then record

		var checkMatch=strTools_findMatch(formatElem,listI_2,"i");
		if(checkMatch){
			arrMatchesFound.push(arrI_1[a]);
		}
	}

	return arrMatchesFound;
}

function strTools_findNonWordMatches(regExp_NW,strLookInto)
{
	//VARS: regExp_NW = the reg exp of a non-word; formatStrOI = boolean - if true, the format search words, else do not format word
	//METHOD: finds all instances of regular expression "regExp_NW" in the string "strLookInto" & returns all the positions
	//NOTE: strOI cannot not be in RegExp form because of strOI.length
	var wordsOIRE=regExp_NW;			//wordsOIRE = words Of Interest Regular Expression
	var strLen=1;
	var traverseStr=strLookInto;
	var arrTrackIndices=new Array();
	var stillSearch=true;
	//this keeps track of the previously recorded position of the occurrence of the previous word
	var keepLastIndex=0;

	while(stillSearch)
	{
		var TESTER=traverseStr.match(wordsOIRE)
		//find first instance of word in sentence
		if(traverseStr.match(wordsOIRE))
		{
			var getI=traverseStr.search(wordsOIRE);
			//record instance
			var trueGetI=getI+keepLastIndex;
			arrTrackIndices.push(trueGetI);
			//truncate "strLookInto" to find next occurrence of word
			var getNextPos=parseInt(getI)+strLen;

			//"keepLastIndex" will keep track of absolute position of the last found word
			keepLastIndex=trueGetI+strLen;
			//shorten string to find next instance of word
			traverseStr=traverseStr.substring(getNextPos);
			stillSearch=true;
		}
		else{stillSearch=false;}
	}

	return arrTrackIndices;
}

function strTools_searchWordInArr(strOI,arrSents,boolCaseInsen)
{
	//VARS: strOI = string of interest, string that will be searched in each sentence in array "arrSents"; arrSents = array of sentences where each element in the array is a sentence;  boolCaseInsen = boolean that, if true, is case-insensitive, else if false is case-sensitive
	//METHOD: this function will return the array indices that contain the string "strOI"
	//OUTPUT: the output is a string with the sentence indices separated by the delimiter ","
	//NOTE: this function can be used in conjunction with function "strTools_getSentsFromArr(strSentI,arrSents,sentRadius)"

	//STEP: format the word to either search for the whole word unless there are "*" present
	// strOI=escapeRegExp(strOI);		//escape all characters that need to be escaped before creating new RegExp element
	var getFormattedWord=formatSearchWord(strOI,"\\b");

	//STEP: create regular expression and search for word & remove string "strRM" from "fullStr"
	if(boolCaseInsen){var regEx_StrOI=new RegExp(getFormattedWord,"i");}
	else{var regEx_StrOI=new RegExp(getFormattedWord);}

	//STEP: go through each sentence to see if the word is found
	var delimSentI=",";
	var strSentI="";
	for(var i in arrSents)
	{
		var boolMatch=arrSents[i].match(regEx_StrOI);
		if(boolMatch)
		{
			if(strSentI==""){strSentI+=i;}
			else{strSentI+=","+i;}
		}
	}

	return strSentI;
}

function strTools_checkAllWordsPresent(strWordList,delimWL,bodyText)
{
	//VAR: strWordList = string of a list of words to look for in the document, where each word is separated by a delimiter (see delimWL)
	//VAR: delimWL = delimiter Word List, the delimiter that separates the words in the string "strWordList"
	//VAR: bodyText = string that will be searched to see if words in "strWordList" are present in "bodyText"
	//METHOD: this function will check if all words in "strWordList" are present 

	//STEP: split strWordList into an array of individual words
	var arrWordList=strWordList.split(delimWL);

	//STEP: check if all words are present in string "bodyText"
	var boolMatch=true;					//boolean that, if true, means all the words in strWordList are in string "bodyText". Else, if false, means not all the words in "strWordList" are present in "bodyText"
	for(var x in arrWordList)
	{
		boolMatch=strTools_CheckIfStrPresent(bodyText,arrWordList[x],"i");
		if(!boolMatch){break;}
	}

	return boolMatch;
}

function strTools_compileSents(strSentI,delimSentI,sentRadius,arrSents)
{
	//VAR: strSentI = string that contains a list of sentence indices referring to indices in array "arrSents"
	//VAR: delimSentI = delimiter that separates multiple sentence indices in string "strSentI" 
	//VAR: arrSents = array of sentences from a document, where each array element is a sentence
	//VAR: sentRadius = integer that is the sentence indices to look at around a specific sentence
	//METHOD: this function will compile sentences from the sentence indices in "strSentI"

	//STEP: get basic information about document
	var arrDocLen=arrSents.length;
	var lastSentI=arrDocLen-1;

	//STEP: compile all sentences recorded with string 
	var arrSentI=strSentI.split(delimSentI);
	var compileSents="";
	for(var i in arrSentI)
	{
		var sentRange=arrTools_CheckArrRangeRadial(arrSentI[i],lastSentI,sentRadius);
		for(var i2=sentRange.startI;i2<=sentRange.endI;i2++){compileSents+=arrSents[i2]+" ";}
	}
	
	return compileSents;
}

function strTools_getSentsFromArr(strSentI,arrSents,sentRadius)
{
	//VARS: strSentI = string that contains the sentence indices, where multiple sentence indices are separated by ","; arrSents = array of sentences where each element in the array is a sentence in a larger document; hubWord & denseWord; sentRadius = integer that will consider the sentence that contains the current sentence and the surrounding sentences (e.g. if sentence X contains "hubWord" and the radius is 2, then sentences X-2 & X+2 will also be considered to find the string "hubWord")
	//METHOD: this function will retrieve the sentences in the sentence indices recorded in "strSentI" in array "arrSents" 
	//NOTE: this function can be used in conjunction with function "strTools_searchWordInArr(strOI,arrSents,boolCaseInsen)"
	var delimSentI=",";		//delimiter that separates multiple sentence indices in the string "strSentI"

	//STEP: retrieve information about the document
	var arrDocLen=arrSents.length;
	var lastSentI=arrDocLen-1;

	//STEP: compile the sentences that contain the word of interest
	var arrSentI=strSentI.split(delimSentI);
	var compileSents="";
	for(var i in arrSentI)
	{
		//STEP: retrieve the range of sentences that will be searched 
		var sentRange=arrTools_CheckArrRangeRadial(arrSentI[i],lastSentI,sentRadius);
		for(var i2=sentRange.startI;i2<=sentRange.endI;i2++){compileSents+=arrSents[i2]+" ";}
	}

	return compileSents;
}

function strTools_checkPrefix(strPrefix,wordOI)
{
	//VAR: strPrefix = string that will be searched for in the beginning of the string "wordOI"
	//VAR: wordOI (word Of Interest) = string that may or may not begin with the prefix in "strPrefx"
	//METHOD: this function will check if the prefix is present in the string "wordOI"
	//OUTPUT: this function will output true if the prefix "strPrefix" is present, else will output false

	//STEP: retrieve the beginning of the string "wordOI"
	if(wordOI.length>strPrefix.length)
	{
		var prefixLen=strPrefix.length;
		var wordOI_prefix=wordOI.substr(0,prefixLen);		//extract the beginning of the string
		var strPrePres=strTools_findMatch(strPrefix,wordOI_prefix,"i");		//boolPrePres = boolean Prefix Present, this will be null if the string does not match

		//STEP: if the prefix is present, then "strPrePres" will not be null -> boolPrePres will be true, ELSE it will be false
		if(strPrePres!=null){var boolPrePres=true;}
		else{var boolPrePres=false;}
	}
	else{var boolPrePres=false;}

	return boolPrePres;
}

function strTools_checkSuffix(strSuffix,wordOI)
{
	//VAR: strSuffix = string that will be searched for in the beginning of the string "wordOI"
	//VAR: wordOI (word Of Interest) = string that may or may not begin with the Suffix in "strSuffx"
	//METHOD: this function will check if the Suffix is Present in the string "wordOI"
	//OUTPUT: this function will output true if the Suffix "strSuffix" is Present, else will output false

	//STEP: retrieve the beginning of the string "wordOI"
	if(wordOI.length>strSuffix.length)
	{
		var wordOI_pos=wordOI.length-strSuffix.length;		//find where to begin at the end of the string
		var wordOI_suffix=wordOI.substr(wordOI_pos);		//extract the end of the string
		var strSufPres=strTools_findMatch(strSuffix,wordOI_suffix,"i");		//boolSufPres = boolean Suffix Present, this will be null if the string does not match

		//STEP: if the Suffix is Present, then "strSufPres" will not be null -> boolSufPres will be true, ELSE it will be false
		if(strSufPres!=null){var boolSufPres=true;}
		else{var boolSufPres=false;}
	}
	else{var boolSufPres=false;}

	return boolSufPres;
}
//END: StrTools Search - functions used to search for words


//START: Quantify Words - functions use to quantify words in a body of text
function strTools_CalcWordCount(getStr)
{
	//METHOD: this function will count the # of words in a string "getStr"
	// var blankSpace=/ /g;
	// var wordCount=(getStr.match(blankSpace) || []).length+1;
	getStr=getStr.trim();
	return getStr.split(" ").length;
}

function strTools_strFrequency(strOI,strLookInto,caseInsen)
{
	//VARS: strOI = string that will be searched for in string "stringLookInto"; strLookInto = the string that will be searched; caseInsen = a boolean that if true, will search for all words regardless of character case
	//METHOD: this function will count the # of occurrences of string variable "strOI" in string "strLookInto"
	//NOTE: this function will find all occurrences of "strOI" in "strLookInto", even if it surrounded by word characters.
	if(caseInsen)
	{
		strOI=strOI.toLowerCase();
		strLookInto=strLookInto.toLowerCase();
	}
	var countStr=strLookInto.split(strOI).length-1;

	return countStr;
}

function strTools_strFreq_FullWord(searchStr,strDB,modifiers)
{
	//VARS: searchStr = the string to search for in larger string "strDB"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
	//METHOD: this function finds only the whole word unless there are "*" are present in the string
	//NOTE: this function is similar to "strTools_strFrequency" - however focuses on full words unless "*" in present

	//STEP: format the word to either search for the whole word unless there are "*" present
	// searchStr=escapeRegExp(searchStr);		//escape all characters that need to be escaped before creating new RegExp element
	var getFormattedWord=formatSearchWord(searchStr,"\\b");
	
	//STEP: create regular expression and search for word
	var reSearchStr=new RegExp(getFormattedWord,modifiers);
	var countStr=strDB.split(reSearchStr).length-1;
	//ANOTHER WAY TO COUNT BELOW
	//var countStr=(strDB.match(reSearchStr) || []).length;
	
	return countStr;
}

function strTools_WordFreq(fullStr)
{
	//METHOD: this function will count the number of times a word occurs within the body of text fullStr
	//STEP: homogenize text by removing punctuations & lowercasing all the text
	fullStr=strTools_homogenizeTextV0(fullStr);

	//STEP: split the words by spaces, sort each word, & count each word
	var arrFullStr=fullStr.split(/\s/);
	arrFullStr=arrTools_removeBlanks(arrFullStr);
	arrFullStr.sort();					//sort the array alphabetically
	var arrWordFreq=new Array();		//this array will record the word count for each word in the format "#:word" (e.g. 12:car)
	var currentWord=arrFullStr[0];		//currentWord = the first word in the array arrFullStr
	var wordCounter=0;					//wordCounter = this counts the # of times a word occurs
	for(var x in arrFullStr)
	{
		//"localCompare" is a javascript function that compares 2 strings - str1.localeCompare(str2). 
		//"localCompare" returns -1 if str1 is sorted before str2, returns 0 if the 2 strings are equal, or returns 1 if str1 is sorted after str2 
		var strCompare=currentWord.localeCompare(arrFullStr[x]);
		if(strCompare==0){wordCounter++;}
		else 				//means the strings are not same
		{
			//prepare the string by recording word occurrence & current word, then insert into array
			var strWordFreq=wordCounter+":"+currentWord;
			arrWordFreq.push(strWordFreq);
			//reset variables by assigning next word to the current word & resetting wordCounter
			currentWord=arrFullStr[x];
			wordCounter=1;			//set to 1 as currentWord is assigned to the first occurrence
		}
	}

	return arrWordFreq;
}

function strTools_WordPerSent(wordOI,arrDoc,delim_WF)
{
	//VAR: wordOI = string that is being searched for in each element in array "arrDoc"
	//VAR: arrDoc = array where each element contains string (usually is a sentence in each element)
	//VAR: delim_WF = delimiter Word Freq - this separates the word frequency for each element
	//METHOD: this function will calculate how frequently a word occurs in each element of the array "arrDoc"
	//OUTPUT: this function will output a string in the format "0:2:4:3:0:0:0:2:3:0:2" where each # is the occurrence of wordOI in each element of array "arrDoc"
	if(delim_WF==null){delim_WF=":";}		//delim_WF = delimiter Word Freq - this separates the word frequency for each element	

	//STEP: calculate the frequency of the word in each sentence
	var arrWordFreq=new Array();
	for(var a in arrDoc)
	{
		var wordCount=strTools_strFreq_FullWord(wordOI,arrDoc[a],"gi");
		arrWordFreq.push(wordCount);
	}

	//STEP: collapse array into string separated by delimiter
	var strWordFreq=arrWordFreq.join(delim_WF);

	return strWordFreq;
}

function WordPerSent_Radius_CorrectingFactor(numWordFreq,sentRadius,diamConsidered)
{
	//VARS: numWordFreq = number that is the word frequency; sentRadius = number that is the sentence radius considered; diamConsidered = the  actual diameter (radius before sentI + sentI itself + radius after sentI) considered for calculating "numWordFreq"
	//METHOD: this function performs a correction calculation - if a sentence doesn't get its entire radius (say beginning & end sentences) then should perform a correction as to fairly compare to other sentences
	var diamTrue=2*sentRadius+1;
	var correctedFreq=numWordFreq*(diamTrue/diamConsidered);

	return correctedFreq;
}

function strTools_WordPerSent_Radius(strWordFreq,sentRadius,boolLinear,delim_WF)
{
	//VAR: strWordFreq = a string in the format "0:2:4:3:0:0:0:2:3:0:2" where each # is the occurrence of a string (i.e. a word) in each element of array "arrDoc"
	//VAR: sentRadius = integer that is the # of sentences to look at before & after the current sentence
	//VAR: boolLinear = boolean that, if true, will only consider elements after a specific element, else if false then will consider elements around a specific element (NOTE that an element could be a sentence).
	//VAR: delim_WF = delimiter Word Freq - this separates the word frequency for each element
	//METHOD: this function will calculate how often each word occurs in a specific sentence radius
	//OUTPUT: this function will output a string in the format "0:2:4:3:0:0:0:2:3:0:2" where each # is the sum of the #s within a radius "sentRadius"
	//NOTE: This function should be used after "strTools_WordPerSent(wordOI,arrDoc)" as parameter "strStemFreq" is processed by the function "strTools_WordPerSent()"
	if(delim_WF==null){delim_WF=":";}		//delim_WF = delimiter Word Freq - this separates the word frequency for each element

	var arrWF=strWordFreq.split(delim_WF);				//arrWF = array Stem Word Frequency, an array where each index is the sentence index & the value is the frequency of the string "stemOI" at that sentence
	var arrDocLen=arrWF.length;
	var lastSentI=arrDocLen-1;

	//CALCULATE THE FREQUENCY OF A WORD IN GIVEN REGION//
	//STEP: calculate how frequently a word occurs within the sent radius
	var arrCalc_WFR=arrTools_generateHomogenArr(arrDocLen,0);		//arrCalc_WFR = array calculate word frequency radius
	for(var a in arrWF)
	{
		//calculate the range to sum word frequency
		if(boolLinear){var radiusRange=arrTools_CheckArrRangeLinear(a,lastSentI,sentRadius);}
		else{var radiusRange=arrTools_CheckArrRangeRadial(a,lastSentI,sentRadius);}
		//sum the stem word frequency within the radius range, make sure to use "parseInt" as the value is stored as a string
		for(var b=radiusRange.startI;b<=radiusRange.endI;b++){arrCalc_WFR[a]+=parseInt(arrWF[b]);}
		
		//STEP: perform a correction calculation - if a sentence doesn't get its entire radius (say beginning & end sentences) then should perform a correction as to fairly compare to other sentences
		var diamConsidered=radiusRange.endI-radiusRange.startI+1;		//"+1" because also need to consider first sentence in diameter. (e.g. at sentI 7 with radius 2, sentences considered are 5,6,7,8,9 - so 9-5=4, but the diameter considered is 5 so need to add +1)
		arrCalc_WFR[a]=WordPerSent_Radius_CorrectingFactor(arrCalc_WFR[a],sentRadius,diamConsidered);
	}

	//STEP: collapse array into string separated by delimiter
	var strWordFreq_Radius=arrCalc_WFR.join(delim_WF);

	return strWordFreq_Radius;
}

function strTools_WordPerSent_Radius_BackUp(strWordFreq,sentRadius)
{
	//VARS: strWordFreq = a string in the format "0:2:4:3:0:0:0:2:3:0:2" where each # is the occurrence of a string (i.e. a word) in each element of array "arrDoc"; sentRadius = integer that is the # of sentences to look at before & after the current sentence
	//METHOD: this function will calculate how often each word occurs in a specific sentence radius
	//OUTPUT: this function will output a string in the format "0:2:4:3:0:0:0:2:3:0:2" where each # is the sum of the #s within a radius "sentRadius"
	//NOTE: This function should be used after "strTools_WordPerSent(wordOI,arrDoc)" as parameter "strStemFreq" is processed by the function "strTools_WordPerSent()"
	var delim_WF=":";			//delim_WF = delimiter Word Freq - this separates the word frequency for each element

	var arrWF=strWordFreq.split(delim_WF);				//arrWF = array Stem Word Frequency, an array where each index is the sentence index & the value is the frequency of the string "stemOI" at that sentence
	var arrDocLen=arrWF.length;
	var lastSentI=arrDocLen-1;

	//CALCULATE THE FREQUENCY OF A WORD IN GIVEN REGION//
	//STEP: calculate how frequently a word occurs within the sent radius
	var arrCalc_WFR=arrTools_generateHomogenArr(arrDocLen,0);		//arrCalc_WFR = array calculate word frequency radius
	for(var a in arrWF)
	{
		//calculate the range to sum word frequency
		var radiusRange=arrTools_CheckArrRangeRadial(a,lastSentI,sentRadius);
		//sum the stem word frequency within the radius range, make sure to use "parseInt" as the value is stored as a string
		for(var b=radiusRange.startI;b<=radiusRange.endI;b++){arrCalc_WFR[a]+=parseInt(arrWF[b]);}
		
		//STEP: perform a correction calculation - if a sentence doesn't get its entire radius (say beginning & end sentences) then should perform a correction as to fairly compare to other sentences
		var diamConsidered=radiusRange.endI-radiusRange.startI+1;		//"+1" because also need to consider first sentence in diameter. (e.g. at sentI 7 with radius 2, sentences considered are 5,6,7,8,9 - so 9-5=4, but the diameter considered is 5 so need to add +1)
		arrCalc_WFR[a]=WordPerSent_Radius_CorrectingFactor(arrCalc_WFR[a],sentRadius,diamConsidered);
	}

	//STEP: collapse array into string separated by delimiter
	var strWordFreq_Radius=arrCalc_WFR.join(delim_WF);

	return strWordFreq_Radius;
}
//END: Quantify Words - functions use to quantify words in a body of text

//START: Quantify Words Part 2 - more advanced functions use to quantify words in a body of text
function strTools_AllWordsFreqSorted(fullStr,boolGtoL)
{
	//VARS: fullStr = string that contains the text; boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest
	//METHOD: this function will count all the words in a body of string
	//OUTPUT: this method will output an array where each element is "# of occurrences of a word:word" (e.g. 23:car)
	//NOTE: if do not want to include "dull" words (e.g. the, and, but), then will need to remove from fullStr before submitting to this function

	//STEP: retrieve the wordFreq in the document
	var arrWordFreq=strTools_WordFreq(fullStr);
	
	//STEP: sort the occurrence from greatest to least
	var arrSortedNumStrPair=arrTools_SortNumStrPair(arrWordFreq,boolGtoL);

	return arrSortedNumStrPair;
}

function strTools_AllWordsFreqSortedThres(fullStr,boolGtoL,thresVal,boolAbove)
{
	//VARS: fullStr = string that contains the text; boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest; thresVal = a number that serves as the threshold; boolAbove = a boolean value that, if true, will extract all values above the threshold, else will extract all values below the threshold value
	//METHOD: this function will count all the words in a body of string
	//OUTPUT: this method will output an array where each element is "# of occurrences of a word:word" (e.g. 23:car)
	//NOTE: if do not want to include "dull" words (e.g. the, and, but), then will need to remove from fullStr before submitting to this function

	//STEP: retrieve the wordFreq in the document
	var arrWordFreq=strTools_WordFreq(fullStr);
	
	//STEP: sort the occurrence from greatest to least
	var arrSortedNumStrPair=arrTools_ThresNumStrPair(arrWordFreq,boolGtoL,thresVal,boolAbove);

	return arrSortedNumStrPair;
}

function strTools_AllWordsFreqSortedTopX(fullStr,topX,boolGtoL,boolInclusive)
{
	//VARS: fullStr = string that contains the text; boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest; topX = number that refers to the first X elements of the array; boolInclusive = a boolean value that, if true, will include the topX values, else will return all values except for the topX values
	//METHOD: this function will count all the words in a body of string
	//OUTPUT: this method will output an array where each element is "# of occurrences of a word:word" (e.g. 23:car)
	//NOTE: if do not want to include "dull" words (e.g. the, and, but), then will need to remove from fullStr before submitting to this function

	//STEP: retrieve the wordFreq in the document
	var arrWordFreq=strTools_WordFreq(fullStr);
	
	//STEP: sort the occurrence from greatest to least
	var arrSortedNumStrPair=arrTools_TopXNumStrPair(arrWordFreq,topX,boolGtoL,boolInclusive);		//the format of each element in the array is "number:string" where the number is the frequency of the string

	return arrSortedNumStrPair;
}

function strTools_AllWordsFreqSortedTopX_Ranked(fullStr,topX,boolGtoL,boolInclusive)
{
	//VARS: fullStr = string that contains the text; boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest; topX = number that refers to the first X elements of the array; boolInclusive = a boolean value that, if true, will include the topX values, else will return all values except for the topX values
	//METHOD: this function will count all the words in a body of string
	//OUTPUT: this method will output an array where each element is "# of occurrences of a word:word" (e.g. 23:car)
	//NOTE: if do not want to include "dull" words (e.g. the, and, but), then will need to remove from fullStr before submitting to this function
	var delimNSP=":";		//delimNSP = delimiter Number-String Pair, where "Number:String"

	//STEP: retrieve the wordFreq in the document
	var arrWordFreq=strTools_WordFreq(fullStr);
	
	//STEP: sort the occurrence from greatest to least
	var arrSortedNumStrPair=arrTools_TopXNumStrPair(arrWordFreq,topX,boolGtoL,boolInclusive);		//the format of each element in the array is "number:string" where the number is the frequency of the string

	//STEP: rank the words by their frequency, where the highest frequency is rank 1, 2nd highest is rank 2, etc.
	var currRankNum=1;
	var currWordFreq=0;
	var arrSortedNumStrPair_Ranked=new Array();
	for(var a in arrSortedNumStrPair)
	{
		var arrSplitNS=arrSortedNumStrPair[a].split(delimNSP);		//splits the Number-String Pair, where [0] = number (word frequency), and [1] = string (word that occurs the number of times in [0])
		var numFreq=parseInt(arrSplitNS[0]);
		var strWord=arrSplitNS[1];
		if(a==0)		//if this is the first element in the array, then need to set the currWordFreq
		{
			currWordFreq=numFreq;
			var rankStrPair=currRankNum+":"+strWord;
			arrSortedNumStrPair_Ranked.push(rankStrPair);
		}
		else 
		{
			//TEST: console.log("BEFORE a = "+a+" || word = "+strWord+" || numFreq = "+numFreq+" || currFreq = "+currWordFreq+" >> rank = "+currRankNum);
			//Assumption: the Number-String Pair is sorted in desired direction 
			if(numFreq==currWordFreq)
			{
				var rankStrPair=currRankNum+":"+strWord;
				arrSortedNumStrPair_Ranked.push(rankStrPair);
			}
			else
			{
				currWordFreq=numFreq;			//record new word frequency value as frequency value has changed
				currRankNum++;					//increment the rank to the next value (therefore decrease the rank)
				var rankStrPair=currRankNum+":"+strWord;
				arrSortedNumStrPair_Ranked.push(rankStrPair);
			}
			//TEST: console.log("AFTER a = "+a+" || word = "+strWord+" || numFreq = "+numFreq+" || currFreq = "+currWordFreq+" >> rank = "+currRankNum);
		}
	}

	return arrSortedNumStrPair_Ranked;
}

function strTools_NSPGetSpecificWord_All(valOI,arrNSP,boolCaseInsen)
{
	//VARS: valOI = this is the string that will be searched for in arrNSP; arrNSP = array Number-String Pair, which is in the format "number:string"; boolCaseInsen = boolean that, if true, is case-insensitive, else if false is case-sensitive
	//METHOD: this function will retrieve the specific number and pair based on the word or frequency
	var delimNSP=":";	//delimNSP = delimiter Number-String Pair, where "Number:String"
	var nsIndex=1;		//nsIndex = number-string index

	if(boolCaseInsen){valOI=valOI.toLowerCase;}

	//STEP: go through each value and see which one matches
	var arrNumOfMatch=new Array();		//this array will record the number associated with the word
	for(var a in arrNSP)
	{
		var arrSplitNSP=arrNSP[a].split(delimNSP);		//split element into 2 components, [0] = number, [1] = string
		if(boolCaseInsen){arrSplitNSP[0]=arrSplitNSP[0].toLowerCase;}
		if(valOI==arrSplitNSP[1]){arrNumOfMatch.push(arrSplitNSP[0]);}			
	}

	return arrNumOfMatch;
}

function strTools_NSPGetSpecificWord_FirstOccur(valOI,arrNSP,boolCaseInsen)
{
	//VARS: valOI = this is the string that will be searched for in arrNSP; arrNSP = array Number-String Pair, which is in the format "number:string"; boolCaseInsen = boolean that, if true, is case-insensitive, else if false is case-sensitive
	//METHOD: this function will retrieve the specific number and pair based on the word or frequency
	var delimNSP=":";	//delimNSP = delimiter Number-String Pair, where "Number:String"
	var nsIndex=1;		//nsIndex = number-string index

	if(boolCaseInsen){valOI=valOI.toLowerCase();}

	//STEP: go through each value and see which one matches
	var strNumOfMatch=null;		//this array will record the number associated with the word
	for(var a in arrNSP)
	{
		var arrSplitNSP=arrNSP[a].split(delimNSP);		//split element into 2 components, [0] = number, [1] = string
		if(boolCaseInsen){arrSplitNSP[1]=arrSplitNSP[1].toLowerCase();}
		if(valOI==arrSplitNSP[1])
		{
			strNumOfMatch=arrSplitNSP[0];
			break;
		}			
	}

	return strNumOfMatch;
}

function strTools_NSPGetWordsOnly(arrNSP)
{
	//VARS: arrNSP = array Number-String Pair, which is in the format "number:string" (0 = number, 1 = string)
	//METHOD: this function will retrieve only the words associated in the array Number-String Pair (arrNSP)
	var delimNSP=":";

	//STEP: traverse the array "arrNSP" and only record the words
	var arrStrOnly=new Array();
	for(var x in arrNSP)
	{
		var arrElem=arrNSP[x].split(delimNSP);
		arrStrOnly.push(arrElem[1]);
	}

	return arrStrOnly;
}

function strTools_convertNSPtoHash(arrNSP,hashName)
{
	//VAR: arrNSP = array Number-String Pair, where the format of each element in the array is "number:string"
	//VAR: hashName = name of a hash that contains the values 
	//METHOD: this function will enter the values from an NSP (Number-String Pair) into a hash
	var delimNSP=":";		//delimiter that separates the number from the string in the arrNSP

	//STEP: go through the array "arrNSP", adding each value from the arrNSP to the hash
	for(var a in arrNSP)
	{
		//STEP: split the value of the arrNSP, where [0] is the number & [1] is the string
		var arrSplitNSP=arrNSP.split(delimNSP);
		arrSplitNSP[0]=parseFloat(arrSplitNSP[0]);
		//make sure, if the the key does not have a value, it initialize it
		hash_addValToKeyIfNonExistent(hashName,arrSplitNSP[1],0);			//(hashName,keyName,valToAdd)
		//now add the value to the hash
		hash_addIntValToKey(hashName,arrSplitNSP[1],arrSplitNSP[0]);
	}
}

function strTools_convertNSPtoHashV2(arrNSP,hashName,appendToKey,boolBefore)
{
	//VAR: arrNSP = array Number-String Pair, where the format of each element in the array is "number:string"
	//VAR: hashName = name of a hash that contains the values 
	//VAR: appendToKey = string that will be appended (prepended if boolBefore is true) to the key
	//VAR: boolBefore = boolean that, if true, will prepend the string "appendToKey" before the key, else will append after
	//METHOD: this function will enter the values from an NSP (Number-String Pair) into a hash
	//NOTE: this function will be able to append a value to the key
	var delimNSP=":";		//delimiter that separates the number from the string in the arrNSP

	//STEP: go through the array "arrNSP", adding each value from the arrNSP to the hash
	for(var a in arrNSP)
	{
		//STEP: split the value of the arrNSP, where [0] is the number & [1] is the string
		var arrSplitNSP=arrNSP[a].split(delimNSP);
		arrSplitNSP[0]=parseFloat(arrSplitNSP[0]);

		//STEP: append string to key
		if(boolBefore){var keyName=appendToKey+""+arrSplitNSP[1];}
		else{var keyName=arrSplitNSP[1]+""+appendToKey;}
		//make sure, if the the key does not have a value, it initialize it
		hash_addValToKeyIfNonExistent(hashName,keyName,0);			//(hashName,keyName,valToAdd)
		//now add the value to the hash
		hash_addIntValToKey(hashName,keyName,arrSplitNSP[0]);
	}
}
//END: Quantify Words Part 2 - more advanced functions use to quantify words in a body of text

//START: MODIFY STRING BY REPLACING, INSERTING, REMOVING CHARACTERS
function strTools_insertIntoStr(strInject,strBody,bodyPos)
{
	//METHOD: insert string "strInject" into the "strBody" at position "bodyPos"
	var strFirstHalf=strBody.slice(0,bodyPos);
	var strSecondHalf=strBody.slice(bodyPos);
	var injectedStr=strFirstHalf+""+strInject;
	var fuseStr=injectedStr+""+strSecondHalf;

	return fuseStr;
}

function strTools_CapEnds(strBody,strCap)
{
	//METHOD: this function will add string "strCap" to the start and end of the string "strBody"
	var newStrBody=strCap+""+strBody+""+strCap;
	return newStrBody;
}

function strTools_homogenizeTextV0(getText)
{
	getText=getText.toLowerCase();
	getText=strTools_removePunctuations(getText)

	return getText;
}

function strTools_homogenizeText(getText)		//getText is suppose to receive normal text, not an array
{
	getText=getText.toLowerCase();
	getText=strTools_removePunctuationsAndLetters(getText);
	getText=strTools_removeCommonWords_SelectText(getText);

	return getText;
}

function strTools_removeMultiBlanks(getText,boolKeepSingleSpace)
{
	//VARS: getText = the string that may contain multiple blanks; boolKeepSingleSpace = boolean that, if true, will replace multiple spaces with a single space
	//METHOD: this function will remove multiple blanks and, if boolKeepSingleSpace is true, will replace with only a single space
	//STEP: this looks for at least 2 spaces
	// if(boolKeepSingleSpace){var strNew=strTools_replaceAllStr(/\s{2,}/g," ",getStr);}
	// else{var strNew=strTools_replaceAllStr(/\s{2,}/g,"",getStr);}

	//this look for at least a single space
	if(boolKeepSingleSpace){var strNew=strTools_replaceAllStr(/\s+/g," ",getText);}
	else{var strNew=strTools_replaceAllStr(/\s+/g,"",getText);}

	return strNew;
}

function strTools_removePunctuations(getText)
{
	//METHOD: this function will remove punctuations by replacing punctuations with blanks
	getText=getText.replace(/[\W]/g," ");			//removes non-word characters
	return getText;
}

function strTools_removePunctuationsAndLetters(str)
{
	//str=str.replace(/[\W,\s]/g," ");
	str=str.replace(/[\W]/g," ");			//removes non-word characters
	str=str.replace(/\b[a-z]\b/gi," ");		//removes single letters
	str=strTools_removeSingleDigits(str);	//remove single digits from string
	return str;
}

function setCommonWordsArray()
{
	commonWordsArray=commonWordsText.split(",");

	return commonWordsArray;
}

function strTools_removeCommonWords_SelectText(getText)
{
	//METHOD: this function will remove all common words (recorded in listRCW = list Remove Common WOrds) from string "getText" and return get text with words removed
	var modifiers="gi";
	var listRCW=setCommonWordsArray();
	for(var x in listRCW){getText=strTools_removeStr(getText,listRCW[x],modifiers);}

	return getText;
}

function strTools_removeSingleDigits(getText)
{
	//METHOD: this function will remove single instances of digits within a string (i.e. number with spaces around it)
	// getText=getText.replace(/\d/g," ");					//removes all numbers from the string
	// getText=getText.replace(/[\d]/g," ");					//removes all numbers from the string - same as /\d/g
	// getText=getText.replace(/\d{2,3}/g," ");					//removes all numbers from the string that occur 2 to 3 consecutive times, but not single digits
	getText=getText.replace(/\b\d\b/g," ");			//removes all numbers with spaces on both sides
	return getText;
}

function strTools_removeFirst_LastChars(getText,rmStr)
{
	//METHOD: removes first & last occurrence in text
	var newText=strTools_removeFirstChars(getText,rmStr);
	newText=strTools_removeLastChars(newText,rmStr);
	return newText;
}

function strTools_removeFirstChars(getText,rmStr)
{
	//METHOD: removes the first occurrence of "rmStr" from "getText". This function is useful for removing delimiters when splitting a string into an array
	//ASSUMPTION: This assumes that all characters before "rmStr" in variable "getText" will be removed
	var n=getText.indexOf(rmStr);
	if(n>=0)
	{
		var rmStrLen=rmStr.length;		//get the length of the string that needs to be removed
		var newN=n+rmStrLen;				//the new position will be the position of "rmStr" + rmStr's length
		var newStr=getText.substring(newN);
	}
	else
	{
		var newStr=getText;
	}
	return newStr;
}

function strTools_removeLastChars(getText,rmStr)
{
	//METHOD: removes the last occurrence of "rmStr" from "getText". This function is useful for removing delimiters when splitting a string into an array
	var n=getText.lastIndexOf(rmStr);
	if(n>=0)
	{
		var newStr=getText.substring(0,n);
	}
	else
	{
		var newStr=getText;
	}

	return newStr;
}

function strTools_replaceAllStr(getOldStr,getNewStr,getFullStr)
{
	//VARS: getOldStr = substring within "getFullStr" that will be replaced; getNewStr = substring that will replace "getFullStr"
	//METHOD: this function will replace string "getOldStr" with "getNewStr"
	//NOTE: can remove all instances of getOldStr in getFullStr by making modifier="gi" (global & case-insensitive) & making getNewStr=" " or getNewStr=""
	var reOldStr=strTools_CheckIfRegExp(getOldStr,"");		//make sure getOldStr is not a regular expression already
	var getNewFullStr=getFullStr.replace(reOldStr,getNewStr);

	return getNewFullStr;
}

function strTools_removeStr(fullStr,strRM,modifiers)
{
	//VARS: fullStr = larger string where smaller string "strRM" will be removed from "fullStr"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
	//METHOD: this function will remove a string "strRM" from a larger string "fullStr"

	//STEP: format the word to either search for the whole word unless there are "*" present
	// strRM=escapeRegExp(strRM);			//escape all characters that need to be escaped before creating new RegExp element
	var getFormattedWord=formatSearchWord(strRM,"\\b");
	//STEP: create regular expression and search for word & remove string "strRM" from "fullStr"

	var reSearchStr=new RegExp(getFormattedWord,modifiers);
	fullStr=fullStr.replace(reSearchStr,"");

	// console.log("strTools_removeStr 99 = "+fullStr);
	
	return fullStr;

}
//END: MODIFY STRING BY REPLACING, INSERTING, REMOVING CHARACTERS


function strTools_shortenList(arrWords,numOfWords,newDelim)
{
	//VARS: arrWords = an array of words of interest, numOfWords = an integer that is the limit of the # of words to extract from "arrWords", newDelim = the character or string delimiter that will separate each word.
	//METHOD: select the first "numOfWords" words in the array "arrWords" where each word is separated by string "newDelim"
	var recordTopNumWords="";
	var wordCount=0;
	var arrWordsCount=0;
	while((wordCount<numOfWords) && (arrWordsCount<arrWords.length))
	{
		//do not add blanks to the word list
		if(arrWords[arrWordsCount]!="")
		{
			recordTopNumWords+=arrWords[arrWordsCount]+""+newDelim;
			wordCount++;
		}
		arrWordsCount++;
	}

	return recordTopNumWords;
}

function strTools_splitStrByNonWordChars(getStr)
{
	//METHOD: this function will split "getStr" based on non-word characters such as "?", ",", "-", etc.	
	var arrWordFrags=new Array();
	var regExp_NWC=/[\W]/g;											//regExp_NWC (Non-word characters) = regular expression for Non-Word Characters
	var regExp_NWC_EWS=/[^\w\s]/g;					//regExp_NWC_EWS (Non-word characters Except White Spaces) = this detects all non-word characters via not considering word characters (\w) nor blank spaces (\s)
	var arrPos_NWC=strTools_findNonWordMatches(regExp_NWC,getStr);		//pos_NWC = position of Non-Word Characters
	//check to see if any non-word characters were found by checking for string positions
	if(arrPos_NWC.length>0)
	{
		var arrPos_Mod=new Array();										//this array will record the original positions & the +1 position
		//add the +1 position to the array
		for(var x in arrPos_NWC)
		{
			var makeNextPos=parseInt(arrPos_NWC[x])+1;
			arrPos_Mod.push(parseInt(arrPos_NWC[x]));
			if(x<(arrPos_NWC.length)){arrPos_Mod.push(makeNextPos);}
		}
		//retrieve the individual words & the non-word characters
		arrWordFrags=strTools_splitStrInArrPos(getStr,arrPos_Mod);
	}
	else
	{
		arrWordFrags.push(getStr);
	}

	return arrWordFrags;
}

function strTools_splitStrInArrPos(getStr,arrPos)
{
	//METHOD: splits a string "getStr" in the positions recorded in "arrPos"
	var startPos=0;
	var arrSentFrags=new Array();
	for(var x in arrPos)
	{
		if(startPos!=arrPos[x])
		{
			//get the fragment of the sentence
			var getFrag=getStr.substring(startPos,arrPos[x]);
			//push the fragement into the array recording the fragment
			arrSentFrags.push(getFrag);
			//record next position of sentence
		}
		startPos=arrPos[x];
	}

	//get last sentence fragment
	var getLastFrag=getStr.substring(startPos);
	arrSentFrags.push(getLastFrag);

	return arrSentFrags;
}

function strTools_CheckForDuplicates(piece,whole)
{
	//METHOD: this function will check if the string "piece" is already present in "whole". If not present, then the string will be added to "whole", else it will not be added to "whole"
	var boolDuplic;
	var keyStr=new RegExp(piece,"gi");
	if(whole.match(keyStr)!=null){boolDuplic=true;}
	else{boolDuplic=false;}

	return boolDuplic;
}

function strTools_addIfNoDuplic(piece,whole)
{
	//METHOD: this function will check if the string "whole" contains "piece"
	var stat=strTools_CheckForDuplicates(piece,whole);
	if(stat){returnDB=whole;}
	else{returnDB=whole+""+piece;}

	return returnDB;
}

function strTools_checkForWordChars(getStr)
{
	//METHOD: this function is used to see if a string is only non-characters, e.g. punctuations, blanks
	var charCheck=/[\w\d]/i;		//this is for finding word-characters or digit-characters
	//var charCheck=/[\w]/i;			//this is for finding word characters only
	var boolWord;
	//if word-characters are found (meaning this is likely a word) are found, "boolWord" is true
	if(getStr.match(charCheck)){boolWord=true;}
	//else, if non-word characters found, then return false
	else{boolWord=false;}

	return boolWord;
}

//REMOVE DUPLICATE WORDS FROM STRING
function strTools_PreserveDuplicStr(getConcatStr)
{
	//METHOD: this function will preserve the words that are common between 2 strings
	//OUTPUT: this function will return an array of the words common to both strings

	//STEP: concatenate strings, remove excess blanks, and turn into an array
	getConcatStr=strTools_removeMultiBlanks(getConcatStr,true);
	var arrConcatStr=getConcatStr.split(/\s/);

	//STEP: make string into array, check for duplicates
	var arrDuplicStr=strTools_arrayPreserveDuplicates(arrConcatStr);

	return arrDuplicStr;
}

function strTools_removeDuplicWords(getStr)
{
	//METHOD: purpose of this function is to remove duplicate words from a string
	//STEP: split string into array
	var getArr=getStr.split(" ");
	//STEP: remove duplicate words using function arrayRemoveDuplicates - NOTE: this function also alphabetically orders
	 getArr=strTools_arrayRemoveDuplicates(getArr);
	 //STEP: join words back together from array back to string
	 var reformStr=getArr.join(" ");

	 return reformStr;
}

function strTools_removeDuplicElements(getStr,delim)
{
	//METHOD: purpose of this function is to remove duplicate words from a string
	//STEP: split string into array
	var getArr=getStr.split(delim);
	//STEP: remove duplicate words using function arrayRemoveDuplicates - NOTE: this function also alphabetically orders
	 getArr=strTools_arrayRemoveDuplicates(getArr);
	 //STEP: join words back together from array back to string
	 var reformStr=getArr.join(delim);

	 return reformStr;
}

function strTools_arrayRemoveDuplicates(getArr)
{
	//VARS: getArr = an array where each element contains a string
	//METHOD: this function removes multiple copies of specific value, only returning unique values in the array
	var currentVal, strCompare;
	//create new array that will hold all unique values
	var uniqArr=new Array();
	//sort array
	getArr.sort();
	for(var x in getArr)
	{
		if(x==0)
		{
			currentVal=getArr[x];
			uniqArr.push(currentVal);
		}
		else
		{
			//"localCompare" is a javascript function that compares 2 strings - str1.localeCompare(str2). 
			//"localCompare" returns -1 if str1 is sorted before str2, returns 0 if the 2 strings are equal, or returns 1 if str1 is sorted after str2 
			strCompare=currentVal.localeCompare(getArr[x]);
			if(strCompare!=0)	//means the strings are not same
			{
				currentVal=getArr[x];
				uniqArr.push(currentVal);
			}
		}
	}

	return uniqArr;
}

function strTools_arrayPreserveDuplicates(getArr)
{
	//METHOD: this function will keep words that occur duplicate from an array
	var strCompare;
	//create new array that will hold all unique values
	var duplicArr=new Array();
	//sort array
	getArr.sort();
	for(var x=0;x<=getArr.length-2;x++)
	{
		//"localCompare" is a javascript function that compares 2 strings - str1.localeCompare(str2). 
		//"localCompare" returns -1 if str1 is sorted before str2, returns 0 if the 2 strings are equal, or returns 1 if str1 is sorted after str2 
		strCompare=getArr[x].localeCompare(getArr[x+1]);
		//check if word already exists in array
		var duplicStr=duplicArr.join(" ");
		var wordExist=strTools_CheckIfStrPresent(duplicStr,getArr[x],"g");
		//if getArr[x] & getArr[x+1] match & getArr[x] has not been already recorded in the duplicArr, then record getArr[x] into duplicArr
		if((strCompare==0) && (!wordExist)){duplicArr.push(getArr[x]);}
	}

	return duplicArr;
}

//START: STRING SORTING//
function strTools_orderWordsByLen(arrWords,thresVal,minThres,boolLongToShort)
{
	//VAR: arrWords= a string array that may or may not contain words
	//VAR: thresVal = the cut off value for string length
	//VAR: minThres = a value that is either -1, 0, or 1. If -1, then thresVal is the minimum string length, else if 1 then thresVal is the maximum string length, else if 0 then disregard the threshold value
	//VAR: boolLongToShort = boolean that, if true, will reverse the array to return an array from longest to shortest (as oppposed to shortest to longest)
	//METHOD: this function will order an array of words by their length from shortest to longest
	//STEP: initialize arrWordLen
	thresVal=parseInt(thresVal);
	var delim=",";
	var arrWordLen=new Array();
	//get longest word in array
	var longestWord=strTools_findLongestStrInArr(arrWords);
	//initialize each element of arrWordLen - each element will record words with length "a" - as each element will record multiple words with a specific length separated by a delimiter, each element will be exploded into an array.
	for(var a=0;a<=longestWord.length;a++){arrWordLen[a]="";}

	//STEP: record words in the array that records by length by the words respective length
	for(var b in arrWords)
	{
		var wordLen=parseInt(arrWords[b].length);
		arrWordLen[wordLen]+=arrWords[b]+""+delim;
	}

	//STEP:combine each array element then explode array by delimiter "," to make an array
	var allWordsByLen="";
	if(minThres==-1)			//this means the strings from threshold value "thresVal" to the longest word will be retrieved
	{
		for(var c=thresVal;c<=longestWord.length;c++) 
		{
			allWordsByLen+=arrWordLen[c];
		}
	}
	else if(minThres==1)		//this means the strings between 0 and threshold value "thresVal" will be retrieved
	{
		for(var c=0;c<=thresVal;c++) 
		{
			allWordsByLen+=arrWordLen[c];
		}
	}
	else 	//this means that the threshold value isn't used
	{
		for(var c=0;c<=longestWord.length;c++) 
		{
			allWordsByLen+=arrWordLen[c];
		}
	}
	
	//remove the last "," so no blank elements occur
	allWordsByLen=strTools_removeLastChars(allWordsByLen,delim);

	//explode string by "," to make an array
	arrSortedByWordLen=allWordsByLen.split(delim);

	//STEP: if boolLongToShort is true, then need to reverse the array as the array has the words currently from shortest to longest
	if(boolLongToShort){arrSortedByWordLen.reverse();}

	return arrSortedByWordLen;
}
//END: STRING SORTING
//END strTools.


function arrTools_strToInt(getArr)
{
	//METHOD: converts an array of strings into integers, assuming the string in each elements are meant to be integers
	var arrInt=new Array();
	for(var x in getArr){arrInt[x] = +getArr[x];}

	return arrInt;
}

function arrTools_strToFloat(getArr)
{
	//METHOD: converts an array of strings into integers, assuming the string in each elements are meant to be integers
	var arrFloat=new Array();
	for(var x in getArr){arrFloat[x] = parseFloat(getArr[x]);}

	return arrFloat;
}

function arrTools_TopXArr(getArr,topX,boolGtoL,boolInclusive)
{
	//VARS: getArr = array of numbers that will be extracted from; thresVal = a number that serves as the threshold; boolInclusive = a boolean value that, if true, will include the topX values, else will return all values except for the topX values
	//METHOD: this function will extract part of the array "getArr" by picking values above the value thresVal
	//OUTPUT: this function will output a sorted array (from least to greatest) that either has values above a threshold (if boolAbove = true) or below a threshold (if boolAbove = false)

	if(topX<getArr.length)		//make sure there are enough elements to extract the topX elements from getArr
	{
		//STEP: make sure all values are in numerical form
		getArr=arrTools_strToFloat(getArr);
		topX=parseFloat(topX);

		//STEP: sort array from greatest to least
		if(boolGtoL){getArr.sort(function(a,b){return b - a;});}
		//OR, if boolGtoL is false, sort array from least to greatest
		else{getArr.sort(function(a,b){return a - b;});}

		//STEP: retrieve the first X elements (if boolInclusive is true) OR the remainder objects depending on 
		var arrExtract=new Array();
		if(boolInclusive){for(var x=0;x<topX;x++){arrExtract.push(getArr[x]);}}
		else{for(var x=topX;x<getArr.length;x++){arrExtract.push(getArr[x]);}}
	}
	else 			//else just return getArr because there aren't enough elements
	{
		var arrExtract=getArr;
	}

	//NOTE: the array "arrExtract" will contain the thresVal - if boolAbove = true, then it is the first element, else it will be the last element
	return arrExtract;
}

function arrTools_ThresholdArr(getArr,thresVal,boolAbove)
{
	//VARS: getArr = array of numbers that will be extracted from; thresVal = a number that serves as the threshold; boolAbove = a boolean value that, if true, will extract all values above the threshold, else will extract all values below the threshold value
	//METHOD: this function will extract part of the array "getArr"

	//STEP: make sure all values are in numerical form
	getArr=arrTools_strToFloat(getArr);
	thresVal=parseFloat(thresVal);
	getArr.push(thresVal);				//insert the threshold value so it can be found later after being sorted

	//STEP: sort array from least to greatest
	getArr.sort(function(a,b){return a - b;});
	
	//STEP: extract values either above (if boolAbove is true) or below (if boolBelow is false)
	var thresPos=getArr.indexOf(thresVal);
	if(boolAbove){var arrExtract=getArr.slice(thresPos);}
	else{var arrExtract=getArr.slice(0,thresPos+1);}

	//NOTE: the array "arrExtract" will contain the thresVal - if boolAbove = true, then it is the first element, else it will be the last element
	return arrExtract;
}

function arrTools_removeBlanks(getArr)
{
	//VARS: getArr = array where each element contains a string
	//METHOD: removes all blanks from an array
	var arrNoBlanks=new Array();
	for(var x in getArr)
	{
		//remove blanks before & after any word characters
		getArr[x]=getArr[x].trim();
		if(getArr[x]=="" || getArr[x]==" "){continue;}
		else{arrNoBlanks.push(getArr[x]);}
	}

	return arrNoBlanks;
}

function arrTools_sortNum(a,b){return a - b;}

function arrTools_sortGreatToLeast(a,b){return b - a;}

function arrTools_SortNumStrPair(getArr,boolGtoL)
{
	//VARS: getArr = an array that contains the "numerical:string" pair (e.g. 12:road); boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest
	//METHOD: this function will sort an array that contains both a number & string in the format "#:string" (e.g. 24:blue)
	//OUTPUT: this function will out getArr sorted, where each element will cotain the "numerical:string" pair (e.g. 12:road)
	var delimElem=":";

	//STEP: split each array element & extract the value
	var arrNum=new Array();
	for(var x in getArr)
	{
		//split the element in the array, where 0 will be the number & 1 will be the string
		var splitElem=getArr[x].split(delimElem);
		arrNum.push(splitElem[0]);
	}

	//STEP: sort the array
	if(boolGtoL){arrNum.sort(arrTools_sortGreatToLeast);}			//sort greatest to least
	else{arrNum.sort(arrTools_sortNum);}							//sort least to greatest

	//STEP: find the elements that contain a given value
	var arrSortedNumStrPair=new Array();
	var arrRemoveI=new Array();

 	for(var i in arrNum)			//this array has been sorted, so it should be going in numerical order
 	{
 		//STEP: retrieve the value of interest
 		var strNum=arrNum[i]+""+delimElem;
 		for(var j in getArr)
 		{
 			//see if match is found - if match found, then record
 			var matchFound=strTools_findMatch(strNum,getArr[j],"");
 			if(matchFound)
 			{
 				//add the value to final array that will be returned - arrSortedNumStrPair
 				arrSortedNumStrPair.push(getArr[j]);
 				//add index of getArr as it will be removed later
 				arrRemoveI.push(j);
 			}

 			//STEP: remove the indices from getArr then clear arrRemoveI - the reason I am removing the indices is so looping through the array will go faster (less elements to traverse through)
 			for(var k in arrRemoveI){getArr.splice(arrRemoveI[k],1);}
 			arrRemoveI=[];		//this blanks the array arrRemoveI
 		}
 	}

 	return arrSortedNumStrPair;
}

function arrTools_ThresNumStrPair(getArr,boolGtoL,thresVal,boolAbove)
{
	//VARS: getArr = an array that contains the "numerical:string" pair (e.g. 12:road); boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest; thresVal = a number that serves as the threshold; boolAbove = a boolean value that, if true, will extract all values above the threshold, else will extract all values below the threshold value
	//METHOD: this function will threshold an array that contains NumStrPairs (e.g. #:string)
	//OUTPUT: this function will out getArr sorted and thresholded, where each element will cotain the "numerical:string" pair (e.g. 12:road)
	//NOTE: the only difference between arrTools_SortNumStrPair() & arrTools_ThresNumStrPair() is that this function applies a threshold function with function arrTools_ThresholdArr()
	var delimElem=":";

	//STEP: split each array element & extract the value
	var arrNum=new Array();
	for(var x in getArr)
	{
		//split the element in the array, where 0 will be the number & 1 will be the string
		var splitElem=getArr[x].split(delimElem);
		arrNum.push(splitElem[0]);
	}

	//STEP: apply a threshold to cut off any values above the threshold (if boolAbove is true) or below the threshold (if boolAbove is false)
	arrNum=arrTools_ThresholdArr(arrNum,thresVal,boolAbove);

	//STEP: sort the array
	if(boolGtoL){arrNum.sort(arrTools_sortGreatToLeast);}			//sort greatest to least
	else{arrNum.sort(arrTools_sortNum);}							//sort least to greatest

	//STEP: find the elements that contain a given value
	var arrSortedNumStrPair=new Array();
	var arrRemoveI=new Array();

 	for(var i in arrNum)			//this array has been sorted, so it should be going in numerical order
 	{
 		//STEP: retrieve the value of interest
 		var strNum=arrNum[i]+""+delimElem;
 		for(var j in getArr)
 		{
 			//see if match is found - if match found, then record
 			var matchFound=strTools_findMatch(strNum,getArr[j],"");
 			if(matchFound)
 			{
 				//add the value to final array that will be returned - arrSortedNumStrPair
 				arrSortedNumStrPair.push(getArr[j]);
 				//add index of getArr as it will be removed later
 				arrRemoveI.push(j);
 			}

 			//STEP: remove the indices from getArr then clear arrRemoveI - the reason I am removing the indices is so looping through the array will go faster (less elements to traverse through)
 			for(var k in arrRemoveI){getArr.splice(arrRemoveI[k],1);}
 			arrRemoveI=[];		//this blanks the array arrRemoveI
 		}
 	}

 	return arrSortedNumStrPair;
}

function arrTools_TopXNumStrPair(getArr,topX,boolGtoL,boolInclusive)
{
	//VARS: getArr = an array that contains the "numerical:string" pair (e.g. 12:road); boolGtoL (sort Greatest to Least) = a boolean value that, if true, will sort the array from greatest to least, else it will sort from least to greatest; topX = number that refers to the first X elements of the array; boolInclusive = a boolean value that, if true, will include the topX values, else will return all values except for the topX values
	//METHOD: this function will threshold an array that contains NumStrPairs (e.g. #:string)
	//OUTPUT: this function will out getArr sorted and thresholded, where each element will cotain the "numerical:string" pair (e.g. 12:road)
	//NOTE: the only difference between arrTools_SortNumStrPair() & arrTools_ThresNumStrPair() is that this function applies a threshold function with function arrTools_ThresholdArr()
	var delimElem=":";

	//STEP: split each array element & extract the value
	var arrNum=new Array();
	for(var x in getArr)
	{
		//split the element in the array, where 0 will be the number & 1 will be the string
		var splitElem=getArr[x].split(delimElem);
		arrNum.push(splitElem[0]);
	}

	//STEP: apply a threshold to cut off any values above the threshold (if boolAbove is true) or below the threshold (if boolAbove is false)
	arrNum=arrTools_TopXArr(arrNum,topX,boolGtoL,boolInclusive);

	// //STEP: sort the array
	// if(boolGtoL){arrNum.sort(arrTools_sortGreatToLeast);}			//sort greatest to least
	// else{arrNum.sort(arrTools_sortNum);}							//sort least to greatest

	//STEP: find the elements that contain a given value
	var arrSortedNumStrPair=new Array();
	var arrRemoveI=new Array();

	//STEP: this retrieves all number-string pairs with number matches
 	for(var i in arrNum)			//this array has been numerically sorted (depends on boolGtoL, where true means greatest to least & false means least to greatest), so it should be going in numerical order
 	{
 		//STEP: retrieve the value of interest
 		var strNum=arrNum[i]+""+delimElem;
 		for(var j in getArr)		//go through each element in the Number-String array, collecting elements that match the numerical "strNum"
 		{
 			//see if match is found - if match found, then record
 			var matchFound=strTools_findMatch(strNum,getArr[j],"");
 			if(matchFound)
 			{
 				//add the value to final array that will be returned - arrSortedNumStrPair
 				arrSortedNumStrPair.push(getArr[j]);
 				//add index of getArr as it will be removed later
 				arrRemoveI.push(j);
 			}

 			//STEP: remove the indices from getArr then clear arrRemoveI - the reason I am removing the indices is so looping through the array will go faster (less elements to traverse through)
 			for(var k in arrRemoveI){getArr.splice(arrRemoveI[k],1);}
 			arrRemoveI=[];		//this blanks the array arrRemoveI
 		}
 	}

 	return arrSortedNumStrPair;
}

/*
//FILE: treeNode.js
//FUNCTION: this file sets up a treeNode data structure for javascript to use
//REQUIREMENTS: Need a <span id="treeNodeSystem"></span> in the body of the HTML file

//START treeNode Tools. These are functions to manipulate treeNodes
//format example = node1::node2;;
var g_delimPtoC="<>";			//delimiter for node to Child
var g_delimRel=":-:";				//delimiter for separating relations between node and child

// function browseAdj(x)
// {
// 	//NOTE: browseAdj(elementID).value works, but for ".innerHTML", need to assign variable before calling ".innerHTML"
// 	var object;
// 	 if(document.getElementById){	//Mozilla
//                   object=document.getElementById(x);
//             }else if(document.all){		//Internet Explorer
//                   object=document.all[x];
//             }else if(document.layers){		//Netscape
//                   object=document.layers[x];
//             }          
// 	return object;
// }

function treeNode_CreateTree(treeName)
{
	//METHOD: this function will create a treeNode
	//NOTE: when create a tree name, add "tree_" before the name as there will be no elements with the same ID
	var createTree=document.createElement("span");
	createTree.setAttribute("name","treeNetwork");				//be able to identify span as a hash
	createTree.setAttribute("value",treeName);					//this records the value of the tree
	createTree.setAttribute("treeString",g_delimRel);				//this will record the connections that create the hierarchical tree, NOTE: add the ";;" so then all relationships look the same - ";;node1::node2;;node3::node4;;". This will facilitate in searching for a node relationship
	browseAdj("treeNodeSystem").appendChild(createTree);
}

function treeNode_formatNode(node1,node2,treeStr)
{
	//METHOD: this function will format the insertion of the node1 & node2 relationship
	//format example = node1::node2;;
	var returnNodeCouple=null;

	//STEP: compare node1 & node2 to see which one is "greater" - do this so I don't have to look up both versions of a relationship node1::node2 & node2::node1
	if(node1<node2){var formatNodeCouple=node1+""+g_delimPtoC+""+node2+""+g_delimRel;}
	else{var formatNodeCouple=node2+""+g_delimPtoC+""+node1+""+g_delimRel;}

	//STEP: see if node couple exists
	var coupleExist=treeNode_checkForNodePairs(formatNodeCouple,treeStr);

	//STEP: if nodeCouple exists, then do not return anything
	if(!coupleExist){returnNodeCouple=formatNodeCouple;}

	return returnNodeCouple;
}

//TREENODE FUNCTIONS: ADD NODES
function treeNode_AddNewVal(treeName,node1,node2)
{
	//METHOD: this function will add value "addVal" to tree treeName
	//STEP: retrieve tree where node will be added
	var objTree=treeNode_searchForTree(treeName);

	//STEP: add the value to the tree treeName
	var formatNodeCouple=treeNode_formatNode(node1,node2,objTree.getAttribute("treeString"));
	
	//STEP: if formatNodeCouple is not null (meaning that it was not found in "treeString"), then add to treeString
	if(formatNodeCouple){objTree.setAttribute("treeString",formatNode);}
}

function treeNode_AppendVal(treeName,node1,node2)
{
	//VARS: treeName = string that refers to the tree of interest, this 
	//METHOD: this function will add value "addVal" to tree treeName
	//STEP: retrieve tree where node will be added
	var objTree=treeNode_searchForTree(treeName);

	//STEP: add the value to the tree treeName
	var formatNodeCouple=treeNode_formatNode(node1,node2,objTree.getAttribute("treeString"));
	//retrieve original tree string and append new node1:node2 relationship
	
	//STEP: if formatNodeCouple is not null (meaning that it was not found in "treeString"), then add to treeString
	if(formatNodeCouple)
	{
		var currTreeStr=objTree.getAttribute("treeString");
		var newTreeStr=currTreeStr+""+formatNodeCouple;
		
		//STEP: append new treeString to tree
		objTree.setAttribute("treeString",newTreeStr);
	}
}

//TREENODE FUNCTIONS: REMOVE NODES

//TREENODE FUNCTIONS: SEARCH
function treeNode_checkForNodePairs(nodeCouple,treeStr)
{
	//VARS: nodeCouple = string in the format "node1::node2;;", where this illustrates the relationship between node1 & node2; treeStr = the tree string that records all the relationships within a tree network
	//METHOD: this function will check if a relationship between 2 nodes already exists
	
	//STEP: format the nodeCouple to be able to be searched
	nodeCouple=g_delimRel+""+nodeCouple;
	var coupleFound=strTools_findMatch(nodeCouple,treeStr,"gi");		//findNC = find Node Couple 

	return coupleFound;
}

function treeNode_searchForTree(treeName)
{
	//METHOD: this function retrieves a hash by name "hashName"
	var e=document.getElementsByName("treeNetwork");
	var getTree=null;
	//for(i in e)
	for(var i=0;i<e.length;i++)
	{
		if(e[i].getAttribute("value")==treeName)
		{
			getTree=e[i];
			break;			
		}
	}
	return getTree;
}

function treeNode_getTreeString(treeName)
{
	//VARS: treeName = string that refers to the treeNetwork
	//METHOD: this function will retrieve the treeString associated with a tree

	//STEP: retrieve tree object
	var treeObj=treeNode_searchForTree(treeName);

	//STEP: get tree string
	return treeObj.getAttribute("treeString");
}

//TREENODE FUNCTIONS: DISPLAY TREE
function treeNode_RetrieveTreeStr(treeName)
{
	//METHOD: retrieve the treeString for a specific tree
	//STEP: retrieve tree where node will be added
	var objTree=treeNode_searchForTree(treeName);
	return objTree.getAttribute("treeString");
}

function treeNode_DisplayTree(treeName)
{
	//VARS: treeName = string that is the identifying name for a tree; 
	//METHOD: this function will display a tree with the name "treeName"
	//STEP: retrieve tree where node will be added
	var objTree=treeNode_searchForTree(treeName);

	//STEP: retrieve the string associated with the treeName
	var treeStr=objTree.getAttribute("treeString");
	var arrTreeStr=treeStr.split(g_delimRel);

	//STEP: create nodes & compile the connections
	var recordPTN="";			//recordPTN = record Potential Top Nodes
}

//NODE_MAP: DRAWING LINES THAT CONNECT NODES
function NodeMap_CreateLine(lineID,nodeAreaID)
{
	//create line
	var jQLineID="#"+lineID;
	var jQnodeAreaID="#"+nodeAreaID;
	var makeLine="<div id='"+lineID+"' class='objLine' name='lineConnect'></div>";
	//place line in page
	$(jQnodeAreaID).append(makeLine);
}

function NodeMap_LengthAndAngle(jQn1,jQn2)
{
	//VARS: jQn1= jQuery version of node 1 ID, jQn2 = same as jQn1 but for node 2 ID
	//NOTE: jQuery version of object ID = obj1 ID is "hey" & jQuery version is "#hey"
	//METHOD: this function calculates the length & angle of the line connecting 2 nodes depending on the position of the 2 nodes
	var posN1_left=parseFloat($(jQn1).css("left"))+parseFloat($(jQn1).outerWidth())/2;
	var posN1_top=parseFloat($(jQn1).css("top"))+parseFloat($(jQn1).outerHeight())/2;
	var posN2_left=parseFloat($(jQn2).css("left"))+parseFloat($(jQn2).outerWidth())/2;
	var posN2_top=parseFloat($(jQn2).css("top"))+parseFloat($(jQn2).outerHeight())/2;
	//draw a line between the position of both nodes
	var xSquared=(posN2_left-posN1_left)*(posN2_left-posN1_left);
	var ySquared=(posN2_top-posN1_top)*(posN2_top-posN1_top);
	var getLength=Math.sqrt(xSquared+ySquared);
	//determine angle
	//NOTE: the 180/Math.PI is to convert the angle from radians to degrees
	var getAngle=(180/Math.PI)*Math.acos((posN2_top-posN1_top)/getLength);	//establish the length & angle of the line
	if(posN2_left>posN1_left){getAngle*=-1;}

	return {getLength:getLength, getAngle:getAngle}
}

function NodeMap_DrawLine(n1,n2,nodeAreaID)		//n1 & n2 are the # of the node
{
	//METHOD: this function will draw a connecting line between 2 nodes, which signifies a connection between 2 words
	//get position of both nodes
	var n1_ID="node_"+n1;
	var n2_ID="node_"+n2;
	var jQn1="#"+n1_ID;
	var jQn2="#"+n2_ID;
	//calculate the connecting line length & angle
	var LaA=NodeMap_LengthAndAngle(jQn1,jQn2);
	//add line to field
	var lineID="line"+n1+"-"+n2;
	var jQLineID="#"+lineID;
	NodeMap_CreateLine(lineID,nodeAreaID);
	//draw line
	var getBGColor=$(jQn1).css("background-color");
	$(jQLineID).css("height",LaA.getLength+"px");
	$(jQLineID).css("background-color",getBGColor);
	//add attributes - the words this line is connecting
	$(jQLineID).attr("node1",n1_ID);
	$(jQLineID).attr("node2",n2_ID);
	//change top & left position
	var leftPos=parseFloat($(jQn1).css("left"))+parseFloat($(jQn1).outerWidth())/2;
	var topPos=parseFloat($(jQn1).css("top"))+parseFloat($(jQn1).outerHeight())/2;
	$(jQLineID).css("position","absolute");
	$(jQLineID).css("left",leftPos);
	$(jQLineID).css("top",topPos);
	$(jQLineID).css("opacity","1");
	$(jQLineID).css("z-index","4");
	//change line angle
	$(jQLineID).css("-webkit-transform","rotate("+LaA.getAngle+"deg)");
	$(jQLineID).css("-moz-transform","rotate("+LaA.getAngle+"deg)");
	$(jQLineID).css("-o-transform","rotate("+LaA.getAngle+"deg)");
	$(jQLineID).css("-ms-transform","rotate("+LaA.getAngle+"deg)");
	$(jQLineID).css("transform","rotate("+LaA.getAngle+"deg)");
}

function NodeMap_MakeLineConnections()
{
	//METHOD: this funciton will add the connecting lines to each node
	//generate connection database
	var connectDB=gCGenerateRandomConnects();
	browseAdj("testText").innerHTML=connectDB;
	var splitConnects=connectDB.split(";");
	//go through loop
	for(var x=0;x<splitConnects.length;x++)
	{
		var splitNodes=splitConnects[x].split(":");
		NodeMap_DrawConnections(splitNodes[0],splitNodes[1]);
	}
}

//TREENODE FUNCTIONS: SEARCH - these functions are used to search for treeNodes & values within tree nodes
//END
*/