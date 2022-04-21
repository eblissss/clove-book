/*
Description: Convert a decimal number into a fraction
Author: Michaël Niessen (© 2018)
Website: http://AssemblySys.com

If you find this script useful, you can show your
appreciation by getting Michaël a cup of coffee ;)
https://ko-fi.com/assemblysys

As long as this notice (including author name and details) is included and
UNALTERED, this code can be used and distributed freely.
*/

export function decimalToFraction(value: number, donly = true) {
	var tolerance = 1.0e-6; // from how many decimals the number is rounded
	var h1 = 1;
	var h2 = 0;
	var k1 = 0;
	var k2 = 1;
	var negative = false;
	var i;

	if (Math.floor(value) === value) {
		// if value is an integer, stop the script
		return value;
	} else if (value < 0) {
		negative = true;
		value = -value;
	}

	if (donly) {
		i = Math.floor(value);
		value -= i;
	}

	var b = value;

	do {
		var a = Math.floor(b);
		console.log(a);
		var aux = h1;
		h1 = a * h1 + h2;
		h2 = aux;
		aux = k1;
		k1 = a * k1 + k2;
		k2 = aux;
		b = 1 / (b - a);
	} while (Math.abs(value - h1 / k1) > value * tolerance);

	return (
		(negative ? "-" : "") +
		(donly && i != 0 ? i + " " : "") +
		(h1 == 0 ? "" : h1 + "/" + k1)
	);
}
