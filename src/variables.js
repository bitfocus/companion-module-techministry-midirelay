module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let variables = []

		variables.push({ variableId: 'information', name: 'Information' })
		variables.push({ variableId: 'version', name: 'midi-relay Version' })
		variables.push({ variableId: 'control_status', name: 'Control Status' })

		variables.push({ variableId: 'listening_midi_port', name: 'Listening MIDI Port' })
		variables.push({ variableId: 'last_midi_datetime', name: 'Last MIDI Message Received Date/Time' })
		variables.push({ variableId: 'last_midi_message_type', name: 'Last MIDI Message Type' })
		variables.push({ variableId: 'last_midi_channel', name: 'Last MIDI Channel' })
		variables.push({ variableId: 'last_midi_note', name: 'Last MIDI Note' })
		variables.push({ variableId: 'last_midi_note_decimal', name: 'Last MIDI Note Decimal' })
		variables.push({ variableId: 'last_midi_velocity', name: 'Last MIDI Velocity' })
		variables.push({ variableId: 'last_midi_value', name: 'Last MIDI Value' })
		variables.push({ variableId: 'last_midi_controller', name: 'Last MIDI Controller' })
		variables.push({ variableId: 'last_midi_raw', name: 'Last MIDI Raw' })

		this.setVariableDefinitions(variables)
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this

		try {
			this.setVariableValues({
				information: this.STATUS.information,
				version: this.STATUS.version,
				control_status: this.STATUS.controlStatus ? 'True' : 'False',

				listening_midi_port: this.config.midiPort,

				last_midi_datetime: this.STATUS.lastMidiDateTime,
				last_midi_message_type: this.STATUS.lastMidiMessageType,
				last_midi_channel: this.STATUS.lastMidiChannel,
				last_midi_note: this.STATUS.lastMidiNote,
				last_midi_note_decimal: this.STATUS.lastMidiNoteDecimal,
				last_midi_velocity: this.STATUS.lastMidiVelocity,
				last_midi_value: this.STATUS.lastMidiValue,
				last_midi_controller: this.STATUS.lastMidiController,
				last_midi_raw: this.STATUS.lastMidiRaw,
			})
		} catch (error) {
			this.log('error', 'Error setting Variables: ' + String(error))
		}
	},
}
