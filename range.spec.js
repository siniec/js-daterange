describe('DateRange', function() {

	describe('constructor:', function() {

		describe('when using start + end date paramters', function() {
			var start = new Date(2015, 0, 1);
			var end = new Date(2015, 1, 1);
			var range = new DateRange(start, end);

			it('copies the value of start', function() {
				expect(range.start()).toEqual(start);
				expect(range.start()).not.toBe(start);
			});

			it('copies the value of end', function() {
				expect(range.end()).toEqual(end);
				expect(range.end()).not.toBe(end);
			});

		});

		describe('when using start and end+unit parameters', function() {
			var start = new Date(2015, 0, 1);

			it('copies the value of start', function() {
				var start = new Date(2015, 0, 1);
				var range = new DateRange(start, 1, 'day');
				expect(range.start()).toEqual(start);
				expect(range.start()).not.toBe(start);
			})

			describe('when unit is not supported', function() {
				it('throws an exception', function() {
					expect(function() { new DateRange(start, 15, 'wasd') }).toThrow(new Error('Unsupported unit: "wasd"'));
				});
			});

			var n = 15;
			var spec = [
				{ unit: 'millisecond', want: new Date(2015, 0, 1, 0, 0, 0, n)},
				{ unit: 'second', want: new Date(2015, 0, 1, 0, 0, n, 0)},
				{ unit: 'minute', want: new Date(2015, 0, 1, 0, n, 0, 0)},
				{ unit: 'hour', want: new Date(2015, 0, 1, n, 0, 0, 0)},
				{ unit: 'day', want: new Date(2015, 0, 1+n, 0, 0, 0, 0)},
				{ unit: 'date', want: new Date(2015, 0, 1+n, 0, 0, 0, 0)},
				{ unit: 'month', want: new Date(2015, n, 1, 0, 0, 0, 0)},
				{ unit: 'year', want: new Date(2015+n, 0, 1, 0, 0, 0, 0)}
			];

			spec.forEach(function(spec) {
				describe('when unit is ' + spec.unit, function() {
					it('it sets end correctly', function() {
						var range = new DateRange(start, n, spec.unit);
						expect(range.end()).toEqual(spec.want);
					});
				});
			});
		});
	});

	describe('count', function() {

		describe('when unit is not supported', function() {
			it('throws an exception', function() {
				var range = new DateRange(new Date(2015, 0, 1), new Date(2015, 0, 2));
				expect(function() { range.count('wasd'); }).toThrow(new Error('Unsupported unit: "wasd"'));
			});
		});

		var n = 15;
		var specs = {
			millisecond: {},
			second: { minute: n/60 },
			minute: { second: n*60, hour: n/60 },
			hour: { date: n/24, minute: n*60, second: n*60*60 },
			date: { hour: n*24, minute: n*60*24 }
			// month and year is not supported yet
		};
		Object.keys(specs).forEach(function(unit) {
			describe('when constructor unit is ' + unit, function() {
				var range = new DateRange(new Date(2015, 0, 1), n, unit);
				var spec = specs[unit];

				it('returns correct count for unit: ' + unit, function() {
					expect(range.count(unit)).toEqual(n);
				});

				Object.keys(spec).forEach(function(unit) {
					it('returns correct count for unit: ' + unit, function() {
						expect(range.count(unit)).toEqual(spec[unit]);
					});
				});
			});
		});
	});

	describe('forEach', function() {

		describe('when unit is not supported', function() {
			it('throws an exception', function() {
				var range = new DateRange(new Date(2015, 0, 1), new Date(2015, 0, 2));
				expect(function() { range.forEach('wasd', function() {}); }).toThrow(new Error('Unsupported unit: "wasd"'));
			});
		});

		var specs = {
			millisecond: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 0, 1), new Date(2015, 0, 1, 0, 0, 0, 2) ],
			second: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 1, 0), new Date(2015, 0, 1, 0, 0, 2, 0) ],
			minute: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 1, 0, 0), new Date(2015, 0, 1, 0, 2, 0, 0) ],
			hour: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 1, 0, 0, 0), new Date(2015, 0, 1, 2, 0, 0, 0) ],
			date: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 2, 0, 0, 0, 0), new Date(2015, 0, 3, 0, 0, 0, 0) ],
			month: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 1, 1, 0, 0, 0, 0), new Date(2015, 2, 1, 0, 0, 0, 0) ],
			year: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2016, 0, 1, 0, 0, 0, 0), new Date(2017, 0, 1, 0, 0, 0, 0) ]
		};

		Object.keys(specs).forEach(function(unit) {
			describe('when constructor unit and method parameter is ' + unit, function() {
				var range = new DateRange(new Date(2015, 0, 1), 3, unit);

				var dates = [];
				var indexes = [];
				var fn = function(date, index) {
					dates.push(date);
					indexes.push(index);
				};

				var returned = range.forEach(unit, fn)

				it('returns the range', function() {
					expect(returned).toBe(range);
				});
				it('iterates over the correct dates', function() {
					expect(dates).toEqual(specs[unit]);
				});
				it('provides the correct indexes to the handler during the iteration', function() {
					expect(indexes).toEqual([0, 1, 2]);
				});
			});
		});
	});

	describe('map', function() {

		describe('when unit is not supported', function() {
			it('throws an exception', function() {
				var range = new DateRange(new Date(2015, 0, 1), new Date(2015, 0, 2));
				expect(function() { range.forEach('wasd', function() {}); }).toThrow(new Error('Unsupported unit: "wasd"'));
			});
		});

		var specs = {
			millisecond: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 0, 1), new Date(2015, 0, 1, 0, 0, 0, 2) ],
			second: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 1, 0), new Date(2015, 0, 1, 0, 0, 2, 0) ],
			minute: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 1, 0, 0), new Date(2015, 0, 1, 0, 2, 0, 0) ],
			hour: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 1, 0, 0, 0), new Date(2015, 0, 1, 2, 0, 0, 0) ],
			date: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 2, 0, 0, 0, 0), new Date(2015, 0, 3, 0, 0, 0, 0) ],
			month: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 1, 1, 0, 0, 0, 0), new Date(2015, 2, 1, 0, 0, 0, 0) ],
			year: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2016, 0, 1, 0, 0, 0, 0), new Date(2017, 0, 1, 0, 0, 0, 0) ]
		};

		Object.keys(specs).forEach(function(unit) {
			describe('when constructor unit and method parameter is ' + unit, function() {
				var range = new DateRange(new Date(2015, 0, 1), 3, unit);

				var fn = function(date, index) {
					return { date: date, index: index };
				};

				var returned = range.map(unit, fn);

				it('maps over the correct dates and returns array with mapped objects', function() {
					var want = specs[unit].map(fn);
					expect(returned).toEqual(want);
				});
			});
		});
	});

	describe('toArray', function() {

		describe('when unit is not supported', function() {
			it('throws an exception', function() {
				var range = new DateRange(new Date(2015, 0, 1), new Date(2015, 0, 2));
				expect(function() { range.toArray('wasd'); }).toThrow(new Error('Unsupported unit: "wasd"'));
			});

			var specs = {
				millisecond: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 0, 1), new Date(2015, 0, 1, 0, 0, 0, 2) ],
				second: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 0, 1, 0), new Date(2015, 0, 1, 0, 0, 2, 0) ],
				minute: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 0, 1, 0, 0), new Date(2015, 0, 1, 0, 2, 0, 0) ],
				hour: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 1, 1, 0, 0, 0), new Date(2015, 0, 1, 2, 0, 0, 0) ],
				date: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 0, 2, 0, 0, 0, 0), new Date(2015, 0, 3, 0, 0, 0, 0) ],
				month: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2015, 1, 1, 0, 0, 0, 0), new Date(2015, 2, 1, 0, 0, 0, 0) ],
				year: [ new Date(2015, 0, 1, 0, 0, 0, 0), new Date(2016, 0, 1, 0, 0, 0, 0), new Date(2017, 0, 1, 0, 0, 0, 0) ]
			};

			Object.keys(specs).forEach(function(unit) {
				describe('when constructor unit and method parameter is ' + unit, function() {
					var range = new DateRange(new Date(2015, 0, 1), 3, unit);

					it('returns correct dates', function() {
						expect(range.toArray(unit)).toEqual(specs[unit]);
					});
				});
			});
		});
	});
});

