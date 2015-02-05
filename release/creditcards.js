(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sentence = require('sentence-case');

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return sentence(string)
    // Replace periods between numeric entities with an underscore.
    .replace(/\./g, '_')
    // Replace spaces between words with a string upper cased character.
    .replace(/ (\w)/g, function (_, $1) {
      return $1.toUpperCase();
    });
};

},{"sentence-case":2}],2:[function(require,module,exports){
/**
 * Sentence case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return String(string)
    // Add camel case support.
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    // Remove every non-word character and replace with a period.
    .replace(/[^a-zA-Z0-9]+/g, '.')
    // Replace every period not between two numbers with a space.
    .replace(/(?!\d\.\d)(^|.)\./g, '$1 ')
    // Trim whitespace from the string.
    .replace(/^ | $/g, '')
    // Finally lower case the entire string.
    .toLowerCase();
};

},{}],3:[function(require,module,exports){
'use strict';

var camel = require('camel-case');

exports.types = {
  visa: {
    name: 'Visa',
    pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
    quickPattern: /^4/,
    format: /(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})$/,
    length: 16,
    cvcLength: 3
  },
  masterCard: {
    name: 'MasterCard',
    pattern: /^5[1-5][0-9]{14}$/,
    quickPattern: /^5/,
    format: /(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})$/,
    length: 16,
    cvcLength: 3
  },
  americanExpress: {
    name: 'American Express',
    pattern: /^3[47][0-9]{13}$/,
    quickPattern: /^3[47]/,
    format: /^(\d{4})(\d{0,6})(\d{0,5})$/,
    length: 15,
    cvcLength: 4
  },
  dinersClub: {
    name: 'Diners Club',
    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    quickPattern: /^3(?:0[0-5]|[68][0-9])/,
    format: /\d{14}/,
    length: 14,
    cvcLength: 3
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    quickPattern: /^6/,
    format: /(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})$/,
    length: 16,
    cvcLength: 3
  },
  jcb: {
    name: 'JCB',
    pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
    quickPattern: /^(?:2131|1800|35\d{3})/,
    format: /(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})$/,
    length: 16,
    cvcLength: 3
  }
};

exports.parse = function (number) {
  if (typeof number !== 'string') return '';
  return number.replace(/[^\d]/g, '');
};

exports.formattedParse = function(number) {
  var parsed = exports.parse(number);

  for (var typeName in exports.types) {
    var type = exports.types[typeName];
    if(type.quickPattern.test(parsed)) {
      parsed = parsed.substring(0, type.length);

      var formatNumber = function (match/*, args */) {
        var splatArgs = Array.prototype.slice.call(arguments, formatNumber.length);
        var matches = splatArgs.slice(0, splatArgs.length - 2);
        return matches.filter(Boolean).join(' ');
      };

      return parsed.replace(type.format, formatNumber);
    }
  }

  return parsed;
};

exports.type = function (number) {
  for (var typeName in exports.types) {
    var type = exports.types[typeName];
    if (type.quickPattern.test(number)) return exports.types[typeName].name;
  }
};

exports.luhn = function (number) {
  if (!number) return false;
  // https://gist.github.com/ShirtlessKirk/2134376
  var len = number.length;
  var mul = 0;
  var prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
  var sum = 0;

  while (len--) {
    sum += prodArr[mul][parseInt(number.charAt(len), 10)];
    mul ^= 1;
  }

  return sum % 10 === 0 && sum > 0;
};

exports.isValid = function (number, type) {
  if (!type) {
    type = exports.type(number);
    return exports.luhn(number) && !!type && exports.types[camel(type)].length == number.length;
  }
  return exports.luhn(number) && exports.types[camel(type)].pattern.test(number);
};

},{"camel-case":1}],4:[function(require,module,exports){
'use strict';

var camel = require('camel-case');
var card  = require('./card');

var cvcRegex = /^\d{3,4}$/;

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false;
  if (!cvcRegex.test(cvc)) return false;
  if (!type) return true;
  return card.types[camel(type)].cvcLength === cvc.length;
};

},{"./card":3,"camel-case":1}],5:[function(require,module,exports){
'use strict';

exports.isPast = function (month, year) {
  return Date.now() >= new Date(year, month);
};

exports.month = {
  parse: function (month) {
    return ~~month || void 0;
  },
  isValid: function (month) {
    if (typeof month !== 'number') return false;
    return month >= 1 && month <= 12;
  }
};

var base = new Date().getFullYear().toString().substr(0, 2);

function twoDigit (number) {
  return number >= 10 ? number : '0' + number;
}

exports.year = {
  parse: function (year, pad) {
    year = ~~year;
    if (!pad) return year || void 0;
    return ~~(base + twoDigit(year));
  },
  format: function (year, strip) {
    year = year.toString();
    return strip ? year.substr(2, 4) : year;
  },
  isValid: function (year) {
    if (typeof year !== 'number') return false;
    return year > 0;
  },
  isPast: function (year) {
    return new Date().getFullYear() > year;
  }
};

},{}],6:[function(require,module,exports){
'use strict';

var card = exports.card = require('./card');
var cvc = exports.cvc = require('./cvc');
var expiration = exports.expiration = require('./expiration');

exports.validate = function (cardObj) {
  return {
    card: {
      type: card.type(cardObj.number),
      number: cardObj.number,
      expirationMonth: cardObj.expirationMonth,
      expirationYear: cardObj.expirationYear,
      cvc: cardObj.cvc
    },
    validCardNumber: card.luhn(cardObj.number),
    validExpirationMonth: expiration.month.isValid(cardObj.expirationMonth),
    validExpirationYear: expiration.year.isValid(cardObj.expirationYear),
    validCvc: cvc.isValid(cardObj.cvc),
    expired: expiration.isPast(cardObj.expirationMonth, cardObj.expirationYear)
  };
};

},{"./card":3,"./cvc":4,"./expiration":5}]},{},[6]);
