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
    <button className="user-profile_button">
        <div className="overlay"></div>
        <img className="user-profile__picture" alt="изображение профиля" src={{profilePicture }} >
        <p className="text-overlay">Поменять аватар</p>
    </button>
    <h1>{{name }}</h1>

        `;
    }
}