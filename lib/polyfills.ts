// Must be the FIRST import in app/_layout.tsx (before every other import,
// including relative ones like stores/*). ES module imports are hoisted to
// the top of the file at execution time regardless of where they're written
// in source, so putting this code inline in _layout.tsx does NOT guarantee
// it runs before other imports in that same file — any import listed above
// or below it still executes first. Isolating it in its own module and
// making that module the first import is what actually guarantees order:
// this file's imports/side effects run, then control returns and the next
// import in _layout.tsx begins.
import { Buffer } from 'buffer';

// Unconditional — if anything else set a partial/stub global.Buffer before
// this line runs, `global.Buffer = global.Buffer || Buffer` would keep that
// stub and silently drop methods like .alloc, which @ton/core calls at
// module-load time (Cell.EMPTY = new Cell()), causing "undefined is not a
// function" deep in its dependency chain with no clear error at the actual
// point of failure.
global.Buffer = Buffer;

import { TextEncoder, TextDecoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import 'react-native-get-random-values';