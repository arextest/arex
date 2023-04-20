import { ArexPane, PanesData } from './ArexPane';

export class ArexPaneManager {
  private static panesMap: Record<string, ArexPane> = {};

  public static getPanes(): Array<ArexPane> {
    return Object.values(this.panesMap);
  }

  public static registerPanes(panesMap: { [key: string]: ArexPane }) {
    this.panesMap = {
      ...this.panesMap,
      ...panesMap,
    };
  }

  public static getPaneByType<T extends PanesData>(type?: string): ArexPane<T> | undefined {
    return type ? (this.panesMap[type] as ArexPane<T>) : undefined;
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
