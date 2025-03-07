import {Block} from "@shared";

export type TUserProfileTitles = {
    name: string;
    profilePicture: string
}
export default class UserProfileTitles extends Block {
    constructor(props:TUserProfileTitles) {
        super("section", {
            ...(props || {}),
            className: `user_profile__title`,
            name: props.name,
            profilePicture: props.profilePicture,
        });
    }

    render() {
        return `
    <button class="user-profile_button">
        <div class="overlay"></div>
        <img class="user-profile__picture" alt="изображение профиля" src={{profilePicture }} >
        <p class="text-overlay">Поменять аватар</p> 
    </button>
    <h1>{{name }}</h1>

        `;
    }
}