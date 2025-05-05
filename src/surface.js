const { TCPHelper } = require('@companion-module/base')

module.exports = {
	initSurface() {
		let self = this;

		if (self.SOCKET_COMPANION !== undefined) {
			self.SOCKET_COMPANION.destroy();
			delete self.SOCKET_COMPANION;
		}

		if (self.config.host_companion === undefined) {
			self.config.host_companion = '127.0.0.1';
		}

		if (self.config.port_companion === undefined) {
			self.config.port_companion = 16622;
		}

		if (self.DEVICEID == undefined) {
			self.DEVICEID = self.id;
		}

		if (self.config.host_companion) {
			self.log('info', `Opening Connection to Companion Satellite API: ${self.config.host_companion}:${self.config.port_companion}`);

			self.SOCKET_COMPANION = new TCPHelper(self.config.host_companion, self.config.port_companion);

			self.SOCKET_COMPANION.on('error', (err) => {
				self.log('error', 'Network error with Companion Satellite API: ' + err.message);
			});

			self.SOCKET_COMPANION.on('connect', () => {
				self.log('info', 'Connected to Companion Satellite API');
			});

			self.SOCKET_COMPANION.on('data', function (data) {	
				self.processCompanionData(data);
			});
		}
	},

	CompanionSatellite_Close() {
		let self = this;

		//close socket if it exists
		if (self.SOCKET_COMPANION !== undefined) {
			if (self.config.useAllChannelsAsSurfaces) {
				for (let i = 1; i <= 16; i++) {
					self.sendCompanionSatelliteCommand(`REMOVE-DEVICE DEVICEID=${self.DEVICE_ID}-ch${i.toString().padStart(2, '0')}`);
				}
			}
			else {
				self.sendCompanionSatelliteCommand(`REMOVE-DEVICE DEVICEID=${this.DEVICE_ID}`);
			}

			self.sendCompanionSatelliteCommand('QUIT');
			self.SOCKET_COMPANION.destroy();
			delete self.SOCKET_COMPANION;
		}

		clearInterval(self.COMPANION_PING_INTERVAL);
	},

	processCompanionData(data) {
		let self = this;

		try {
			let str_raw = String(data).trim();
			let str_split = str_raw.split('\n');
	
			for (let index = 0; index < str_split.length; index++) {
				let str = str_split[index];
	
				let params = str.split(' ');
				let command = params[0];
	
				// Create a satallite device on first connect
				if (command == 'BEGIN') {
					let productName = 'TechMinistry midi-relay';
					if (self.config.useAllChannelsAsSurfaces) {
						for (let i = 1; i <= 16; i++) {
							self.sendCompanionSatelliteCommand(`ADD-DEVICE DEVICEID=${self.DEVICEID}-ch${i.toString().padStart(2, '0')} PRODUCT_NAME="${productName}" KEYS_TOTAL=${self.config.maxKeys} BITMAPS=false COLORS=false TEXT=false`);
						}
					}
					else {
						self.sendCompanionSatelliteCommand(`ADD-DEVICE DEVICEID=${self.DEVICEID} PRODUCT_NAME="${productName}" KEYS_TOTAL=${self.config.maxKeys} BITMAPS=false COLORS=false TEXT=false`);
					}
					continue;
				}
	
				// Device was added
				if (command == 'ADD-DEVICE') {
					if (params[1] == 'OK') {
						self.startCompanionSatellitePing();
					}
					else {
						//probably not ok, throw an error
						self.log('error', 'Error adding device to Companion Satellite API: ' + params[1]);
					}
					continue;
				}
			}
		}
		catch(error) {
			self.log('error', 'Error processing Companion Satellite API data: ' + error.toString());
			console.log(error)
		}
	},

	startCompanionSatellitePing() {
		let self = this;

		self.COMPANION_PING_INTERVAL = setInterval(function () {
			self.sendCompanionSatelliteCommand('PING');
		}, 100);
	},

	sendCompanionSatelliteCommand(cmd) {
		let self = this;

		if (self.SOCKET_COMPANION !== undefined && self.SOCKET_COMPANION.isConnected) {
			if (self.config.verbose) {
				if (cmd !== 'PING') {
					self.log('debug', 'Sending Companion Satellite API Command: ' + cmd);
				}
			}
			self.SOCKET_COMPANION.send(cmd + '\n');
		}
	},
}