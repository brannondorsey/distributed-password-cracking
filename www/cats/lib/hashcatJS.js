var rulesList = {
	":": function(rules, password){
		return [rules.slice(1), password]
	},
	"l": function(rules, password){
		return [rules.slice(1), password.toLowerCase()]
	},
       	"u": function(rules, password){
		return [rules.slice(1), password.toUpperCase()]
	},
       	"c": function(rules, password){
		return [rules.slice(1), password[0,1].toUpperCase() + password.slice(1).toLowerCase()]
	},
       	"C": function(rules, password){
		return [rules.slice(1), password[0,1].toLowerCase() + password.slice(1).toUpperCase()]
	},
       	"t": function(rules, password){
		var str = password;
		var s = '';
		for (var i=0; i<str.length; i++) {
			var n = str.charAt(i);
			s +=  (n == n.toUpperCase() ? n.toLowerCase() : n.toUpperCase());
		}
		return [rules.slice(1), s]
	},
       	"T": function(rules, password){
		var position = +rules[1];
		if(isNaN(position)){
			position = 76 - rules.charCodeAt(1);
		}
		var n = password.charAt(position);
		var retPassword = password.slice(0,position) + (n == n.toUpperCase() ? n.toLowerCase() : n.toUpperCase()) + password.slice(position + 1);
		var retRules = rules.slice(2);	
		return [retRules, retPassword]
	},
       	"r": function(rules, password){
		return [rules.slice(1), password.split('').reverse().join('')]
	},
       	"d": function(rules, password){
		return [rules.slice(1), password + password]
	},
       	"p": function(rules, password){
		var repeatNums = +rules[1];
		if(isNaN(repeatNums)){
			repeatNums = 76 - rules.charCodeAt(1);
		}		
		var retPassword = '';
		for (var i = i; i < Number(repeatNums); i++){
			retPassword += password
		}
		var retRules = rules.slice(2);
		return [retRules, retPassword]
	},
       	"f": function(rules, password){
		return [rules.slice(1), password + password.split('').reverse().join('')]
	},
       	"{": function(rules, password){
		return [rules.slice(1), password.slice(1) + password[0]]
	},
       	"}": function(rules, password){
		return [rules.slice(1), password.slice(-1) + password.slice(0, password.length - 1)]
	},
       	"$": function(rules, password){
		return [rules.slice(2), password + rules[1]]
	},
       	"^": function(rules, password){	
		return [rules.slice(2), rules[1] + password]
	},
       	"[": function(rules, password){
		return [rules.slice(1), password.slice(1)]
	},
       	"]": function(rules, password){
		return [rules.slice(1), password.slice(0, -1)]
	},
       	"D": function(rules, password){
		var position = +rules[1];
		if(isNaN(position)){
			position = 76 - rules.charCodeAt(1);
		}		
		var retPassword = password.slice(0, position) + password.slice(position + 1);
		var retRules = rules.slice(2);
		return [retRules, retPassword]
	},
       	"x": function(rules, password){
		var mChars = +rules[2];
		if(isNaN(mChars)){
			mChars = 76 - rules.charCodeAt(2);
		}		
		var nStart = +rules[1];
		if(isNaN(nStart)){
			nStart = 76 - rules.charCodeAt(1);
		}	
		return [rules.slice(3), password.slice(nStart, mChars)]
	},
       	"O": function(rules, password){
		var mChars = +rules[2];
		if(isNaN(mChars)){
			mChars = 76 - rules.charCodeAt(2);
		}		
		var nStart = +rules[1];
		if(isNaN(nStart)){
			nStart = 76 - rules.charCodeAt(1);
		}	
		return [rules.slice(3), str.substr(0,nStart) + str.substr(nStart + mChars)]
	},
       	"i": function(rules, password){
		var Xchar = rules[2];
		var Npos = +rules[1];
		if(isNaN(Npos)){
			Npos = 76 - rules.charCodeAt(1);
		}	
		return [rules.slice(3), str.substr(0,nPos) + Xchar + str.substr(nStart + mChars)]
	},
       	"'": function(rules, password){
		var Npos = +rules[1];
		if(isNaN(Npos)){
			Npos = 76 - rules.charCodeAt(1);
		}	
		return [rules.slice(2), str.substr(0,nPos)]
	},
       	"s": function(rules, password){
		var x = rules[1];
		var y = rules[2];
		return [rules.slice(3), password.split(x).join(y)]
	},
       	"@": function(rules, password){
		var x = rules[1];
		return [rules.slice(2), password.split(x).join('')]	
	},
       	"z": function(rules, password){
		var nTimes = +rules[1];
		if(isNaN(nTimes)){
			nTimes = 76 - rules.charCodeAt(1);
		}		
		return [rules.slice(2), password[0].repeate(nTimes) + password.slice(1)]
	},
       	"Z": function(rules, password){
		var nTimes = +rules[1];
		if(isNaN(nTimes)){
			nTimes = 76 - rules.charCodeAt(1);
		}		
		return [rules.slice(2), password.slice(0, -1) + password[-1].repeate(nTimes)]
	},
       	"q": function(rules, password){
		var retPassword = ''
		for (var i = 0, len = password.length; i < len; i++) {
			  retPassword += password[i].repeat(2);
		}
		return [rules.slice(1), retPassword]
	}
}

var parseRuleSet = function(ruleSet){
	ruleSet = ruleSet.split(" ").join('');
	ruleArray = ruleSet.split('\n');
	return ruleArray
}

var runRules = function(ruleSet, password, checkPassword){
	var ruleArray = parseRuleSet(ruleSet);
	for (var i = 0; i < ruleArray.length; i++) {
		var currentRules = ruleArray[i];
		var currentPass = password
		while(currentRules.length != 0){
			var rulesAndPw = rulesList[currentRules[0]](currentRules, currentPass);
			currentPass = rulesAndPw[1];
			if(checkPassword == currentPass){
				return true
			}
			currentRules = rulesAndPw[0];
		}
	}
	return false
}

var checkThisPassword = function(password, howMany){
       	howMany = typeof howMany !== 'undefined' ? howMany : passwords.length;
	if(howMany > passwords.length) {
		throw "count too high, max val for this dic is " + str(passwords.length)
	}
	for (var i = 0; i < howMany; i++){
		var pwFound = runRules(ruleSet, passwords[i], password);
		if(pwFound){
			return true
		}
	}
	return false
}