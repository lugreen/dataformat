Ext.define('Df.data.reader.Cbor', {
	extend: 'Ext.data.reader.Json',
	alias: 'reader.cbor',

	read: function(response, readOptions) {
		var data, result;

		if (response && response.responseBytes) {
			result = this.getResponseData(response);
			if (result && result.__$isError) {
				return new Ext.data.ResultSet({
					total: 0,
					count: 0,
					records: [],
					success: false,
					message: result.msg
				});
			}
			else {
				data = this.readRecords(result, readOptions);
			}
		}

		return data || this.nullResultSet;
	},

	getResponseData: function(response) {
		var error;
		try {
			var start = performance.now();
			var result = CBOR.decode(response.responseBytes.buffer);
			console.log('cbor', (performance.now()-start) + ' ms');
			return result;
		}
		catch (ex) {
			error = this.createReadError(ex.message);
            Ext.Logger.warn('Unable to parse the CBOR returned by the server');
            this.fireEvent('exception', this, response, error);
            return error;
		}
	}
});