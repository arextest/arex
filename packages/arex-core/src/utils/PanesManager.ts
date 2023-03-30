import ArexPanes, { PanesData, PanesFC } from '../panes';

export class BlockManager {
  // @ts-ignore TODO
  private static blocksMap: Record<string, PanesFC> = {
    ...ArexPanes,
  };

  public static getBlocks(): Array<PanesFC> {
    return Object.values(this.blocksMap);
  }

  public static registerBlocks(blocksMap: { [key: string]: PanesFC }) {
    this.blocksMap = {
      ...this.blocksMap,
      ...blocksMap,
    };
  }

  public static getBlockByType<T extends PanesData>(type: string): PanesFC<T> | undefined {
    return this.blocksMap[type] as PanesFC<any> as PanesFC<T>;
  }

  public static getBlocksByType(types: Array<string>): Array<PanesFC | undefined> {
    return types.map((item) => {
      return Object.values(this.blocksMap).find((child) => {
        // @ts-ignore TODO
        return child.type === item;
      });
    });
  }
}
