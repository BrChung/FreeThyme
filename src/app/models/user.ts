export interface Roles {
    guest?: boolean;
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    roles?: Roles;
}
