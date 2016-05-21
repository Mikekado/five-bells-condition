'use strict'

const assert = require('chai').assert

const Predictor = require('../src/lib/predictor')

describe('Predictor', function () {
  beforeEach(function () {
    this.predictor = new Predictor()
  })

  describe('writeUInt', function () {
    it('should write a one-byte integer', function () {
      this.predictor.writeUInt(10, 1)

      assert.equal(this.predictor.getSize(), 1)
    })

    it('should write a two-byte integer', function () {
      this.predictor.writeUInt(65535, 2)

      assert.equal(this.predictor.getSize(), 2)
    })
  })

  describe('writeVarUInt', function () {
    it('should write a zero', function () {
      this.predictor.writeVarUInt(0, 1)

      assert.equal(this.predictor.getSize(), 2)
    })

    it('should write a one-byte integer', function () {
      this.predictor.writeVarUInt(10)

      assert.equal(this.predictor.getSize(), 2)
    })

    it('should write a one-byte integer (> 127)', function () {
      this.predictor.writeVarUInt(129)

      assert.equal(this.predictor.getSize(), 2)
    })

    it('should write a two-byte integer', function () {
      this.predictor.writeVarUInt(65535)

      assert.equal(this.predictor.getSize(), 3)
    })

    it('should write a large integer from a buffer', function () {
      this.predictor.writeVarUInt(new Buffer('ffff0000ffff0000ffff0000', 'hex'))

      assert.equal(this.predictor.getSize(), 13)
    })

    it('should throw when trying to write a number that is not an integer', function () {
      assert.throws(() => this.predictor.writeVarUInt(2.5), 'UInt must be an integer')
    })

    it('should throw when trying to write a negative number', function () {
      assert.throws(() => this.predictor.writeVarUInt(-2), 'UInt must be positive')
    })
  })

  describe('writeOctetString', function () {
    it('should write a buffer', function () {
      this.predictor.writeOctetString(new Buffer('010203', 'hex'), 3)

      assert.equal(this.predictor.getSize(), 3)
    })
  })

  describe('writeVarOctetString', function () {
    it('should write a small buffer', function () {
      this.predictor.writeVarOctetString(new Buffer(5).fill(0xf0))

      assert.equal(this.predictor.getSize(), 6)
    })

    it('should write a large buffer', function () {
      this.predictor.writeVarOctetString(new Buffer(128).fill(0xf0))

      assert.equal(this.predictor.getSize(), 130)
    })
  })
})
