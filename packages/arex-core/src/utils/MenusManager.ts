import ArexMenus, { ArexMenu } from '../menus';

export class MenusManager {
  private static menusMap: Record<string, ArexMenu> = {
    ...ArexMenus,
  };

  public static getMenus(): Array<ArexMenu> {
    return Object.values(this.menusMap);
  }

  public static registerMenus(menusMap: { [key: string]: ArexMenu }) {
    this.menusMap = {
      ...this.menusMap,
      ...menusMap,
    };
  }

  public static getMenuByType(type?: string): ArexMenu | undefined {
    return type ? (this.menusMap[type] as ArexMenu) : undefined;
  }

  public static getMenuTypeByType(type?: string): string | undefined {
    const menu = this.getMenuByType(type);
    return menu ? menu.type : undefined;
  }

  public static getMenusByType(types: Array<string>): Array<ArexMenu | undefined> {
    return types.map((item) => {
      return Object.values(this.menusMap).find((child) => {
        return child.type === item;
      });
    });
  }
}
