export default class UserDto {
    constructor(user) {
        this.email = user.email;
        this.fullname = `${user.first_name || ''} ${user.last_name || ''}`.trim();

        console.log('Fullname generado en DTO:', this.fullname);
    }
}