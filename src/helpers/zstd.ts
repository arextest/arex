// @ts-ignore
import { Zstd } from '@hpcc-js/wasm/zstd';

export async function compressedData(str: string) {
  const zstd = await Zstd.load();
  const data = new TextEncoder().encode(str);
  const compressed_data = zstd.compress(data);
  return window.btoa(compressed_data);
}
