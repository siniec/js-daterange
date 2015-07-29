function Range(start, end_or_n, unit) {
	this._start = new Date(start.getTime());

	var isNPlusUnit = typeof end_or_n === 'number' && typeof unit === 'string';
	if (isNPlusUnit) {
		if (unit === 'day') {
			unit = 'date';
		}
		var units = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'];
		var i = units.indexOf(unit);
		if (i === -1) { throw new Error('Unsupported unit: "' + unit + '"'); }
		var method;
		if (unit === 'year') {
			method = 'FullYear';
		} else if (unit === 'date' || unit === 'month') {
			method = unit.charAt(0).toUpperCase() + unit.slice(1);
		} else {
			method = unit.charAt(0).toUpperCase() + unit.slice(1) + 's';
		}
		var getter = 'get' + method;
		var setter = 'set' + method;
		this._end = new Date(start);
		this._end[setter](this._end[getter]() + end_or_n);
	} else {
		this._end = new Date(end_or_n.getTime());
	}
}

Range.prototype.start = function() {
	return this._start;
};

Range.prototype.end = function() {
	return this._end;
};