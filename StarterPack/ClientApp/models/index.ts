export enum AlertType {
    success = 'success',
    warning = 'warning',
    danger = 'error',
    info = 'info',
}

export enum AnimationState {
    entering = 'entering',
    entered = 'entered',
    exiting = 'exiting',
    exited = 'exited',
}

export interface AccessPropertyName {
    [prop: string]: any;
}

export interface Alert {
    id: number;
    message?: React.ReactNode | string;
    alertType: AlertType;
    state: AnimationState;
}

export interface Bearer {
    access_token?: string,
    issuer?: string,
    audience?: string,
    claims?: string[],
    expires?: string,
    id?: string,
    name?: string,
    userData?: string,
    jti?: string,
    sub?: string
}

export interface LoginViewModel {
    email?: string,
    password?: string,
    rememberMe?: boolean,
}

export interface IndexViewModel {
    username?: string,
    isEmailConfirmed?: boolean,
    email?: string,
    firstName?: string,
    lastName?: string,
    userGuid?: string,
    imageUrl?: Blob,
    location?: string,
    description?: string,
    statusMessage?: string
}

export interface ProfileViewModel {
    username?: string,
    isEmailConfirmed?: boolean,
    email?: string,
    firstName?: string,
    lastName?: string,
    userGuid?: string,
    imageUrl?: string,
    location?: string,
    description?: string,
    statusMessage?: string
}

export interface RegisterViewModel {
    email?: string,
    password?: string,
    confirmPassword?: string,
}

export interface ForgotPasswordViewModel {
    username?: string
}

export interface ResetPasswordViewModel {
    username?: string,
    password?: string,
    confirmPassword?: string,
}

export interface ErrorMessage {
    error?: string,
    error_description?: string
}

export interface Field {
    caption: string;
    mapping_field: string;
    class?: string;
    type?: string;
}

export class EnumHelper {
    static GetDescription(e: any, id: number): string {
        return e[id].toString();
    }
    static GetNames(e: any) {
        return Object.keys(e).filter(k => typeof e[k] === "number") as string[];
    }
    static GetValues<T extends number>(e: any) {
        return Object.keys(e)
            .map(k => e[k])
            .filter(v => typeof v === "number") as T[];
    }
}