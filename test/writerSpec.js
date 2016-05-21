'use strict'

const assert = require('chai').assert

const Writer = require('../src/lib/writer')

describe('Writer', function () {
  beforeEach(function () {
    this.writer = new Writer()
  })

  describe('writeUInt', function () {
    it('should write a one-byte integer', function () {
      this.writer.writeUInt(10, 1)

      assert.equal(this.writer.getBuffer().toString('hex'), '0a')
    })

    it('should write a two-byte integer', function () {
      this.writer.writeUInt(65535, 2)

      assert.equal(this.writer.getBuffer().toString('hex'), 'ffff')
    })

    it('should throw when trying to write a number that is not an integer', function () {
      assert.throws(() => this.writer.writeUInt(2.5, 4), 'UInt must be an integer')
    })

    it('should throw when trying to write a negative number', function () {
      assert.throws(() => this.writer.writeUInt(-2, 4), 'UInt must be positive')
    })

    it('should throw when trying to write an integer that is too large', function () {
      assert.throws(() => this.writer.writeUInt(65536, 2),
        'UInt 65536 does not fit in 2 bytes')
    })
  })

  describe('writeVarUInt', function () {
    it('should write a zero', function () {
      this.writer.writeVarUInt(0, 1)

      assert.equal(this.writer.getBuffer().toString('hex'), '0100')
    })

    it('should write a one-byte integer', function () {
      this.writer.writeVarUInt(10)

      assert.equal(this.writer.getBuffer().toString('hex'), '010a')
    })

    it('should write a one-byte integer (> 127)', function () {
      this.writer.writeVarUInt(129)

      assert.equal(this.writer.getBuffer().toString('hex'), '0181')
    })

    it('should write a two-byte integer', function () {
      this.writer.writeVarUInt(65535)

      assert.equal(this.writer.getBuffer().toString('hex'), '02ffff')
    })

    it('should write a large integer from a buffer', function () {
      this.writer.writeVarUInt(new Buffer('ffff0000ffff0000ffff0000', 'hex'))

      assert.equal(this.writer.getBuffer().toString('hex'), '0cffff0000ffff0000ffff0000')
    })

    it('should throw when trying to write a number that is not an integer', function () {
      assert.throws(() => this.writer.writeVarUInt(2.5), 'UInt must be an integer')
    })

    it('should throw when trying to write a negative number', function () {
      assert.throws(() => this.writer.writeVarUInt(-2), 'UInt must be positive')
    })
  })

  describe('writeOctetString', function () {
    it('should write a buffer', function () {
      this.writer.writeOctetString(new Buffer('010203', 'hex'), 3)

      assert.equal(this.writer.getBuffer().toString('hex'), '010203')
    })

    it('should throw when the buffer length does not match', function () {
      assert.throws(() => this.writer.writeOctetString(new Buffer('010203', 'hex'), 4),
        'Incorrect length for octet string')
    })
  })

  describe('writeVarOctetString', function () {
    it('should write a small buffer', function () {
      this.writer.writeVarOctetString(new Buffer(5).fill(0xf0))

      assert.equal(this.writer.getBuffer().toString('hex'), '05f0f0f0f0f0')
    })

    it('should write a large buffer', function () {
      this.writer.writeVarOctetString(new Buffer(128).fill(0xf0))

      assert.equal(this.writer.getBuffer().toString('hex'), '8180f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0')
    })
  })
})
