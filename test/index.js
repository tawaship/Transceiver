const assert = require('assert');
const { Transceiver } = require('../');

describe('Transceiver', () => {
	it('basic', () => {
		const A = new Transceiver();
		const B = new Transceiver();
		const C = new Transceiver();
		
		A.connect(B);
		A.connect(C);
		B.connect(C);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 12);
	});
	
	it('connect helper', () => {
		const A = new Transceiver();
		const B = new Transceiver();
		const C = new Transceiver();
		
		Transceiver.connect([ A, B, C ]);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 12);
	});
	
	it('create helper', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 12);
	});
	
	it('disconnect', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.disconnect(B);
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 9);
	});
	
	it('disconnect all', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.disconnectAll();
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 10);
	});
	
	it('enabled', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.enabled = false;
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		A.enabled = true;
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 17);
	});
	
	it('once', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.once('hoge', f);
		B.once('hoge', f);
		C.once('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 4);
	});
	
	it('off', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.on('hoge', f);
		B.on('hoge', f);
		C.on('hoge', f);
		
		A.off('hoge', f);
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 7);
	});
	
	it('clear', () => {
		const [ A, B, C ] = Transceiver.create(3);
		
		let total = 0;
		const f = e => {
			total += e.data;
		};
		
		A.once('hoge', f);
		B.once('hoge', f);
		C.once('hoge', f);
		
		A.clear();
		
		A.emit('hoge', 1);
		B.emit('hoge', 2);
		C.emit('hoge', 3);
		
		assert.equal(total, 2);
	});
});