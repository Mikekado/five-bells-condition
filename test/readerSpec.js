'use strict'

const assert = require('chai').assert

const Reader = require('../src/lib/reader')

describe('Reader', function () {
  beforeEach(function () {
    this.reader = new Reader(new Buffer(
      '000102030405060708090a0b0c0d0e0fa0a1a2a3a4a5a6a7a8a9a0aaabacadaeaf',
      'hex'
    ))
  })

  describe('from', function () {
    it('should instantiate a Reader', function () {
      const reader = Reader.from(new Buffer(4))

      assert.instanceOf(reader, Reader)
    })

    it('should return Reader if one is passed in', function () {
      const reader = new Reader(new Buffer(4))

      const reader2 = Reader.from(reader)

      assert.equal(reader2, reader)
    })

    it('should throw if argument is a string', function () {
      assert.throws(() => Reader.from('test'), 'Reader must be given a Buffer')
    })
  })

  describe('bookmark/restore', function () {
    it('should store and return to a given position', function () {
      const reader = new Reader(new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

      reader.skip(2)

      assert.equal(reader.cursor, 2)

      reader.bookmark()

      reader.read(4)
      assert.equal(reader.cursor, 6)

      reader.restore()

      assert.equal(reader.cursor, 2)
    })
  })

  describe('readUInt', function () {
    beforeEach(function () {
      this.reader = new Reader(new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    })

    it('should read a zero-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(0)

      assert.equal(result, 0)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a one-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(1)

      assert.equal(result, 2)
      assert.equal(this.reader.cursor, 3)
    })

    it('should read a two-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(2)

      assert.equal(result, 515)
      assert.equal(this.reader.cursor, 4)
    })

    it('should read a three-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(3)

      assert.equal(result, 131844)
      assert.equal(this.reader.cursor, 5)
    })

    it('should read a four-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(4)

      assert.equal(result, 33752069)
      assert.equal(this.reader.cursor, 6)
    })

    it('should read a five-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(5)

      assert.equal(result, 8640529670)
      assert.equal(this.reader.cursor, 7)
    })

    it('should read a six-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.readUInt(6)

      assert.equal(result, 2211975595527)
      assert.equal(this.reader.cursor, 8)
    })

    it('should throw when asked to read a seven-byte integer', function () {
      this.reader.skip(2)
      assert.throws(() => this.reader.readUInt(7), 'Tried to read too large integer')
    })
  })

  describe('peekUInt', function () {
    it('should read a zero-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(0)

      assert.equal(result, 0)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a one-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(1)

      assert.equal(result, 2)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a two-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(2)

      assert.equal(result, 515)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a three-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(3)

      assert.equal(result, 131844)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a four-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(4)

      assert.equal(result, 33752069)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a five-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(5)

      assert.equal(result, 8640529670)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a six-byte integer', function () {
      this.reader.skip(2)
      const result = this.reader.peekUInt(6)

      assert.equal(result, 2211975595527)
      assert.equal(this.reader.cursor, 2)
    })

    it('should throw when asked to read a seven-byte integer', function () {
      this.reader.skip(2)
      assert.throws(() => this.reader.peekUInt(7), 'Tried to read too large integer')
    })
  })

  describe('skipUInt', function () {
    it('should skip the provided number of bytes', function () {
      this.reader.skip(2)

      assert.equal(this.reader.cursor, 2)

      this.reader.skipUInt(3)

      assert.equal(this.reader.cursor, 5)
    })
  })

  describe('readVarUInt', function () {
    it('should read a zero-length varint', function () {
      const result = this.reader.readVarUInt()

      assert.equal(result, 0)
      assert.equal(this.reader.cursor, 1)
    })

    it('should read a one-byte varint', function () {
      this.reader.skip(1)
      const result = this.reader.readVarUInt()

      assert.equal(result, 2)
      assert.equal(this.reader.cursor, 3)
    })

    it('should read a two-byte varint', function () {
      this.reader.skip(2)
      const result = this.reader.readVarUInt()

      assert.equal(result, 772)
      assert.equal(this.reader.cursor, 5)
    })

    it('should read a three-byte varint', function () {
      this.reader.skip(3)
      const result = this.reader.readVarUInt()

      assert.equal(result, 263430)
      assert.equal(this.reader.cursor, 7)
    })

    it('should read a four-byte varint', function () {
      this.reader.skip(4)
      const result = this.reader.readVarUInt()

      assert.equal(result, 84281096)
      assert.equal(this.reader.cursor, 9)
    })

    it('should read a five-byte varint', function () {
      this.reader.skip(5)
      const result = this.reader.readVarUInt()

      assert.equal(result, 25887770890)
      assert.equal(this.reader.cursor, 11)
    })

    it('should read a six-byte varint', function () {
      this.reader.skip(6)
      const result = this.reader.readVarUInt()

      assert.equal(result, 7731092785932)
      assert.equal(this.reader.cursor, 13)
    })

    it('should throw when trying to read a seven-byte varint', function () {
      this.reader.skip(7)
      assert.throws(() => this.reader.readVarUInt(), 'too large to parse as integer')
    })
  })

  describe('peekVarUInt', function () {
    it('should read a zero-length varint', function () {
      const result = this.reader.peekVarUInt()

      assert.equal(result, 0)
      assert.equal(this.reader.cursor, 0)
    })

    it('should read a one-byte varint', function () {
      this.reader.skip(1)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 2)
      assert.equal(this.reader.cursor, 1)
    })

    it('should read a two-byte varint', function () {
      this.reader.skip(2)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 772)
      assert.equal(this.reader.cursor, 2)
    })

    it('should read a three-byte varint', function () {
      this.reader.skip(3)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 263430)
      assert.equal(this.reader.cursor, 3)
    })

    it('should read a four-byte varint', function () {
      this.reader.skip(4)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 84281096)
      assert.equal(this.reader.cursor, 4)
    })

    it('should read a five-byte varint', function () {
      this.reader.skip(5)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 25887770890)
      assert.equal(this.reader.cursor, 5)
    })

    it('should read a six-byte varint', function () {
      this.reader.skip(6)
      const result = this.reader.peekVarUInt()

      assert.equal(result, 7731092785932)
      assert.equal(this.reader.cursor, 6)
    })

    it('should throw when trying to read a seven-byte varint', function () {
      this.reader.skip(7)
      assert.throws(() => this.reader.peekVarUInt(), 'too large to parse as integer')
      assert.equal(this.reader.cursor, 7)
    })
  })

  describe('skipVarUInt', function () {
    it('should skip a zero-length varint', function () {
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 1)
    })

    it('should skip a one-byte varint', function () {
      this.reader.skip(1)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 3)
    })

    it('should skip a two-byte varint', function () {
      this.reader.skip(2)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 5)
    })

    it('should skip a three-byte varint', function () {
      this.reader.skip(3)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 7)
    })

    it('should skip a four-byte varint', function () {
      this.reader.skip(4)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 9)
    })

    it('should skip a five-byte varint', function () {
      this.reader.skip(5)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 11)
    })

    it('should skip a six-byte varint', function () {
      this.reader.skip(6)
      this.reader.skipVarUInt()

      assert.equal(this.reader.cursor, 13)
    })
  })

  describe('readOctetString', function () {
    it('should return a buffer', function () {
      this.reader.skip(2)
      const result = this.reader.readOctetString(4)

      assert.equal(result.toString('hex'), '02030405')
      assert.equal(this.reader.cursor, 6)
    })

    it('should return a buffer when reading to the end of the source', function () {
      this.reader.skip(2)
      const result = this.reader.readOctetString(31)

      assert.equal(result.toString('hex'),
        '02030405060708090a0b0c0d0e0fa0a1a2a3a4a5a6a7a8a9a0aaabacadaeaf')
      assert.equal(this.reader.cursor, 33)
    })

    it('should throw when reading past the end of the buffer', function () {
      this.reader.skip(2)
      assert.throws(() => this.reader.readOctetString(32),
        'Tried to read 32 bytes, but only 31 bytes available')
      assert.equal(this.reader.cursor, 2)
    })
  })

  describe('peekOctetString', function () {
    it('should return a buffer', function () {
      this.reader.skip(2)
      const result = this.reader.peekOctetString(4)

      assert.equal(result.toString('hex'), '02030405')
      assert.equal(this.reader.cursor, 2)
    })

    it('should return a buffer when reading to the end of the source', function () {
      this.reader.skip(2)
      const result = this.reader.peekOctetString(31)

      assert.equal(result.toString('hex'),
        '02030405060708090a0b0c0d0e0fa0a1a2a3a4a5a6a7a8a9a0aaabacadaeaf')
      assert.equal(this.reader.cursor, 2)
    })

    it('should throw when reading past the end of the buffer', function () {
      this.reader.skip(2)
      assert.throws(() => this.reader.peekOctetString(32),
        'Tried to read 32 bytes, but only 31 bytes available')
      assert.equal(this.reader.cursor, 2)
    })
  })

  describe('skipOctetString', function () {
    it('should skip as many bytes', function () {
      this.reader.skip(2)
      this.reader.skipOctetString(4)

      assert.equal(this.reader.cursor, 6)
    })

    it('should skip as many bytes when reading to the end of the source', function () {
      this.reader.skip(2)
      this.reader.skipOctetString(31)

      assert.equal(this.reader.cursor, 33)
    })

    it('should throw when skipping past the end of the buffer', function () {
      this.reader.skip(2)
      assert.throws(() => this.reader.skipOctetString(32),
        'Tried to read 32 bytes, but only 31 bytes available')
      assert.equal(this.reader.cursor, 2)
    })
  })
})
