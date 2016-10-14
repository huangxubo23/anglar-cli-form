export class ResetPasswordUser {
    constructor(
        public password: string,
        public newPassword: string,
        public confirmPassword: string
    ){}
}
