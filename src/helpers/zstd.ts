// @ts-ignore
import { Zstd } from '@hpcc-js/wasm/zstd';
import { Base64 } from 'js-base64';
export async function compressedData(str: string) {
  const zstd = await Zstd.load();
  const data = new TextEncoder().encode(str);
  const compressed_data = zstd.compress(data);
  return Base64.fromUint8Array(compressed_data);
}
