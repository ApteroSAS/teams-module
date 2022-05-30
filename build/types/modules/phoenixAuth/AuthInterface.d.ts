export interface AuthInterface {
    getAccount(): {
        email: any;
        displayName: any;
        id: any;
    };
    passiveLogIn(): Promise<true>;
    signOut(): Promise<true>;
    signIn(): Promise<true>;
}
