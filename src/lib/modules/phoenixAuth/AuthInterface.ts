export interface AuthInterface{
    getAccount():{email,displayName,id};
    passiveLogIn():Promise<true>;
    signOut():Promise<true>;
    signIn():Promise<true>;
}
