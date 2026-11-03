// cast.js — one outfit per recurring character. One saturated signature item each, identical in every shot.
export const YOU   = { top: 'hoodie', color: '#d64a33', legs: '#2c3a5a', head: 'none' };            // the hero (coral hoodie, jeans)
export const WOMAN = { top: 'dress', color: '#8a5ad6', head: 'beanie', headColor: '#f29ac0' };      // woman at the bus stop (pink beanie)
export const GUARD = { top: 'suit', color: '#25304a', head: 'cap', headColor: '#3a6ea5' };          // bank guard (blue cap)
export const CYCLIST = { top: 'tracksuit', color: '#2f7d4a', head: 'cap', headColor: '#3fb950' };   // cyclist (green cap)
export const MUM = { top: 'dress', color: '#c0486a', head: 'bun' };                                  // family: mum
export const DAD = { top: 'tshirt', color: '#3a6ea5', head: 'none' };                                // family: dad
export const KID = { top: 'tshirt', color: '#f2c21a', head: 'none', kid: true };                     // family: little sibling (yellow tee)
export const COP = { top: 'suit', color: '#1d2a4a', head: 'cap', headColor: '#1d2a4a' };             // police officer
export const DOC = { top: 'labcoat', face: 'glasses', head: 'none' };                                // doctor
export const FRIEND = { top: 'tshirt', color: '#3a6ea5', head: 'cap', headColor: '#f2c21a' };        // best friend (yellow cap)
export const WELLS = { top: 'trench', color: '#2c2833', head: 'fedora', headColor: '#2c2833' };      // Victorian writer
export const SHEPHERD = { top: 'tshirt', color: '#b08a4a', head: 'none' };                            // Gyges
export const PLATO = { top: 'labcoat', head: 'none' };                                               // philosopher in white robe
export const PLAIN = { top: 'none', head: 'none' };                                                  // background people (plain ink)
export const CASTS = { YOU, WOMAN, GUARD, CYCLIST, MUM, DAD, KID, COP, DOC, FRIEND, WELLS, SHEPHERD, PLATO, PLAIN };
export const CAST = Object.values(CASTS);
