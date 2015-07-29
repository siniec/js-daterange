function DateRange(start, end_or_n, unit) {
	this._start = new Date(start.getTime());

	var isNPlusUnit = typeof end_or_n === 'number' && typeof unit === 'string';
	if (isNPlusUnit) {
		this._end = this._add(new Date(start.getTime()), end_or_n, unit);
	} else {
		this._end = new Date(end_or_n.getTime());
	}
}

DateRange.prototype._add = function(date, n, unit) {
	unit = this._unit(unit, true);
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
	date = new Date(date.getTime());
	date[setter](date[getter]() + n);
	return date;
};

DateRange.prototype._unit = function(unit, doThrow) {
	var i = ['year', 'month', 'day', 'date', 'hour', 'minute', 'second', 'millisecond'].indexOf(unit);
	if (i === -1) {
		if (doThrow) {
			throw new Error('Unsupported unit: "' + unit + '"');
		} else {
			return undefined;
		}
	}
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

DateRange.prototype.forEach = function(unit, fn) {
	unit = this._unit(unit, true);
	var curr = new Date(this._start.getTime());
	var i = 0;
	while (curr < this._end) {
		fn(new Date(curr.getTime()), i);
		curr = this._add(curr, 1, unit);
		i++;
	}
	return this;
};

DateRange.prototype.map = function(unit, fn) {
	var result = [];
	this.forEach(unit, function(date, index) {
		result.push(fn(date, index));
	});
	return result;
};

DateRange.prototype.toArray = function(unit) {
	return this.map(unit, function(date) { return date; });
};