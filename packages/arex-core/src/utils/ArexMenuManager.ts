import { ArexMenu } from '../menus';

export class ArexMenuManager {
  private static menusMap: Map<string, ArexMenu> = new Map();

  public static getMenus(): Array<ArexMenu> {
    return Array.from(this.menusMap.values());
  }

  public static getMenusMap(): Map<string, ArexMenu> {
    return this.menusMap;
  }

  public static registerMenus(menusMap: { [Modal: string]: ArexMenu }) {
    console.dir(menusMap['AppSettingMenu']);
    for (const name in menusMap) {
      const menu = menusMap[name];
      // console.log(this.menusMap, menusMap, name, menu.type);
      if (this.menusMap.has(menu.type)) {
        console.log(`Menu ${menu.type} already exists, please check!`);
        // continue;
      }
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
