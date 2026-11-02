// cast.js — one outfit per recurring character. Each has ONE signature colour + one head item, kept all video.
export const SAM = { top: 'hoodie', color: '#e8c04a', head: 'short', hairColor: '#1a1a1a', pants: '#24272e' };            // hero "du": yellow hoodie
export const JONAS = { top: 'hoodie', color: '#3f9a5a', head: 'capBack', headColor: '#f08a2c', pants: '#2c4a8a' };       // best friend: green hoodie, orange cap backwards
export const LEO = { top: 'hoodie', color: '#b8bcc2', head: 'short', face: 'glasses', pants: '#2c3a5a' };                // new colleague: grey hoodie, glasses
export const BRANDT = { top: 'jacket', color: '#9a5ad0', color2: '#24272e', head: 'none', face: 'sunglasses', pants: '#24272e', stripe: false }; // villain: purple suit, sunglasses
export const CHEF = { top: 'jacket', color: '#3f63c8', head: 'none', face: 'glasses', pants: '#2c3a5a', stripe: false };   // boss: blue jacket
export const LEHRER = { top: 'sweater', color: '#a0703c', head: 'none', face: 'glasses', pants: '#4a3a2c', stripe: false }; // teacher: brown sweater
export const VERKAEUFERIN = { top: 'hoodie', color: '#d6533c', head: 'bun', pants: '#24272e' };                          // bakery: red hoodie, bun
export const KELLNER = { top: 'tee', color: '#f2efe6', head: 'short', pants: '#24272e', stripe: false };                 // waiter: white shirt
export const FAHRER = { top: 'jacket', color: '#5bb4c8', head: 'cap', headColor: '#2c3a5a', pants: '#2c3a5a' };          // bus driver
export const KIND = { top: 'hoodie', color: '#e86aa0', head: 'ponytail', kid: true };                                    // kid with ice cream
export const NORMAL = { top: 'hoodie', color: '#8a8f98', head: 'beanie', headColor: '#4a4f58', pants: '#2c3a5a' };       // "normal person" for comparisons
export const SAENGERIN = { top: 'hoodie', color: '#9a5ad0', head: 'afro', pants: '#24272e' };                            // singer
export const FOTOGRAF = { top: 'jacket', color: '#4a4f58', head: 'beanie', headColor: '#d6533c', pants: '#24272e' };
export const SAM_KID = { ...SAM, kid: true };
export const JONAS_KID = { ...JONAS, kid: true };

// background extras (fans, passengers, audience) — pick by index
export const EXTRAS = [
  { top: 'hoodie', color: '#5bb4c8', head: 'headband', headColor: '#e0503a', pants: '#4a3a2c' },
  { top: 'tee', color: '#d6533c', head: 'afro', pants: '#2c4a8a' },
  { top: 'jacket', color: '#3f63c8', head: 'cap', headColor: '#e8c04a', pants: '#24272e' },
  { top: 'sweater', color: '#e8a0b4', head: 'bun', pants: '#2c3a5a' },
  { top: 'hoodie', color: '#7ac46a', head: 'beanie', headColor: '#3a6ee0', pants: '#24272e' },
  { top: 'tee', color: '#f08a2c', head: 'spiky', pants: '#2c4a8a' },
  { top: 'hoodie', color: '#4a4f58', head: 'ponytail', pants: '#4a3a2c' },
];
