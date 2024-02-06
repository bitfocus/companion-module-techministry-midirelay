const { combineRgb } = require('@companion-module/base')

module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	initFeedbacks: function () {
		let self = this;

		let feedbacks = {};

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		feedbacks.lastMIDI = {
			type: 'boolean',
			name: 'Last MIDI Message Matches Parameters',
			description: 'Change colors of the bank if the last received MIDI message matches the parameters.',
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					default: self.MIDI_inputs_list[0].id,
					choices: self.MIDI_inputs_list,
				},
				{
					type: 'dropdown',
					label: 'MIDI Message Type',
					id: 'midicommand',
					default: 'noteon',
					choices: [
						{ id: 'noteon', label: 'Note On' },
						{ id: 'noteoff', label: 'Note Off' },
						{ id: 'aftertouch', label: 'Polyphonic Aftertouch' },
						{ id: 'cc', label: 'Control Change' },
						{ id: 'pc', label: 'Program Change' },
						{ id: 'pressure', label: 'Channel Pressure / Aftertouch' },
						{ id: 'pitchbend', label: 'Pitch Bend' },
						{ id: 'sysex', label: 'System Exclusive' },
					],
				},
				{
					type: 'number',
					label: 'MIDI Channel',
					id: 'midichannel',
					default: 1,
					min: 1,
					max: 16,
					required: true,
					range: false,
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					default: 21,
					choices: this.MIDI_notes,
					isVisible: (options) => (options.midicommand == 'noteon' || options.midicommand == 'noteoff' || options.midicommand == 'aftertouch')
				},
				{
					type: 'number',
					label: 'MIDI Velocity',
					id: 'velocity',
					default: 127,
					min: 0,
					max: 127,
					required: true,
					range: false,
					isVisible: (options) => (options.midicommand == 'noteon' || options.midicommand == 'noteoff')
				},
				{
					type: 'number',
					label: 'MIDI Value',
					id: 'value',
					default: 127,
					min: 0,
					max: 127,
					required: true,
					range: false,
					isVisible: (options) => (options.midicommand == 'cc' || options.midicommand == 'pc' || options.midicommand == 'pitchbend' || options.midicommand == 'aftertouch')
				},
				{
					type: 'dropdown',
					label: 'MIDI Controller',
					id: 'controller',
					default: 0,
					choices: this.MIDI_controllers,
					isVisible: (options) => (options.midicommand == 'cc')
				},
				{
					type: 'textinput',
					label: 'MIDI Raw',
					id: 'midiraw',
					default: '',
					isVisible: (options) => (options.midicommand == 'sysex')
				},
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;
				if (self.midiObj) {
					let channel = opt.midichannel - 1;

					if (self.midiObj.midiport == opt.midiport && self.midiObj.midicommand == opt.midicommand && self.midiObj.channel == channel) {	
						if (opt.midicommand == 'noteon' || opt.midicommand == 'noteoff') {
							if (self.midiObj.note == opt.note && self.midiObj.velocity == opt.velocity) {
								return true;
							}
						}
						else if (opt.midicommand == 'aftertouch') {
							if (self.midiObj.note == opt.note && self.midiObj.value == opt.value) {
								return true;
							}
						}
						else if (opt.midicommand == 'cc') {
							if (self.midiObj.controller == opt.controller && self.midiObj.value == opt.value) {
								return true;
							}
						}
						else if (opt.midicommand == 'pc' || opt.midicommand == 'pressure' || opt.midicommand == 'pitchbend') {
							if (self.midiObj.value == opt.value) {
								return true;
							}
						}
						else if (opt.midicommand == 'sysex') {
							if (self.midiObj.midiraw == opt.midiraw) {
								return true;
							}
						}
					}
				}

				return false
			},
		}

		this.setFeedbackDefinitions(feedbacks);
	}
}
