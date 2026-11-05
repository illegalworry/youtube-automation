import { registerAll } from '../_lib.js';
import { SPEC1 } from './spec1.js'; import { SPEC2 } from './spec2.js'; import { SPEC3 } from './spec3.js';
registerAll({ ...SPEC1, ...SPEC2, ...SPEC3 });
