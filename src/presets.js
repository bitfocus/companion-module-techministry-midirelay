const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let presets = [];

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
	
		this.setPresetDefinitions(presets);
	}
}
