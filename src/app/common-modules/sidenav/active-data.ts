export interface INavbarData {
    parentId: number;
    routeLink: string;
    icon: string;
    label: string;
    expanded: boolean;
}

export const activeData: INavbarData[] = [
    {
        parentId: 2,
        routeLink: 'setup',
        icon: 'fal fa-gear',
        label: 'Setup Module',
        expanded: true
    },
    {
        parentId: 3,
        routeLink: 'sales',
        icon: 'fal fa-coins',
        label: 'Sales Module',
        expanded: false
    },
    {
        parentId: 4,
        routeLink: 'reports',
        icon: 'fal fa-file-signature',
        label: 'Reports Module',
        expanded: false
    }
];