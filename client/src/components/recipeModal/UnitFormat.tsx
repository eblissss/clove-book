const gcd = function (a: number, b: number): number {
	return b ? gcd(b, a % b) : a;
};

export const decimalToFraction = function (_decimal: number) {
	if (_decimal == Math.floor(_decimal)) {
		return {
			display: _decimal,
		};
	} else {
		var top = _decimal.toString().includes(".")
			? _decimal.toString().replace(/\d+[.]/, "")
			: "0";
		var bottom = Math.pow(10, top.replace("-", "").length);
		if (_decimal >= 1) {
			top = (+top + Math.floor(_decimal) * bottom).toString();
		} else if (_decimal <= -1) {
			top = (+top + Math.ceil(_decimal) * bottom).toString();
		}

		var x = Math.abs(gcd(parseInt(top), bottom));
		return {
			top: parseInt(top) / x,
			bottom: bottom / x,
			display: x / x + "/" + bottom / x,
		};
	}
};
