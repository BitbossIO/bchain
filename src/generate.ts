import { BChain } from './index';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs';
import * as R from 'ramda';


var bchain = new BChain({ username:'multichainrpc', password:'6FvcobcXbS2UPXEmkVBof32B15fNMR9UPhVtUzvq6CCP' });
bchain.undefinedFunctions.forEach(x => console.log('\t'+x));

