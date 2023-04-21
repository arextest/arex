import { ArexPane, PanesData } from './ArexPane';

export class ArexPaneManager {
  private static panesMap: Map<string, ArexPane> = new Map<string, ArexPane>();

  public static getPanes(): Array<ArexPane> {
    return Array.from(this.panesMap.values());
  }

  public static getPanesMap(): Map<string, ArexPane> {
    return this.panesMap;
  }

  public static registerPanes(panesMap: { [key: string]: ArexPane }) {
    for (const name in panesMap) {
      const menu = panesMap[name];
      if (this.panesMap.has(menu.type)) continue;
      this.panesMap.set(menu.type, menu);
    }
  }

  public static getPaneByType<T extends PanesData>(type?: string): ArexPane<T> | undefined {
    return type ? this.panesMap.get(type) : undefined;
  }

  public static getMenuTypeByType(type?: string): string | undefined {
    const pane = this.getPaneByType(type);
    return pane ? pane.menuType : undefined;
  }

  public static getPanesByType(types: Array<string>): Array<ArexPane | undefined> {
    return types.map((item) => {
      return Object.values(this.panesMap).find((child) => {
        return child.type === item;
      });
    });
  }
}
