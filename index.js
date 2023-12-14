// techministry-midirelay

const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const constants = require('./src/constants')
const api = require('./src/api')
const surface = require('./src/surface')

class midirelayInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...constants,
			...api,
			...surface
		})

		this.STATUS = {
			information: '',
			version: '',
			controlStatus: false,

			lastMidiDateTime: '',
			lastMidiCommand: '', //the internal name like noteon
			lastMidiMessageType: '', //the friendly name like Note On
			lastMidiChannel: '', //not zero based
			lastMidiNote: '', //the friendly name like C4
			lastMidiNoteDecimal: '', //the decimal value of the note
			lastMidiVelocity: '',
			lastMidiValue: '',
			lastMidiController: '', //the friendly name like Modulation Wheel (MSB)
			lastMidiRaw: ''
		};

		this.MIDI_outputs = [];
		this.MIDI_outputs_list = [
			{id: '0', label: '(Select a MIDI Port)'}
		];

		this.MIDI_inputs = [];
		this.MIDI_inputs_list = [
			{id: '0', label: '(No MIDI inputs loaded)'}
		];
	}

	async destroy() {
		if (this.socket !== undefined) {
			this.socket.disconnect();
		}

		this.CompanionSatellite_Close();
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
		}

		let listObj = {};
		//build MIDI Show Control Device ID list
		for (let i = 0; i < 112; i++) {
			listObj = {};
			listObj.id = i;
			listObj.label = i + '';
			this.MSC_deviceid.push(listObj);
		}
		for (let i = 1; i < 16; i++) {
			listObj = {};
			listObj.id = 'g' + i;
			listObj.label = 'Group ' + i;
			this.MSC_deviceid.push(listObj);
		}
		listObj = {};
		listObj.id = 'all';
		listObj.label = 'All Devices';
		this.MSC_deviceid.push(listObj);
	
		this.updateStatus(InstanceStatus.Connecting)
	
		this.initConnection();

		if (this.config.useAsSurface) {
			this.initSurface();
		}
	
		this.initActions();
		this.initFeedbacks();

		if (this.config.protocol == '3') {
			this.initVariables();
		}
		else {
			//version 2 doesn't have any variables as it is basically just a send and forget
		}

		this.initPresets();
	
		this.checkFeedbacks();
		this.checkVariables();
	}
}

runEntrypoint(midirelayInstance, UpgradeScripts)