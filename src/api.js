const { InstanceStatus } = require('@companion-module/base')

const io = require('socket.io-client');
const axios = require('axios');

module.exports = {
	initConnection: function() {
		let self = this;

		if (self.config.host) {
			if (self.config.protocol == '3') {
				self.log('info', `Opening connection to midi-relay: ${self.config.host}:${self.config.port}`);
		
				self.socket = io.connect('http://' + self.config.host + ':' + self.config.port, {reconnection: true});
				self.log('info', 'Connecting to midi-relay...');
				self.STATUS.information = 'Connecting to midi-relay';
				self.checkVariables();
		
				// Add listeners
				self.socket.on('connect', function() { 
					self.log('info', 'Connected to midi-relay. Retrieving data.');
					self.updateStatus(InstanceStatus.Ok);
					self.STATUS.information = 'Connected';
					self.sendCommand('version', null, null);
					self.checkVariables();
					self.getState();
				});
		
				self.socket.on('disconnect', function() { 
					self.updateStatus(InstanceStatus.ConnectionFailure);
					self.log('error', 'Disconnected from midi-relay.');
					self.STATUS.information = 'Disconnected';
					self.checkVariables();
				});
		
				self.socket.on('version', function(version) {
					self.STATUS.version = version;
					self.checkVariables();
				});

				self.socket.on('midi_outputs', function(midi_outputs) {
					self.log('debug', 'midi_outputs: ' + JSON.stringify(midi_outputs));
					let outputsList = []
					for (let i = 0; i < midi_outputs.length; i++) {
						outputsList.push({ id: midi_outputs[i].name, label: `${midi_outputs[i].name}` });
					}
					self.MIDI_outputs = midi_outputs;
					self.MIDI_outputs_list = outputsList;
					self.initActions();
					self.checkVariables();
				});

				self.socket.on('midi_inputs', function(midi_inputs) {
					let inputsList = []
					inputsList.push({ id: 'select', label: '(Select a MIDI Port)' });
					for (let i = 0; i < midi_inputs.length; i++) {
						inputsList.push({ id: midi_inputs[i].name, label: `${midi_inputs[i].name}` });
					}
					self.MIDI_inputs = midi_inputs;
					self.MIDI_inputs_list = inputsList;
					if (self.config.midiPort == '0') {
						self.config.midiPort = self.MIDI_inputs_list[0].id;
						self.saveConfig(self.config);
						self.getConfigFields();
					}
					self.initFeedbacks();
					self.checkVariables();
				});
		
				self.socket.on('control_status', function(status) {
					self.STATUS.controlStatus = status;
					if (status == false) {
						self.updateStatus(InstanceStatus.UnknownWarning);
						self.STATUS.information = 'Control has been disabled via midi-relay.';
						self.log('warning', 'Control has been disabled via midi-relay.');
					}
					else {
						self.updateStatus(InstanceStatus.Ok);
						self.STATUS.information = 'Control has been enabled via midi-relay.';
						self.log('info', 'Control has been enabled via midi-relay.');
					}
					self.checkVariables();
					self.checkFeedbacks();
				});

				self.socket.on('midi_back', function(midiObj) {
					if (self.config.midiPort == midiObj.midiport) { //only care about the midi port we are listening to
						self.midiObj = midiObj;
						let channel = midiObj.channel + 1;

						if (channel == self.config.midiChannel || self.config.ignoreMidiChannels) {
							self.STATUS.lastMidiDateTime = new Date();
							self.STATUS.lastMidiCommand = midiObj.midicommand || '';
							self.STATUS.lastMidiMessageType = '',
							self.STATUS.lastMidiChannel = midiObj.channel || 0,
							//inc the channel because it's zero based
							//self.STATUS.lastMidiChannel++;
							self.STATUS.lastMidiNote = '';
							self.STATUS.lastMidiVelocity = '';
							self.STATUS.lastMidiValue = '';
							self.STATUS.lastMidiController = '';
							self.STATUS.lastMidiRaw = '';

							switch (midiObj.midicommand) {
								case 'noteon':
									self.STATUS.lastMidiMessageType = 'Note On';
									self.STATUS.lastMidiNote = self.MIDI_notes.find(({ id }) => id === midiObj.note).note || '';
									self.STATUS.lastMidiNoteDecimal = midiObj.note;
									self.STATUS.lastMidiVelocity = midiObj.velocity;
									break;
								case 'noteoff':
									self.STATUS.lastMidiMessageType = 'Note Off';
									self.STATUS.lastMidiNote = self.MIDI_notes.find(({ id }) => id === midiObj.note).note || '';
									self.STATUS.lastMidiNoteDecimal = midiObj.note;
									self.STATUS.lastMidiVelocity = midiObj.velocity;
									break;
								case 'aftertouch':
									self.STATUS.lastMidiMessageType = 'Aftertouch';
									self.STATUS.lastMidiNote = self.MIDI_notes.find(({ id }) => id === midiObj.note).note || '';
									self.STATUS.lastMidiNoteDecimal = midiObj.note;
									self.STATUS.lastMidiValue = midiObj.value;
									break;
								case 'cc':
									self.STATUS.lastMidiMessageType = 'Control Change';
									self.STATUS.lastMidiController = self.MIDI_controllers.find(({ id }) => id === midiObj.controller).label || '';
									self.STATUS.lastMidiValue = midiObj.value;
									break;
								case 'pc':
									self.STATUS.lastMidiMessageType = 'Program Change';
									self.STATUS.lastMidiValue = midiObj.value;
									break;
								case 'pressure':
									self.STATUS.lastMidiMessageType = 'Channel Pressure';
									self.STATUS.lastMidiValue = midiObj.value;
									break;
								case 'pitchbend':
									self.STATUS.lastMidiMessageType = 'Pitch Bend';
									self.STATUS.lastMidiValue = midiObj.value;
									break;
									break;
								case 'sysex':
									self.STATUS.lastMidiMessageType = 'System Exclusive';
								default:
									midiObj.midicommand = 'unsupported';
									break;
							}

							self.STATUS.lastMidiRaw = midiObj.rawmessage;

							self.checkVariables();
							self.checkFeedbacks();

							//send the satelite surface key press, if needed
							if (self.config.useAsSurface) {
								if (midiObj.midicommand == 'noteon' || midiObj.midicommand == 'noteoff') {
									if (midiObj.note >= self.config.noteOffset && midiObj.note <= self.config.noteOffset + self.config.maxKeys-1) {
										let keyState = midiObj.midicommand == 'noteon' ? 'true' : 'false';
										let keyNumber = midiObj.note - self.config.noteOffset; //ok to not add 1, because it it zero based anyway
										if (self.config.useAllChannelsAsSurfaces) {
											//send the key press to the appropriate surface based on the channel
											self.sendCompanionSatelliteCommand(`KEY-PRESS DEVICEID=${self.DEVICEID}-ch${midiObj.channel.toString().padStart(2, '0')} KEY=${keyNumber} PRESSED=${keyState}`);
										}
										else {
											self.sendCompanionSatelliteCommand(`KEY-PRESS DEVICEID=${self.DEVICEID} KEY=${keyNumber} PRESSED=${keyState}`);
										}
									}
								}
							}
						}
					}
				});
		
				self.socket.on('error', function(error) {
					self.updateStatus(InstanceStatus.ConnectionFailure);
					self.log('error', 'Error from midi-relay: ' + error);
				});
			}
			else {
				self.log('debug', 'Using protocol for midi-relay v2');
				//get /version and if it returns a version, set status to ok
				let url = 'http://' + self.config.host + ':' + self.config.port + '/version';

				if (self.config.verbose) {
					self.log('info', 'Sending: ' + url);
				}
				axios({method: 'get', url: url}).then(response => {
					//the response will be just a body text of the version
					if (response.data) {
						self.log('info', 'Midi-relay version: ' + response.data);
						self.updateStatus(InstanceStatus.Ok);
					}
				});
			}
		}
	},
	
	getState: function() { //gets the most recent list of midi output ports from midi-relay
		let self = this;

		self.sendCommand('midi_outputs');
		self.sendCommand('getMidiInputs');
	},

	sendCommand: function(cmd, arg1 = null, arg2 = null) {
		let self = this;
		
		if (self.config.verbose) {
			self.log('info', 'Sending: ' + cmd);
		}

		if (self.config.protocol == '3') {
			if (self.socket !== undefined) {		
				if (arg1 !== null) {
					if (arg2 !== null) {
						self.socket.emit(cmd, arg1, arg2);
					}
					else {
						self.socket.emit(cmd, arg1);
					}
				}
				else {
					self.socket.emit(cmd);
				}
			}
			else {
				debug('Unable to send: Not connected to midi-relay.');
		
				if (self.config.verbose) {
					self.log('warn', 'Unable to send: Not connected to midi-relay.');
				}
			}
		}
		else {
			//use the old REST API
			let self = this;
			let url = 'http://' + self.config.host + ':' + self.config.port + '/' + cmd;
			if (arg1 !== null) {
				url += '/' + arg1;
			}
			if (arg2 !== null) {
				url += '/' + arg2;
			}
			if (self.config.verbose) {
				self.log('info', 'Sending: ' + url);
			}
			axios({method: 'post', url: url, data: arg1});
		}
	}
}