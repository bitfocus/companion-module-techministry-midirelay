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
							This module connects to a free program called "midi-relay" which will run on the computer where you want to send MIDI commands.
							<br><br>
							<strong>Install Instructions:</strong>
							<br><br>
							<ul>
								<li><a href="https://github.com/josephdadams/midi-relay" target="_new" class="btn btn-warning mr-1">Download midi-relay here</a></li>
								<li>Install the application on your computer and run it.</li>
								<li>This module is only compatible with midi-relay v3.0 or greater. If you need compatibility with an older version of midi-relay, you will need to downgrade your version of Companion.</li>
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
				label: 'IP Address',
				width: 3,
				default: '127.0.0.1',
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 3,
				default: 4000,
				regex: Regex.Port
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
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