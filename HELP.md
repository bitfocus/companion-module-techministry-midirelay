## TechMinistry-MIDIRelay

This module will allow you to send MIDI Channel Voice and MIDI Show Control messages to a listener on a remote machine which will then relay the MIDI message to the device.

### Configuration
* The remote device must be running MIDI Relay, a listener program that relays the MIDI commands on the remote machine/network.
* The software can be downloaded from <http://www.github.com/josephdadams/midi-relay>.
* Configure the instance with the IP address of the remote machine.
* The module makes HTTP requests over port 4000.

### To use the module
Add an action to a button and choose the action you wish to use.

**Available actions:**
* Send MIDI Note On
* Send MIDI Note Off
* Send Polyphonic Aftertouch
* Send Controller Change (CC)
* Send Program Change (PC)
* Send Channel Pressure / Aftertouch
* Send Pitch Bend / Pitch Wheel
* Send MIDI Show Control (MSC)
* Send SysEx Message (Hexadecimal or Decimal)