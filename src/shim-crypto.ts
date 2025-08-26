import crypto from 'crypto';

// Solo asigna si globalThis.crypto no existe
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto;
}
