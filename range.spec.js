describe('Range', function() {

	describe('constructor:', function() {

		describe('when using start + end date paramters', function() {
			var start = new Date(2015, 0, 1);
			var end = new Date(2015, 1, 1);
			var range = new Range(start, end);

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
				var range = new Range(start, 1, 'day');
				expect(range.start()).toEqual(start);
				expect(range.start()).not.toBe(start);
			})

			describe('when unit is not supported', function() {
				it('throws an exception', function() {
					expect(function() { new Range(start, 15, 'wasd') }).toThrow(new Error('Unsupported unit: "wasd"'));
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
						var range = new Range(start, n, spec.unit);
						expect(range.end()).toEqual(spec.want);
					});
				});
			});
		});
	})
});