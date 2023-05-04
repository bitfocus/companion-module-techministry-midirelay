module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let variables = [];

		variables.push({ variableId: 'information', 		name: 'Information' });
		variables.push({ variableId: 'version', 			name: 'midi-relay Version' });
		variables.push({ variableId: 'control_status',		name: 'Control Status'});

		this.setVariableDefinitions(variables);
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			this.setVariableValues(
				{
					'information': 		this.STATUS.information,
					'version': 			this.STATUS.version,
					'control_status': 	this.STATUS.controlStatus ? 'True' : 'False'
				}
			)
		}
		catch(error) {
			this.log('error', 'Error setting Variables: ' + String(error));
		}
	}
}