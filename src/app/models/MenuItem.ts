export class MenuItem {

    name: string;
    icon: string;
    url: string;
    subMenu: any[];
    aceess:boolean;
    
    constructor(name: string, icon: string, url: string, subMenu: any,aceess:boolean) {
        this.name = name;
        this.icon = icon;
        this.url = url;
        this.subMenu = subMenu;
        this.aceess=aceess;
    }

}
