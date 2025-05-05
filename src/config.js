const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `
					<div class="alert alert-warning">
						<div>
							<strong>Please read and understand the following before using this module:</strong>
							<br>
							This module connects to software called "midi-relay" which will run on the computer where you want to send MIDI commands.
							<br><br>
							<strong>Install Instructions:</strong>
							<br><br>
							<ul>
								<li><a href="https://github.com/josephdadams/midi-relay" target="_new" class="btn btn-warning mr-1">Download midi-relay here</a></li>
								<li>Install the application on your computer and run it.</li>
								<li>It uses Port 4000 by default. If this port is already in use in your system, you will need to change it.</li>
								<li>Configure this module with the Host IP Address and Port in use. The IP Address should be the IP of the computer running midi-relay.</li>
								<li>If it is the same computer that is running Companion, you can use IP "127.0.0.1".</li>
							</ul>
						</div>
					</div>
				`
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'midi-relay IP Address',
				width: 3,
				default: '127.0.0.1',
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'midi-relay Listening Port',
				width: 3,
				default: 4000,
				regex: Regex.Port
			},
			{
				type: 'dropdown',
				id: 'protocol',
				label: 'Protocol Version',
				width: 6,
				default: '3',
				choices: [
					{ id: '2', label: 'midi-relay 2.x or less' },
					{ id: '3', label: 'mid-relay 3.x or greater' }
				],
			},
			{
				type: 'checkbox',
				id: 'useMidiFeedback',
				default: false,
				label: 'Use MIDI Feedback',
				width: 2,
				isVisible: (config) => config.protocol == '3'
			},
			{
				type: 'dropdown',
				id: 'midiPort',
				label: 'MIDI Feedback/Input Port (which MIDI port to listen to)',
				width: 6,
				default: this.MIDI_inputs_list[0].id,
				choices: this.MIDI_inputs_list,
				isVisible: (config) => config.useMidiFeedback == true
			},
			{
				type: 'checkbox',
				id: 'ignoreMidiChannels',
				label: 'Ignore MIDI Channels',
				default: 2,
				isVisible: (config) => config.useMidiFeedback == true
			},
			{
				type: 'textinput',
				id: 'midiChannel',
				label: 'MIDI Channel',
				width: 2,
				default: 1,
				min: 1,
				max: 16,
				isVisible: (config) => config.ignoreMidiChannels == false
			},
			{
				type: 'static-text',
				id: 'midiInputsNone',
				label: 'No MIDI Inputs detected yet - please wait for midi-relay to connect and then return to this config page to select a port.',
				width: 12,
				isVisible: (config) => config.midiPort == '0'
			},
			{
				type: 'static-text',
				id: 'midiInputsSelect',
				label: 'Select a MIDI input from the list to receive MIDI data back from midi-relay.',
				width: 12,
				isVisible: (config) => config.useMidiFeedback == true && config.midiPort == 'select'
			},
			{
				type: 'static-text',
				id: 'info2',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'useAsSurface',
				label: 'Use MIDI Feedback as a Companion Satellite Surface',
				tooltip: 'With this option, the first keys of the channel starting at the note offset will be automatically assigned as surface keys. NoteOn at any velocity will trigger the key, and NoteOff will release it.',
				width: 2,
				default: false,
				isVisible: (config) => config.useMidiFeedback == true
			},
			{
				type: 'checkbox',
				id: 'useAllChannelsAsSurfaces',
				label: 'Use All MIDI Channels as Individual Satellite Surfaces',
				tooltip: 'With this option, the module will register 16 satellite surfaces, one for each MIDI channel.',
				width: 2,
				default: false,
				isVisible: (config) => config.useAsSurface == true && config.ignoreMidiChannels == true,
			},
			{
				type: 'number',
				id: 'noteOffset',
				label: 'Note Offset - this note will represent Button 1',
				width: 2,
				default: 21,
				min: 0,
				max: 95,
				isVisible: (config) => config.useAsSurface == true,
			},
			{
				type: 'number',
				id: 'maxKeys',
				label: 'How many keys to use as buttons (>1)',
				width: 2,
				default: 32,
				min: 1,
				max: 1024,
				isVisible: (config) => config.useAsSurface == true,
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'static-text',
				id: 'info2',
				label: 'Verbose Logging',
				width: 12,
				value: `
					<div class="alert alert-info">
						Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.
					</div>
				`
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			},
		]
	}
}