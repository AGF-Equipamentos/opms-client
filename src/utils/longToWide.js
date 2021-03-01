export default function pivot(data, columns, name, value, opts) {
	const keepCols = data.columns.filter(c => !columns.includes(c));
	const long = [];
	columns.forEach(col => {
		data.forEach(d => {
			const row = {};
			keepCols.forEach(c => {
				row[c] = d[c];
			});
			// TODO, add an option to ignore if fails a truth test to approximate `values_drop_na`
			row[name] = col;
			row[value] = d[col];
			long.push(row);
		});
	});
	return long;
}