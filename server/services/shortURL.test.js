const {encode, decode} = require('./shortURL')

test('Positive test', () => {
    expect(encode(1)).toBe('2')
})

test('decode encode', () => {
    expect(decode(encode(60))).toBe(60)
})

test('encode 2d', () => {
    expect(encode(60)).toBe('2d')
})

test('decode 2d', () => {
    expect(decode('2d')).toBe(60)
})

test('decode encode 2', () => {
    expect(decode(encode(1088))).toBe(1088)
})

test('empty string', () => {
    expect(decode(encode(0))).toBe(0)
})