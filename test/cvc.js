'use strict';

var cvc    = require('../src/cvc');
var expect = require('chai').expect;

describe('cvc', function () {

  describe('#isValid', function () {

    it('is true for a 3-4 char numeric string with no type', function () {
      expect(cvc.isValid('123')).to.be.true;
      expect(cvc.isValid('1234')).to.be.true;
      expect(cvc.isValid('12')).to.be.false;
      expect(cvc.isValid('12345')).to.be.false;
    });

    it('matches the cvc length against a provided type', function () {
      expect(cvc.isValid('123', 'visa')).to.be.true;
      expect(cvc.isValid('1234', 'visa')).to.be.false;
      expect(cvc.isValid('123', 'americanExpress')).to.be.false;
      expect(cvc.isValid('1234', 'americanExpress')).to.be.true;
    });

    it('can use the proper name for type', function () {
      expect(cvc.isValid('123', 'Visa')).to.be.true;
      expect(cvc.isValid('1234', 'American Express')).to.be.true;
    });

    it('is false for a non-string', function () {
      expect(cvc.isValid(123)).to.be.false;
    });

  });

});
