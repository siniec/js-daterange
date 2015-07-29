function DateRange(start, end_or_n, unit) {
	this._start = new Date(start.getTime());

	var isNPlusUnit = typeof end_or_n === 'number' && typeof unit === 'string';
	if (isNPlusUnit) {
		unit = this._unit(unit);
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

DateRange.prototype._unit = function(unit) {
	return unit === 'day' ? 'date' : unit;
};

DateRange.prototype.start = function() {
	return this._start;
};

DateRange.prototype.end = function() {
	return this._end;
};

DateRange.prototype.count = function(unit) {
	var denominators = {
		millisecond: 1,
		second: 1000,
		minute: 1000 * 60,
		hour: 1000 * 60 * 60,
		date: 1000 * 60 * 60 * 24
	};
	var denominator = denominators[this._unit(unit)];
	if (!denominator) {
		throw new Error('Unsupported unit: "' + unit + '"');
	}
	return (this._end - this._start) / denominator;
};