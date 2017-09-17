import bChain from './lib/bchain';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs';
import * as R from 'ramda';


var bchain = new bChain({ username:'multichainrpc', password:'6FvcobcXbS2UPXEmkVBof32B15fNMR9UPhVtUzvq6CCP' });
class MyObserver implements Rx.Observer < any > {
	constructor(public name) {}
	complete(): void {
		console.log(`[${this.name}] Completed`);
	}
	error(err: any): void {
		console.log(`[${this.name}] Error: ${err}`);
	}
	next(value: any): void {
		console.log(`[${this.name}] Next: `, value);
	}
}
// let test = observer => observer.subscribe(new MyObserver('test'));

function runBasicTests() {
	bchain.getInfo().subscribe(new MyObserver('getInfo'));
	// bchain.searchRawTransactions('1Ur2ph9i9uSHM2c5WKHctB15qDrSPQ5bu9gM4c').subscribe(new MyObserver('getInfo'));
}

function runRxjsTests() {
	let getAssets = R.map((x: any) => x.vout[0].assets); 
	bchain.searchRawTransactions('1Ur2ph9i9uSHM2c5WKHctB15qDrSPQ5bu9gM4c')
		.map(x => x.result)
		.map(getAssets)
		.subscribe(new MyObserver('searchRawTransactions'));
}

function runUnimplementedTests() {
	// examples for unimplemented calls
	( < any > bchain).getRuntimeParams().subscribe(new MyObserver('getRuntimeParams'));
	bchain.call('searchrawtransactions', ['1Ur2ph9i9uSHM2c5WKHctB15qDrSPQ5bu9gM4c']).subscribe(new MyObserver('searchrawtransactions'));
}

runRxjsTests();

bchain.undefinedFunctions.forEach(x => console.log('\t'+x));

