class ShortURL {

    constructor() {
        this._alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
        this._base = this._alphabet.length;
    }
    

	encode = (num) => {
		let str = '';
		while (num > 0) {
			str = this._alphabet.charAt(num % this._base - 1) + str;
			num = Math.floor(num / this._base);
		}
		return str;
	};

	decode = str => {
		let num = 0;
		for (let i = 0; i < str.length; i++) {
			num = num * this._base + this._alphabet.indexOf(str.charAt(i)) + 1;
		}
		return num;
	};

	encodeWithCheckSum = num => {
		return this.encode(num) + this.encode((num ** 2) % (this._base ** 2))
	}
}

module.exports = new ShortURL()