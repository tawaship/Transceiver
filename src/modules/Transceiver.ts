import { Emitter } from '@tawaship/emitter';

export interface IReceiverData {
	sender: Transceiver;
	data: any;
}

export interface ITransceiverDelegate {
	(data: IReceiverData): void;
}

export class Connector extends Emitter {
	private _transceiver: Transceiver;
	private _connectors: Connector[] = [];
	
	constructor(transceiver: Transceiver) {
		super();
		
		this._transceiver = transceiver;
	}
	
	getConnectors() {
		return this._connectors.concat();
	}
	
	send(type: string, data: any) {
		const connections = this._connectors;
		for (let i = 0; i < connections.length; i++) {
			connections[i].receive(type, {
				sender: this._transceiver,
				data
			});
		}
	}
	
	receive(type: string, data: IReceiverData) {
		if (!this._transceiver.enabled) {
			return;
		}
		
		return this.cemit(type, this._transceiver, data);
	}
	
	connect(connector: Connector) {
		if (connector === this) {
			return;
		}
		
		const index = this._connectors.indexOf(connector);
		if (index === -1) {
			this._connectors.push(connector);
		}
		
		return this;
	}
	
	disconnect(connector: Connector) {
		if (connector === this) {
			return;
		}
		
		const index = this._connectors.indexOf(connector);
		if (index > -1) {
			this._connectors.splice(index, 1);
		}
		
		return this;
	}
	
	disconnectAll() {
		const connections = this._connectors;
		for (let i = connections.length - 1; i >= 0; i--) {
			const connector = connections[i];
			
			this.disconnect(connector);
			connector.disconnect(this);
		}
		
		return this;
	}
}

export class Transceiver {
	enabled: boolean = true;
	private _connector: Connector;
	
	constructor() {
		this._connector = new Connector(this);
	}
	
	getConnector() {
		return this._connector;
	}
	
	/**
	 * Emit event.
	 * 
	 * Note that the event occurs for all transceivers connected to itself, but not for itself itself.
	 * 
	 * @param type Event type to emit.
	 * @param data Data you want to send.
	 */
	emit(type: string, data: any) {
		if (!this.enabled) {
			return;
		}
		
		this._connector.send(type, data);
		
		return this;
	}
	
	/**
	 * Register event.
	 * 
	 * @param type Event type.
	 * @param callback Callback when the event fires.
	 */
	on(type: string, callback: ITransceiverDelegate) {
		this._connector.on(type, callback);
		
		return this;
	}
	
	/**
	 * Register one-time event.
	 * 
	 * @param type Event type.
	 * @param callback Callback when the event fires.
	 */
	once(type: string, callback: ITransceiverDelegate) {
		this._connector.once(type, callback);
		
		return this;
	}
	
	/**
	 * Unregister event.
	 * 
	 * @param type Event type.
	 * @param callback Registered callback.
	 */
	off(type: string, callback: ITransceiverDelegate) {
		this._connector.off(type, callback);
		
		return this;
	}
	
	/**
	 * Remove events grouped event type.
	 * 
	 * @param type Event type to remove. If it is empty, removes all events.
	 */
	clear(type: string = '') {
		this._connector.clear(type);
		
		return this;
	}
	
	/**
	 * Connect to another transceiver.
	 * 
	 * This process establishes a bidirectional connection between the two associated transceivers.<br />
	 * Therefore, there is no need to switch positions and execute the process again.
	 * 
	 * @param transceiver Transceiver you want to connect.
	 */
	connect(transceiver: Transceiver) {
		const connector = transceiver.getConnector();
		
		this._connector.connect(connector);
		connector.connect(this._connector);
		
		return this;
	}
	
	/**
	 * Disconnect from another transceiver.
	 * 
	 * This process breaks the bidirectional connection between the two associated transceivers. <br />
	 * Therefore, there is no need to switch positions and process again.
	 * 
	 * @param transceiver Transceiver you want to disconnect.
	 */
	disconnect(transceiver: Transceiver) {
		const connector = transceiver.getConnector();
		
		this._connector.disconnect(connector);
		connector.disconnect(this._connector);
		
		return this;
	}
	
	/**
	 * Disconnect from all transceivers.
	 * 
	 * This process breaks the bidirectional connection between the two associated transceivers. <br />
	 * Therefore, there is no need to switch positions and process again.
	 * 
	 * @param transceiver Transceiver you want to disconnect.
	 */
	disconnectAll() {
		this._connector.disconnectAll();
		
		return this;
	}
	
	/**
	 * Create the specified number of transceivers and connect all the pairs.
	 * 
	 * @param amount Number of transceivers to create.
	 */
	static create(amount: number) {
		const transceivers: Transceiver[] = [];
		
		for (let i = 0; i < amount; i++) {
			transceivers.push(new Transceiver());
		}
		
		Transceiver.connect(transceivers);
		
		return transceivers;
	}
	
	/**
	 * Connects all pairs of specified transceivers.
	 * 
	 * @param transceivers Transceivers you want to connect
	 */
	static connect(transceivers: Transceiver[]) {
		for (let i = 0; i < transceivers.length; i++) {
			for (let j = i + 1; j < transceivers.length; j++) {
				transceivers[i].connect(transceivers[j]);
			}
		}
	}
}