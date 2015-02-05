'use strict';

var camel = require('camel-case');

exports.types = {
  visa: {
    name: 'Visa',
    pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
    quickPattern: /^4/,
    length: 16,
    cvcLength: 3
  },
  masterCard: {
    name: 'MasterCard',
    pattern: /^5[1-5][0-9]{14}$/,
    quickPattern: /^5/,
    length: 16,
    cvcLength: 3
  },
  americanExpress: {
    name: 'American Express',
    pattern: /^3[47][0-9]{13}$/,
    quickPattern: /^3[47]/,
    length: 15,
    cvcLength: 4
  },
  dinersClub: {
    name: 'Diners Club',
    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    quickPattern: /^3(?:0[0-5]|[68][0-9])/,
    length: 14,
    cvcLength: 3
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    quickPattern: /^6/,
    length: 16,
    cvcLength: 3
  },
  jcb: {
    name: 'JCB',
    pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
    quickPattern: /^(?:2131|1800|35\d{3})/,
    length: 16,
    cvcLength: 3
  }
};

exports.parse = function (number) {
  if (typeof number !== 'string') return '';
  return number.replace(/[^\d]/g, '');
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
