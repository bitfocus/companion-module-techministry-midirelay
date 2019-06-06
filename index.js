// TechMinistry-MIDIRelay

var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.MIDI_inputs = [];
instance.prototype.MIDI_outputs = [];

instance.prototype.MIDI_inputs_list = [];
instance.prototype.MIDI_outputs_list = [];

instance.prototype.MIDI_notes = [
    {id: 21, label: 'A0'},
    {id: 22, label: 'A#0'},
    {id: 23, label: 'B0'},
    {id: 24, label: 'C1'},
    {id: 25, label: 'C#1'},
    {id: 26, label: 'D1'},
    {id: 27, label: 'D#1'},
    {id: 28, label: 'E1'},
    {id: 29, label: 'F1'},
    {id: 30, label: 'F#1'},
    {id: 31, label: 'G1'},
    {id: 32, label: 'G#1'},
    {id: 33, label: 'A1'},
    {id: 34, label: 'A#1'},
    {id: 35, label: 'B1'},
    {id: 36, label: 'C2'},
    {id: 37, label: 'C#2'},
    {id: 38, label: 'D2'},
    {id: 39, label: 'D#2'},
    {id: 40, label: 'E2'},
    {id: 41, label: 'F2'},
    {id: 42, label: 'F#2'},
    {id: 43, label: 'G2'},
    {id: 44, label: 'G#2'},
    {id: 45, label: 'A2'},
    {id: 46, label: 'A#2'},
    {id: 47, label: 'B2'},
    {id: 48, label: 'C3'},
    {id: 49, label: 'C#3'},
    {id: 50, label: 'D3'},
    {id: 51, label: 'D#3'},
    {id: 52, label: 'E3'},
    {id: 53, label: 'F3'},
    {id: 54, label: 'F#3'},
    {id: 55, label: 'G3'},
    {id: 56, label: 'G#3'},
    {id: 57, label: 'A3'},
    {id: 58, label: 'A#3'},
    {id: 59, label: 'B3'},
    {id: 60, label: 'C4'},
    {id: 61, label: 'C#4'},
    {id: 62, label: 'D4'},
    {id: 63, label: 'D#4'},
    {id: 64, label: 'E4'},
    {id: 65, label: 'F4'},
    {id: 66, label: 'F#4'},
    {id: 67, label: 'G4'},
    {id: 68, label: 'G#4'},
    {id: 69, label: 'A4'},
    {id: 70, label: 'A#4'},
    {id: 71, label: 'B4'},
    {id: 72, label: 'C5'},
    {id: 73, label: 'C#5'},
    {id: 74, label: 'D5'},
    {id: 75, label: 'D#5'},
    {id: 76, label: 'E5'},
    {id: 77, label: 'F5'},
    {id: 78, label: 'F#5'},
    {id: 79, label: 'G5'},
    {id: 80, label: 'G#5'},
    {id: 81, label: 'A5'},
    {id: 82, label: 'A#5'},
    {id: 83, label: 'B5'},
    {id: 84, label: 'C6'},
    {id: 85, label: 'C#6'},
    {id: 86, label: 'D6'},
    {id: 87, label: 'D#6'},
    {id: 88, label: 'E6'},
    {id: 89, label: 'F6'},
    {id: 90, label: 'F#6'},
    {id: 91, label: 'G6'},
    {id: 92, label: 'G#6'},
    {id: 93, label: 'A6'},
    {id: 94, label: 'A#6'},
    {id: 95, label: 'B6'},
    {id: 96, label: 'C7'},
    {id: 97, label: 'C#7'},
    {id: 98, label: 'D7'},
    {id: 99, label: 'D#7'},
    {id: 100, label: 'E7'},
    {id: 101, label: 'F7'},
    {id: 102, label: 'F#7'},
    {id: 103, label: 'G7'},
    {id: 104, label: 'G#7'},
    {id: 105, label: 'A7'},
    {id: 106, label: 'A#7'},
    {id: 107, label: 'B7'},
    {id: 108, label: 'C8'}
];

instance.prototype.MIDI_channels = [];

instance.prototype.MIDI_velocity = [];

instance.prototype.MSC_deviceid = [];

instance.prototype.MSC_commandformat = [
	{id: 'lighting.general', label: 'Lighting - General'},
	{id: 'sound.general', label: 'Sound - General'},
	{id: 'machinery.general', label: 'Machinery - General'},
	{id: 'video.general', label: 'Video - General'},
	{id: 'projection.general', label: 'Projection - General'},
	{id: 'processcontrol.general', label: 'Process Control - General'},
	{id: 'pyro.general', label: 'Pyro - General'},
	{id: 'all', label: 'All'},
];

instance.prototype.MSC_command = [
	{id: 'go', label: 'Go'},
	{id: 'stop', label: 'Stop'},
	{id: 'gojam', label: 'Go Jam'},
	{id: 'resume', label: 'Resume'},
	{id: 'timedgo', label: 'Timed Go'},
	{id: 'load', label: 'Load'},
	{id: 'set', label: 'Set'},
	{id: 'fire', label: 'Fire'},
	{id: 'alloff', label: 'All Off'},
	{id: 'restore', label: 'Restore'},
	{id: 'reset', label: 'Reset'},
	{id: 'gooff', label: 'Go Off'},
	{id: 'opencuelist', label: 'Open Cue List'},
	{id: 'closecuelist', label: 'Close Cue List'},
	{id: 'startclock', label: 'Start Clock'},
	{id: 'stopclock', label: 'Stop Clock'}
];

instance.prototype.init = function () {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_OK);

	//self.initModule();
};

instance.prototype.updateConfig = function (config) {
	var self = this;
	self.config = config;

	self.status(self.STATUS_OK);

	self.initModule();
};

instance.prototype.initModule = function () {
	var self = this;
	
	self.MIDI_inputs = [];
	self.MIDI_outputs = [];
	self.MIDI_inputs_list = [];
	self.MIDI_outputs_list = [];
	self.MIDI_channels = [];
	self.MIDI_velocity = [];
	
	self.MSC_deviceid = [];
	
	self.getRest('/midi_inputs', self.config.host, self.config.port).then(function(arrResult) {
		if (arrResult[2].error) {
			//throw an error
			self.status(self.STATUS_ERROR, arrResult[2]);
		}
		else {
			self.MIDI_inputs = arrResult[2];
			for (var i = 0; i < self.MIDI_inputs.length; i++) {
				var listObj = {};
				listObj.id = self.MIDI_inputs[i].name;
				listObj.label = self.MIDI_inputs[i].name;
				self.MIDI_inputs_list.push(listObj);
			}
			self.actions(); // export actions
		}
	}).catch(function(arrResult) {
		self.status(self.STATUS_ERROR, arrResult);
		self.log('error', arrResult[0] + ':' + arrResult[1] + ' ' + arrResult[2]);
	});
	
	self.getRest('/midi_outputs', self.config.host, self.config.port)
	.then(function(arrResult) {
		if (arrResult[2].error) {
			//throw an error
			self.status(self.STATUS_ERROR, arrResult[2]);
		}
		else {
			self.MIDI_outputs = arrResult[2];
			for (var i = 0; i < self.MIDI_outputs.length; i++) {
				var listObj = {};
				listObj.id = self.MIDI_outputs[i].name;
				listObj.label = self.MIDI_outputs[i].name;
				self.MIDI_outputs_list.push(listObj);
			}			
			self.actions(); // export actions
		}
	})
	.catch(function(arrResult) {
		self.status(self.STATUS_ERROR, arrResult);
		self.log('error', arrResult[0] + ':' + arrResult[1] + ' ' + arrResult[2]);
	});

	//build MIDI Channels list
	for (let i = 0; i < 16; i++) {
        let listObj = {};
		listObj.id = i;
		listObj.label = (i+1) + '';
		self.MIDI_channels.push(listObj);
    }
	
	//build MIDI Velocity list
	for (let i = 1; i < 128; i++) {
        let listObj = {};
		listObj.id = i;
		listObj.label = i + '';
		self.MIDI_velocity.push(listObj);
    }
	
	///build MIDI Show Control Device ID list
	for (let i = 0; i < 112; i++) {
		let listObj = {};
		listObj.id = i;
		listObj.label = i + '';
		self.MSC_deviceid.push(listObj);
	}
	for (let i = 1; i < 16; i++) {
		let listObj = {};
		listObj.id = 'g' + i;
		listObj.label = 'Group ' + i;
		self.MSC_deviceid.push(listObj);
	}
	let listObj = {};
	listObj.id = 'all';
	listObj.label = 'All Devices';
	self.MSC_deviceid.push(listObj);
	
	self.actions(); // export actions
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'You will need to have the MIDI Relay program running on the remote computer.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			default: 4000,
			width: 4,
			regex: self.REGEX_PORT
		}
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;

	debug('destroy', self.id);
}

instance.prototype.actions = function (system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'midi_noteon': {
			label: 'Send MIDI Note On',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: self.MIDI_outputs_list,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Channel',
					id: 'channel',
					choices: self.MIDI_channels,
					default: '0',
					tooltip: 'MIDI Channel to send.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					choices: self.MIDI_notes,
					default: '21',
					tooltip: 'MIDI Note to send.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Velocity',
					id: 'velocity',
					choices: self.MIDI_velocity,
					default: '1',
					tooltip: 'MIDI Velocity to send.'
				}
			]
		},
		'midi_noteoff': {
			label: 'Send MIDI Note Off',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: self.MIDI_outputs_list,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Channel',
					id: 'channel',
					choices: self.MIDI_channels,
					default: '0',
					tooltip: 'MIDI Channel to send.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Note',
					id: 'note',
					choices: self.MIDI_notes,
					default: '21',
					tooltip: 'MIDI Note to send.'
				},
				{
					type: 'dropdown',
					label: 'MIDI Velocity',
					id: 'velocity',
					choices: self.MIDI_velocity,
					default: '1',
					tooltip: 'MIDI Velocity to send.'
				}
			]
		},
		'msc_command': {
			label: 'Send MSC Command',
			options: [
				{
					type: 'dropdown',
					label: 'MIDI Port',
					id: 'midiport',
					choices: self.MIDI_outputs_list,
					tooltip: 'MIDI Port to control.'
				},
				{
					type: 'dropdown',
					label: 'Device ID',
					id: 'deviceid',
					choices: self.MSC_deviceid,
					default: '0',
					tooltip: 'Device ID to target.'
				},
				{
					type: 'dropdown',
					label: 'Command Format',
					id: 'commandformat',
					choices: self.MSC_commandformat,
					default: 'lighting.general'
				},
				{
					type: 'dropdown',
					label: 'Command',
					id: 'command',
					choices: self.MSC_command,
					default: 'go'
				},
				{
					type: 'textinput',
					label: 'Cue (optional)',
					id: 'cue',
					default: ''
				},
				{
					type: 'textinput',
					label: 'Cue List (optional)',
					id: 'cuelist',
					default: ''
				},
				{
					type: 'textinput',
					label: 'Cue Path (optional)',
					id: 'cuepath',
					default: ''
				}
			]
		}
	});
};

instance.prototype.action = function (action) {
	var self = this;
	var options = action.options;
	
	var host = self.config.host;
	var port = self.config.port;

	switch (action.action) {
		case 'midi_noteon':
			self.postRest('/sendmidi', host, port,
				{ midiport: options.midiport, midicommand: 'noteon', note: parseInt(options.note), channel: parseInt(options.channel), velocity: parseInt(options.velocity) }
			)
			.then(function(arrResult) {
				if (arrResult[2].error) {
					//throw an error
					self.status(self.STATUS_ERROR, arrResult[2].error);
				}
			})
			.catch(function(arrResult) {
				self.status(self.STATUS_ERROR, arrResult);
			});
			break;
		case 'midi_noteoff':
			self.postRest('/sendmidi', host, port,
				{ midiport: options.midiport, midicommand: 'noteoff', note: parseInt(options.note), channel: parseInt(options.channel), velocity: parseInt(options.velocity) }
			)
			.then(function(arrResult) {
				if (arrResult[2].error) {
					//throw an error
					self.status(self.STATUS_ERROR, arrResult[2].error);
				}
			})
			.catch(function(arrResult) {
				self.status(self.STATUS_ERROR, arrResult);
			});
			break;
		case 'msc_command':
			self.postRest('/sendmidi', host, port,
				{
					midiport: options.midiport, 
					midicommand: 'msc', 
					deviceid: options.deviceid, 
					commandformat: options.commandformat, 
					command: options.command, 
					cue: options.cue, 
					cuelist: options.cuelist, 
					cuepath: options.cuepath
				}
			)
			.then(function(arrResult) {
				if (arrResult[2].error) {
					//throw an error
					self.status(self.STATUS_ERROR, arrResult[2].error);
				}
			})
			.catch(function(arrResult) {
				self.status(self.STATUS_ERROR, arrResult);
			});
			break;
		default:
			break;
	}
};

instance.prototype.getRest = function(cmd, host, port) {
	var self = this;
	return self.doRest('GET', cmd, host, port, {});
};

instance.prototype.postRest = function(cmd, host, port, body) {
	var self = this;
	return self.doRest('POST', cmd, host, port, body);
};

instance.prototype.doRest = function(method, cmd, host, port, body) {
	var self = this;
	var url  = self.makeUrl(cmd, host, port);

	return new Promise(function(resolve, reject) {

		function handleResponse(err, result) {
			if (err === null && typeof result === 'object' && result.response.statusCode === 200) {
				// A successful response

				var objJson = result.data;
				
				resolve([ host, port, objJson ]);

			} else {
				// Failure. Reject the promise.
				var message = 'Unknown error';

				if (result !== undefined) {
					if (result.response !== undefined) {
						message = result.response.statusCode + ': ' + result.response.statusMessage;
					} else if (result.error !== undefined) {
						// Get the error message from the object if present.
						message = result.error;
					}
				}

				reject([ host, port, message ]);
			}
		}

		switch(method) {
			case 'POST':
				self.system.emit('rest', url, body, function(err, result) {
					handleResponse(err, result);
				});
				break;

			case 'GET':
				self.system.emit('rest_get', url, function(err, result) {
					handleResponse(err, result);
				});
				break;

			default:
				throw new Error('Invalid method');

		}

	});

};

instance.prototype.makeUrl = function(cmd, host, port) {
	var self = this;

	if (cmd[0] !== '/') {
		throw new Error('cmd must start with a /');
	}

	return 'http://' + host + ':' + port + cmd;

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
