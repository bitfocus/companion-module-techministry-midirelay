function getValidChannel(channel) {
	//make sure it is a valid channel option in case the user used a variable
	channel = parseInt(channel);
	if (channel < 1 || channel > 16) {
		channel = 1;
	}

	return channel;
}

function getValidNote(note) {
	note = parseInt(note);
	//now make sure it is a valid note option from the dropdown values
	if (note < 0 || note > 127) {
		note = 21;
	}

	return note;
}

function getValidValue(value) {
	//now make sure it is a valid velocity option from the dropdown values
	value = parseInt(value);
	if (value < 0 || value > 127) {
		value = 100;
	}

	return value;
}

module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	initActions: function () {
		let self = this;
		let actions = {};

		actions.midi_noteon = {
			name: 'Send Note On',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					choices: this.MIDI_notes,
					allowCustom: true,
					default: '21',
				},
				{
					type: 'textinput',
					label: 'Velocity',
					id: 'velocity',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let note = getValidNote(await this.parseVariablesInString(event.options.note));
				let velocity = getValidValue(await this.parseVariablesInString(event.options.velocity));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'noteon',
					channel: (channel-1), //channels are zero-based in midi-relay
					note: note,
					velocity: velocity
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}
	
		actions.midi_noteoff = {
			name: 'Send Note Off',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					choices: this.MIDI_notes,
					allowCustom: true,
					default: '21',
				},
				{
					type: 'textinput',
					label: 'Velocity',
					id: 'velocity',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let note = getValidNote(await this.parseVariablesInString(event.options.note));
				let velocity = getValidValue(await this.parseVariablesInString(event.options.velocity));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'noteoff',
					channel: (channel-1), //channels are zero-based in midi-relay
					note: note,
					velocity: velocity
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.aftertouch = {
			name: 'Send Polyphonic Aftertouch',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					choices: this.MIDI_notes,
					allowCustom: true,
					default: '21',
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let note = getValidNote(await this.parseVariablesInString(event.options.note));
				let value = getValidValue(await this.parseVariablesInString(event.options.value));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'aftertouch',
					channel: (channel-1), //channels are zero-based in midi-relay
					note: note,
					value: value
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.cc = {
			name: 'Send Control Change',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Controller',
					id: 'controller',
					default: this.MIDI_controllers[0].id,
					choices: this.MIDI_controllers,
					allowCustom: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let controller = getValidValue(await this.parseVariablesInString(event.options.controller));
				let value = getValidValue(await this.parseVariablesInString(event.options.value));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'cc',
					channel: (channel-1), //channels are zero-based in midi-relay
					controller: controller,
					value: value
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.pc = {
			name: 'Send Program Change',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let value = getValidValue(await this.parseVariablesInString(event.options.value));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'pc',
					channel: (channel-1), //channels are zero-based in midi-relay
					value: value
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.pressure = {
			name: 'Send Channel Pressure / Aftertouch',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let value = getValidValue(await this.parseVariablesInString(event.options.value));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'pressure',
					channel: (channel-1), //channels are zero-based in midi-relay
					value: value
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.pitchbend = {
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'Channel',
					id: 'channel',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					default: '100',
					useVariables: true
				}
			],
			callback: async (event) => {
				let channel = getValidChannel(await this.parseVariablesInString(event.options.channel));
				let value = getValidValue(await this.parseVariablesInString(event.options.value));

				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'pitchbend',
					channel: (channel-1), //channels are zero-based in midi-relay
					value: value
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.msc_command = {
			name: 'Send MSC Command',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					allowCustom: true,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'dropdown',
					label: 'Device ID',
					id: 'deviceid',
					choices: this.MSC_deviceid,
					default: this.MSC_deviceid[0].id,
					tooltip: 'Device ID to target.',
					allowCustom: true
				},
				{
					type: 'dropdown',
					label: 'Command Format',
					id: 'commandformat',
					choices: this.MSC_commandformat,
					default: this.MSC_commandformat[0].id,
					allowCustom: true
				},
				{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: this.MSC_command,
					default: this.MSC_command[0].id,
					allowCustom: true
				},
				{
					type: 'textinput',
					label: 'Cue (optional)',
					id: 'cue',
					default: '',
					useVariables: true
				},
				{
					type: 'textinput',
					label: 'Cue List (optional)',
					id: 'cuelist',
					default: '',
					useVariables: true
				},
				{
					type: 'textinput',
					label: 'Cue Path (optional)',
					id: 'cuepath',
					default: '',
					useVariables: true
				}
			],
			callback: async (event) => {
				let deviceid = await this.parseVariablesInString(event.options.deviceid);
				let commandformat = await this.parseVariablesInString(event.options.commandformat);
				let command = await this.parseVariablesInString(event.options.command);
				let cue = await this.parseVariablesInString(event.options.cue);
				let cuelist = await this.parseVariablesInString(event.options.cuelist);
				let cuepath = await this.parseVariablesInString(event.options.cuepath);

				midiObj = {
					midiport: event.options.midiport, 
					midicommand: 'msc', 
					deviceid: deviceid, 
					commandformat: commandformat, 
					command: command, 
					cue: cue,
					cuelist: cuelist,
					cuepath: cuepath
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.sysex = {
			name: 'Send SysEx MIDI Message',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: this.MIDI_outputs_list,
					default: this.MIDI_outputs_list[0].id,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'textinput',
					label: 'SysEx MIDI Message in hexadecimal or decimal, separated by spaces or commas',
					id: 'message',
					default: '0'
				}
			],
			callback: async (event) => {
				midiObj = {
					midiport: event.options.midiport,
					midicommand: 'sysex',
					message: event.options.message
				};

				this.sendCommand('sendmidi', midiObj);
			}
		}

		actions.refresh = {
			name: 'Refresh MIDI Ports',
			options: [],
			callback: async (event) => {
				midiObj = {
					
				};

				this.sendCommand('refresh', midiObj);
			}
		}
		
		this.setActionDefinitions(actions);
	}
}