import { ArexMenu } from './ArexMenu';

export class ArexMenuManager {
  private static menusMap: Map<string, ArexMenu> = new Map();

  public static getMenus(): Array<ArexMenu> {
    return Array.from(this.menusMap.values());
  }

  public static getMenusMap(): Map<string, ArexMenu> {
    return this.menusMap;
  }

  public static registerMenus(menusMap: { [Modal: string]: ArexMenu }) {
    for (const name in menusMap) {
      const menu = menusMap[name];
      if (this.menusMap.has(menu.type)) continue;
      this.menusMap.set(menu.type, menu);
    }
  }

  public static getMenuByType(type?: string): ArexMenu | undefined {
    return type ? this.menusMap.get(type) : undefined;
  }

  public static getMenusByType(types: Array<string>): Array<ArexMenu | undefined> {
    return types.map((item) => {
      return Object.values(this.menusMap).find((child) => {
        return child.type === item;
      });
    });
  }
}
