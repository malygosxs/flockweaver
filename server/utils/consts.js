const VERSION = '02'
const VERSION_LEN = 2
const SW_PREFIX = 'SWx'
const SW_PREFIX_LEN = 3
const CLASS_LEN = 3
const SW_DECK_SIZE = 30

const a = new Uint32Array([0x12345678])
const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
const isBigEndian = b[0] == 0x12

module.exports = {
    VERSION, VERSION_LEN, SW_PREFIX, SW_PREFIX_LEN, CLASS_LEN, isBigEndian, SW_DECK_SIZE
}