import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/do';
import {RxHR} from "@akanass/rx-http-request";

let isString = (val) => typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
let isObject = (val) => typeof val === 'object';

export class BChain {
	commands = {
		//general
		createMultiSig: ['nrequired', 'keys'],
		getInfo: [],
		getRuntimeParams: [],
		setRunTimeparam: ['param', 'value'],
		getBlockchainParams: [],
		help: [],
		stop: [],
		validateAddress: ['address'],
		createKeyPairs: [{'count': 1}],
		//wallet addresses
		addMultiSigAddress: ['nrequired', 'keys'],
		dumpPrivKey: ['address'],
		getAddresses: [{'verbose': false}],
		getNewAddress: [],
		importAddress: ['address', {'label': ''}, {'rescan': true}],
		listAddresses: [],
		//permissions
		grant: ['addresses', 'permissions',
		{'native-amount':null}, {'start-block': null}, {'end-block': null}, {'comment': null}, {'comment-to': null}],
		grantFrom: ['from', 'to', 'permissions',
		{'native-amount':null}, {'start-block': null}, {'end-block': null}, {'comment': null}, {'comment-to': null}],
		grantWithData: ['addresses', 'permissions', 'data', {'native-amount':null}, {'start-block': null}, {'end-block': null}],
		grantWithMetadata: ['addresses', 'permissions', 'data', {'native-amount':null}, {'start-block': null}, {'end-block': null}],
		grantWithDatafrom:['from', 'to', 'permissions', 'data', {'native-amount':null}, {'start-block': null}, {'end-block': null}],
		grantWithMetadataFrom: ['from', 'to', 'permissions', 'data', {'native-amount':null}, {'start-block': null}, {'end-block': null}],
		listPermissions: [{'permissions': 'all'}, {'addresses': '*'}, {'verbose': false}],
		revoke: ['addresses', 'permissions', {'native-amount':0}, {'comment': ''}, {'comment-to': ''}],
		revokeFrom: ['from', 'to', 'permissions', {'native-amount':0}, {'comment': ''}, {'comment-to': ''}],
		//assets
		issue: ['address', 'asset', 'qty', {'units': 1}, {'native-amount':0}, {'details': {}}],
		issueFrom: ['from', 'to', 'asset', 'qty', {'units': 1}, {'native-amount': 0}, {'details': {}}],
		issueMore: ['address', 'asset', 'qty', {'native-amount':0}, {'details': {}}],
		issueMoreFrom: ['from', 'to', 'asset', 'qty', {'native-amount':0}, {'details': {}}],
		listAssets: [{'asset': ''}, {'verbose': false}, {'count': 10}, {'start': -10}],
		//querying
		getAddressBalances: ['address', {'minconf': 1}, {'includeLocked': false}],
		getAddressTransaction: ['address', 'txid', {'verbose': false}],
		getMultiBalances: [{'addresses': '*'}, {'assets': []}, {'minconf':1}, {'includeWatchOnly': false}, {'includeLocked': false}],
		getTotalBalances: [{'minconf': 1}, {'includeWatchOnly': false}, {'includeLocked': false}],
		getWalletTransaction: ['txid', {'includeWatchOnly': false}, {'verbose': false}],
		listAddressTransactions: ['address', {'count': 10}, {'skip': 0}, {'verbose': false}],
		listWalletTransactions: [{'count': 10}, {'skip': 0}, {'includeWatchOnly': false}, {'verbose': false}],
		//querying subscribed assets
		getAsseTtransaction: ['asset', 'txid', {'verbose': false}],
		listAssetTransactions: ['asset', {'verbose': false}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		//sending
		sendAssetFrom: ['from', 'to', 'asset', 'qty', {'native-amount':0}, {'comment': ''}, {'comment-to': ''}],
		sendAsset: ['address', 'asset', 'qty', {'native-amount': 0}, {'comment': ''}, {'comment-to': ''}],
		sendAssetToAddress: ['address', 'asset', 'qty', {'native-amount': 0}, {'comment': ''}, {'comment-to': ''}],
		sendFrom: ['from', 'to', 'amount', {'comment': ''}, {'comment-to': ''}],
		sendFromAddress: ['from', 'to', 'amount', {'comment': ''}, {'comment-to': ''}],
		send: ['address', 'amount', {'comment': ''}, {'comment-to': ''}],
		sendToAddress: ['address', 'amount', {'comment': ''}, {'comment-to': ''}],
		sendwithData: ['address', 'amount', 'data'],
		sendWithMetadata: ['address', 'amount', 'data'],
		sendwithDataFrom: ['address', 'amount', 'data'],
		sendWithMetadataFrom: ['from', 'to', 'amount', 'data'],
		//atomic exchange
		appendRawExchange: ['hexstring', 'txid', 'vout', 'assets'],
		completeRawExchange: ['hexstring', 'txid', 'vout', 'assets', 'data'],
		createRawExchange: ['txid', 'vout', 'assets'],
		decodeRawExchange: ['hexstring', {'verbose': false}],
		disableRawTransaction: ['hexstring'],
		prepareLockUnspent: ['assets', {'lock': true}],
		prepareLockUnspentFrom: ['from', 'assets', {'lock': true}],
		//stream management
		create: [{'type': 'stream'}, 'name', 'open', {'details': {}}],
		createFrom: ['from', {'type': 'stream'}, 'name', 'open', {'details': {}}],
		listStreams: [{'stream': '*'}, {'verbose': 'false'}, {'count': undefined}, {'start': undefined}],
		subscribe: ['stream', {'rescan': true}],
		unsubscribe: ['stream'],
		//querying stream items
		getTxOutData: ['txid', 'vout'],
		listStreamKeyItems: ['stream', 'key', {'verbose': 'false'}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		listStreamKeys: ['stream', {'key': '*'}, {'verbose': 'false'}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		listStreamItems: ['stream', {'verbose': 'false'}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		listStreamPublisherItems: ['stream', 'address', {'verbose': 'false'}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		listStreamPublishers: ['stream', {'address': '*'}, {'verbose': 'false'}, {'count': 10}, {'start': -10}, {'local-ordering': false}],
		getStreamItem: ['stream', 'txid', {'verbose': 'false'}],
		//publishing stream items
		publish: ['stream', 'key', 'data'],
		publishFrom: ['from', 'stream', 'key', 'data'],
		//unspent
		combineUnspent: [{'addresses': '*'}, {'minconf': 1}, {'maxcombines': 1}, {'mininputs': 10}, {'maxinputs': 100}, {'maxtime': 30}],
		listLockUnspent: [],
		listUnspent: [{'minconf': 1}, {'maxconf': 999999}, {'receivers': []}],
		lockUnspent: ['unlock', {'outputs': []}],
		//raw tx
		appendRawChange: ['hexstring', 'address', {'native-fee': undefined}],
		appendRawData: ['tx', 'data'],
		appendRawMetadata: ['tx', 'data'],
		appendRawTransaction: ['tx', 'inputs', 'amounts', {'data': null}, {'action': null}],
		decodeScript: ['script-hex'], 

		createRawTransaction: ['inputs', 'amounts', {'data': null}, {'action': null}, ],
		createRawSendFrom: ['from', 'to'],
		decodeRawTransaction: ['hexstring'],
		sendRawTransaction: ['hexstring'],
		signRawTransaction: ['hexstring', {'parents': null}, {'privatekeys': null}, {'sighashtype': null}],
		searchRawTransactions: ['address', {'verbose': 1}, {'skip': 0}, {'count': 100}],
		//p2p
		addNode: ['node', 'command'], // "node" "add"|"remove"|"onetry"
		getAddedNodeinfo: ['dns', {'verbose': ''}, ],
		getconnectioncount: [],
		getnettotals: [],
		getNetworkInfo: [],
		getPeerInfo: [],
		ping: [],
		//messaging
		signMessage: ['address', 'message'],
		verifyMessage: ['address', 'signature', 'message'],
		//blockchain query
		getBlock: ['hash', {'format': true}],
		getBlockHash: ['height'],
		getBlockCount: [],
		getBestBlockHash: [],
		getBlockchainInfo: [],
		getChainTips: [],
		getdifficulty: [],
		getmempoolinfo: [],
		getrawmempool: [{'verbose': 0}],
		listblocks: ['block-set-identifier', {'verbose': 0}],
		listupgrades: [{'upgrade-identifiers': '*'}],
		verifychain: [{'checklevel': 3}, {'numblocks': 288}],


		getRawTransaction: ['txid', {'verbose': 0}],
		getTxOut: ['txid', 'vout', {'unconfirmed': false}],

		//advanced node control
		clearMemPool: [],
		pause: ['tasks'],
		resume: ['tasks'],
		setLastBlock: ['hash'],


		//mining
		getMiningInfo: [],
		getgenerate: [],
		gethashespersec: [],
		setgenerate: ['generate', {'genproclimit': ''},], 

		//advanced wallet control
		backupWallet: ['filename'],
		dumpWallet: ['filename'],
		encryptWallet: ['passphrase'],
		getWalletInfo: [],
		importPrivKey: ['privkey', {'label': ''}, {'rescan': true}],
		importWallet: ['filename'],
		walletLock: [],
		walletPassphrase: ['passphrase', 'timeout'],
		walletPassphraseChange: ['old-passphrase', 'new-passphrase']
	};

	undefinedFunctions: string[];
	constructor (public auth, public url='http://localhost:2890/') {
		this.undefinedFunctions = Object.keys(this.commands).map(method => {
			if(this[method]) return;
			let commands: [object|string] = this.commands[method];
			this[method] = (args): Observable<Object> => this.call(method.toLowerCase(), args);
			return this.getFunctionString(method, commands);
		})
		.filter(item => item !== undefined)
		.sort((a, b) => a.localeCompare(b));
	}
	private parseParams (method, args): any[] {
		let commandParams = this.commands[method];
		return commandParams.map(arg => {
			if (isString(arg)) return args[arg];
			if (isObject(arg)) {
				let key = Object.keys(arg)[0];
				let value = args[key];
				return (typeof value !== 'undefined')? value : arg[key]; // default
			}
		});
	}
	private getFunctionString(method: string, params: [object|string]) {
		let defaultToStr = (d) => isString(d)?`'${d}'`:(Array.isArray(d)?'[]':(isObject(d)?'{}':d));
		let getDefaultStr = (param) => '='+defaultToStr(param[Object.keys(param)[0]]);
		let fixStr = (param:string, addDefault=false) => param.toString().replace(/-/g, '_');
		let toStr = (param:object|string, addDefault=false) => (typeof param === 'string')? 
				fixStr(param): fixStr(Object.keys(param)[0])+(addDefault?getDefaultStr(param):'');
		let toParams = (str, v:object|string, i, arr) => str+toStr(v, true)+(i===(arr.length-1)?'':', '); // TODO: add default
		let toArray = (str, v:object|string, i, arr) => str+toStr(v)+(i===(arr.length-1)?'':', '); 
		return method+'('+params.reduce(toParams, '')+'): Observable<any> { return this.call(\''+method.toLowerCase()
				+'\', ['+params.reduce(toArray, '')+']);}';
	}

	call(method, args=null): Observable<any> {
		// console.log("getIfno::: ", arguments.callee.toString() );
		let params: any[] = args? Array.isArray(args)? args: this.parseParams(method, args): [];
		let payload = {method: method, params: params, id: 1, jsonrpc: '2.0'};
		return RxHR.post(this.url, {
				json: true,
				body: payload,
				auth: this.auth
			})
			.map(data => {
				if(data.response.statusCode !== 200) {
					let body = '';
					try {body = JSON.stringify(data.response.body.error)} catch(err) {}
					throw new Error(`${data.response.statusCode} ${data.response.statusMessage} `+body);
				}
				return data.response.body;
			})
			.map(body => body.result)
			;
	}

	/**
	*	Below is the set of auto-generated functions.
	*/
	addMultiSigAddress(nrequired, keys): Observable<any> { return this.call('addmultisigaddress', [nrequired, keys]);}
	addNode(node, command): Observable<any> { return this.call('addnode', [node, command]);}
	appendRawChange(hexstring, address, native_fee=undefined): Observable<any> { return this.call('appendrawchange', [hexstring, address, native_fee]);}
	appendRawData(tx, data): Observable<any> { return this.call('appendrawdata', [tx, data]);}
	appendRawExchange(hexstring, txid, vout, assets): Observable<any> { return this.call('appendrawexchange', [hexstring, txid, vout, assets]);}
	appendRawMetadata(tx, data): Observable<any> { return this.call('appendrawmetadata', [tx, data]);}
	appendRawTransaction(tx, inputs, amounts, data={}, action={}): Observable<any> { return this.call('appendrawtransaction', [tx, inputs, amounts, data, action]);}
	backupWallet(filename): Observable<any> { return this.call('backupwallet', [filename]);}
	clearMemPool(): Observable<any> { return this.call('clearmempool', []);}
	combineUnspent(addresses='*', minconf=1, maxcombines=1, mininputs=10, maxinputs=100, maxtime=30): Observable<any> { return this.call('combineunspent', [addresses, minconf, maxcombines, mininputs, maxinputs, maxtime]);}
	completeRawExchange(hexstring, txid, vout, assets, data): Observable<any> { return this.call('completerawexchange', [hexstring, txid, vout, assets, data]);}
	create(type='stream', name, open, details={}): Observable<any> { return this.call('create', [type, name, open, details]);}
	createFrom(from, type='stream', name, open, details={}): Observable<any> { return this.call('createfrom', [from, type, name, open, details]);}
	createKeyPairs(count=1): Observable<any> { return this.call('createkeypairs', [count]);}
	createMultiSig(nrequired, keys): Observable<any> { return this.call('createmultisig', [nrequired, keys]);}
	createRawExchange(txid, vout, assets): Observable<any> { return this.call('createrawexchange', [txid, vout, assets]);}
	createRawSendFrom(from, to): Observable<any> { return this.call('createrawsendfrom', [from, to]);}
	createRawTransaction(inputs, amounts, data={}, action={}): Observable<any> { return this.call('createrawtransaction', [inputs, amounts, data, action]);}
	decodeRawExchange(hexstring, verbose=false): Observable<any> { return this.call('decoderawexchange', [hexstring, verbose]);}
	decodeRawTransaction(hexstring): Observable<any> { return this.call('decoderawtransaction', [hexstring]);}
	decodeScript(script_hex): Observable<any> { return this.call('decodescript', [script_hex]);}
	disableRawTransaction(hexstring): Observable<any> { return this.call('disablerawtransaction', [hexstring]);}
	dumpPrivKey(address): Observable<any> { return this.call('dumpprivkey', [address]);}
	dumpWallet(filename): Observable<any> { return this.call('dumpwallet', [filename]);}
	encryptWallet(passphrase): Observable<any> { return this.call('encryptwallet', [passphrase]);}
	getAddedNodeinfo(dns, verbose=''): Observable<any> { return this.call('getaddednodeinfo', [dns, verbose]);}
	getAddressBalances(address, minconf=1, includeLocked=false): Observable<any> { return this.call('getaddressbalances', [address, minconf, includeLocked]);}
	getAddresses(verbose=false): Observable<any> { return this.call('getaddresses', [verbose]);}
	getAddressTransaction(address, txid, verbose=false): Observable<any> { return this.call('getaddresstransaction', [address, txid, verbose]);}
	getAsseTtransaction(asset, txid, verbose=false): Observable<any> { return this.call('getassettransaction', [asset, txid, verbose]);}
	getBestBlockHash(): Observable<any> { return this.call('getbestblockhash', []);}
	getBlock(hash, format=true): Observable<any> { return this.call('getblock', [hash, format]);}
	getBlockchainInfo(): Observable<any> { return this.call('getblockchaininfo', []);}
	getBlockchainParams(): Observable<any> { return this.call('getblockchainparams', []);}
	getBlockCount(): Observable<any> { return this.call('getblockcount', []);}
	getBlockHash(height): Observable<any> { return this.call('getblockhash', [height]);}
	getChainTips(): Observable<any> { return this.call('getchaintips', []);}
	getconnectioncount(): Observable<any> { return this.call('getconnectioncount', []);}
	getdifficulty(): Observable<any> { return this.call('getdifficulty', []);}
	getgenerate(): Observable<any> { return this.call('getgenerate', []);}
	gethashespersec(): Observable<any> { return this.call('gethashespersec', []);}
	getInfo(): Observable<any> { return this.call('getinfo', []);}
	getmempoolinfo(): Observable<any> { return this.call('getmempoolinfo', []);}
	getMiningInfo(): Observable<any> { return this.call('getmininginfo', []);}
	getMultiBalances(addresses='*', assets=[], minconf=1, includeWatchOnly=false, includeLocked=false): Observable<any> { return this.call('getmultibalances', [addresses, assets, minconf, includeWatchOnly, includeLocked]);}
	getnettotals(): Observable<any> { return this.call('getnettotals', []);}
	getNetworkInfo(): Observable<any> { return this.call('getnetworkinfo', []);}
	getNewAddress(): Observable<any> { return this.call('getnewaddress', []);}
	getPeerInfo(): Observable<any> { return this.call('getpeerinfo', []);}
	getrawmempool(verbose=0): Observable<any> { return this.call('getrawmempool', [verbose]);}
	getRawTransaction(txid, verbose=0): Observable<any> { return this.call('getrawtransaction', [txid, verbose]);}
	getRuntimeParams(): Observable<any> { return this.call('getruntimeparams', []);}
	getStreamItem(stream, txid, verbose='false'): Observable<any> { return this.call('getstreamitem', [stream, txid, verbose]);}
	getTotalBalances(minconf=1, includeWatchOnly=false, includeLocked=false): Observable<any> { return this.call('gettotalbalances', [minconf, includeWatchOnly, includeLocked]);}
	getTxOut(txid, vout, unconfirmed=false): Observable<any> { return this.call('gettxout', [txid, vout, unconfirmed]);}
	getTxOutData(txid, vout): Observable<any> { return this.call('gettxoutdata', [txid, vout]);}
	getWalletInfo(): Observable<any> { return this.call('getwalletinfo', []);}
	getWalletTransaction(txid, includeWatchOnly=false, verbose=false): Observable<any> { return this.call('getwallettransaction', [txid, includeWatchOnly, verbose]);}
	grant(addresses, permissions, native_amount={}, start_block={}, end_block={}, comment={}, comment_to={}): Observable<any> { return this.call('grant', [addresses, permissions, native_amount, start_block, end_block, comment, comment_to]);}
	grantFrom(from, to, permissions, native_amount={}, start_block={}, end_block={}, comment={}, comment_to={}): Observable<any> { return this.call('grantfrom', [from, to, permissions, native_amount, start_block, end_block, comment, comment_to]);}
	grantWithData(addresses, permissions, data, native_amount={}, start_block={}, end_block={}): Observable<any> { return this.call('grantwithdata', [addresses, permissions, data, native_amount, start_block, end_block]);}
	grantWithDatafrom(from, to, permissions, data, native_amount={}, start_block={}, end_block={}): Observable<any> { return this.call('grantwithdatafrom', [from, to, permissions, data, native_amount, start_block, end_block]);}
	grantWithMetadata(addresses, permissions, data, native_amount={}, start_block={}, end_block={}): Observable<any> { return this.call('grantwithmetadata', [addresses, permissions, data, native_amount, start_block, end_block]);}
	grantWithMetadataFrom(from, to, permissions, data, native_amount={}, start_block={}, end_block={}): Observable<any> { return this.call('grantwithmetadatafrom', [from, to, permissions, data, native_amount, start_block, end_block]);}
	help(): Observable<any> { return this.call('help', []);}
	importAddress(address, label='', rescan=true): Observable<any> { return this.call('importaddress', [address, label, rescan]);}
	importPrivKey(privkey, label='', rescan=true): Observable<any> { return this.call('importprivkey', [privkey, label, rescan]);}
	importWallet(filename): Observable<any> { return this.call('importwallet', [filename]);}
	issue(address, asset, qty, units=1, native_amount=0, details={}): Observable<any> { return this.call('issue', [address, asset, qty, units, native_amount, details]);}
	issueFrom(from, to, asset, qty, units=1, native_amount=0, details={}): Observable<any> { return this.call('issuefrom', [from, to, asset, qty, units, native_amount, details]);}
	issueMore(address, asset, qty, native_amount=0, details={}): Observable<any> { return this.call('issuemore', [address, asset, qty, native_amount, details]);}
	issueMoreFrom(from, to, asset, qty, native_amount=0, details={}): Observable<any> { return this.call('issuemorefrom', [from, to, asset, qty, native_amount, details]);}
	listAddresses(): Observable<any> { return this.call('listaddresses', []);}
	listAddressTransactions(address, count=10, skip=0, verbose=false): Observable<any> { return this.call('listaddresstransactions', [address, count, skip, verbose]);}
	listAssets(asset='', verbose=false, count=10, start=-10): Observable<any> { return this.call('listassets', [asset, verbose, count, start]);}
	listAssetTransactions(asset, verbose=false, count=10, start=-10, local_ordering=false): Observable<any> { return this.call('listassettransactions', [asset, verbose, count, start, local_ordering]);}
	listblocks(block_set_identifier, verbose=0): Observable<any> { return this.call('listblocks', [block_set_identifier, verbose]);}
	listLockUnspent(): Observable<any> { return this.call('listlockunspent', []);}
	listPermissions(permissions='all', addresses='*', verbose=false): Observable<any> { return this.call('listpermissions', [permissions, addresses, verbose]);}
	listStreamItems(stream, verbose='false', count=10, start=-10, local_ordering=false): Observable<any> { return this.call('liststreamitems', [stream, verbose, count, start, local_ordering]);}
	listStreamKeyItems(stream, key, verbose='false', count=10, start=-10, local_ordering=false): Observable<any> { return this.call('liststreamkeyitems', [stream, key, verbose, count, start, local_ordering]);}
	listStreamKeys(stream, key='*', verbose='false', count=10, start=-10, local_ordering=false): Observable<any> { return this.call('liststreamkeys', [stream, key, verbose, count, start, local_ordering]);}
	listStreamPublisherItems(stream, address, verbose='false', count=10, start=-10, local_ordering=false): Observable<any> { return this.call('liststreampublisheritems', [stream, address, verbose, count, start, local_ordering]);}
	listStreamPublishers(stream, address='*', verbose='false', count=10, start=-10, local_ordering=false): Observable<any> { return this.call('liststreampublishers', [stream, address, verbose, count, start, local_ordering]);}
	listStreams(stream='*', verbose='false', count=undefined, start=undefined): Observable<any> { return this.call('liststreams', [stream, verbose, count, start]);}
	listUnspent(minconf=1, maxconf=999999, receivers=[]): Observable<any> { return this.call('listunspent', [minconf, maxconf, receivers]);}
	listupgrades(upgrade_identifiers='*'): Observable<any> { return this.call('listupgrades', [upgrade_identifiers]);}
	listWalletTransactions(count=10, skip=0, includeWatchOnly=false, verbose=false): Observable<any> { return this.call('listwallettransactions', [count, skip, includeWatchOnly, verbose]);}
	lockUnspent(unlock, outputs=[]): Observable<any> { return this.call('lockunspent', [unlock, outputs]);}
	pause(tasks): Observable<any> { return this.call('pause', [tasks]);}
	ping(): Observable<any> { return this.call('ping', []);}
	prepareLockUnspent(assets, lock=true): Observable<any> { return this.call('preparelockunspent', [assets, lock]);}
	prepareLockUnspentFrom(from, assets, lock=true): Observable<any> { return this.call('preparelockunspentfrom', [from, assets, lock]);}
	publish(stream, key, data): Observable<any> { return this.call('publish', [stream, key, data]);}
	publishFrom(from, stream, key, data): Observable<any> { return this.call('publishfrom', [from, stream, key, data]);}
	resume(tasks): Observable<any> { return this.call('resume', [tasks]);}
	revoke(addresses, permissions, native_amount=0, comment='', comment_to=''): Observable<any> { return this.call('revoke', [addresses, permissions, native_amount, comment, comment_to]);}
	revokeFrom(from, to, permissions, native_amount=0, comment='', comment_to=''): Observable<any> { return this.call('revokefrom', [from, to, permissions, native_amount, comment, comment_to]);}
	searchRawTransactions(address, verbose=1, skip=0, count=100): Observable<any> { return this.call('searchrawtransactions', [address, verbose, skip, count]);}
	send(address, amount, comment='', comment_to=''): Observable<any> { return this.call('send', [address, amount, comment, comment_to]);}
	sendAsset(address, asset, qty, native_amount=0, comment='', comment_to=''): Observable<any> { return this.call('sendasset', [address, asset, qty, native_amount, comment, comment_to]);}
	sendAssetFrom(from, to, asset, qty, native_amount=0, comment='', comment_to=''): Observable<any> { return this.call('sendassetfrom', [from, to, asset, qty, native_amount, comment, comment_to]);}
	sendAssetToAddress(address, asset, qty, native_amount=0, comment='', comment_to=''): Observable<any> { return this.call('sendassettoaddress', [address, asset, qty, native_amount, comment, comment_to]);}
	sendFrom(from, to, amount, comment='', comment_to=''): Observable<any> { return this.call('sendfrom', [from, to, amount, comment, comment_to]);}
	sendFromAddress(from, to, amount, comment='', comment_to=''): Observable<any> { return this.call('sendfromaddress', [from, to, amount, comment, comment_to]);}
	sendRawTransaction(hexstring): Observable<any> { return this.call('sendrawtransaction', [hexstring]);}
	sendToAddress(address, amount, comment='', comment_to=''): Observable<any> { return this.call('sendtoaddress', [address, amount, comment, comment_to]);}
	sendwithData(address, amount, data): Observable<any> { return this.call('sendwithdata', [address, amount, data]);}
	sendwithDataFrom(address, amount, data): Observable<any> { return this.call('sendwithdatafrom', [address, amount, data]);}
	sendWithMetadata(address, amount, data): Observable<any> { return this.call('sendwithmetadata', [address, amount, data]);}
	sendWithMetadataFrom(from, to, amount, data): Observable<any> { return this.call('sendwithmetadatafrom', [from, to, amount, data]);}
	setgenerate(generate, genproclimit=''): Observable<any> { return this.call('setgenerate', [generate, genproclimit]);}
	setLastBlock(hash): Observable<any> { return this.call('setlastblock', [hash]);}
	setRunTimeparam(param, value): Observable<any> { return this.call('setruntimeparam', [param, value]);}
	signMessage(address, message): Observable<any> { return this.call('signmessage', [address, message]);}
	signRawTransaction(hexstring, parents={}, privatekeys={}, sighashtype={}): Observable<any> { return this.call('signrawtransaction', [hexstring, parents, privatekeys, sighashtype]);}
	stop(): Observable<any> { return this.call('stop', []);}
	subscribe(stream, rescan=true): Observable<any> { return this.call('subscribe', [stream, rescan]);}
	unsubscribe(stream): Observable<any> { return this.call('unsubscribe', [stream]);}
	validateAddress(address): Observable<any> { return this.call('validateaddress', [address]);}
	verifychain(checklevel=3, numblocks=288): Observable<any> { return this.call('verifychain', [checklevel, numblocks]);}
	verifyMessage(address, signature, message): Observable<any> { return this.call('verifymessage', [address, signature, message]);}
	walletLock(): Observable<any> { return this.call('walletlock', []);}
	walletPassphrase(passphrase, timeout): Observable<any> { return this.call('walletpassphrase', [passphrase, timeout]);}
	walletPassphraseChange(old_passphrase, new_passphrase): Observable<any> { return this.call('walletpassphrasechange', [old_passphrase, new_passphrase]);}
	/**
	*	End auto-generated functions.
	*/



}