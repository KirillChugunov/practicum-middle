import Handlebars from 'handlebars';
import * as Features from './features';
import * as Shared from './shared';
import * as Pages from './pages';
import arrow from './assets/icons/arrow.svg'
import profilePicture from './assets/icons/picture.svg'
import chatListAvatar from './assets/icons/chatListAvatar.svg'
import moreIcon from './assets/icons/moreIcon.svg'
import messagePhotoSrc from './assets/icons/messageImg.svg'

const messages = [
    {
        timestamp: "11:02",
        owner: "my",
        type: "text",
        text: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.\n" +
            "\n" +
            "Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро."
    },
    {
        timestamp: "11:02",
        owner: "incoming",
        photo: messagePhotoSrc
    }
]
const pages = {
    'login': [Pages.LoginPage],
    'singIn': [Pages.SingInPage],
    'chatList': [Pages.ChatListPage, {
        chatListAvatar: chatListAvatar,
        chat: true,
        messages: messages
    }],
    'userProfile': [Pages.UserProfileInfoPage, {buttonIcon: arrow, profilePicture: profilePicture}],
    'userProfileEdit': [Pages.UserProfileEditPage, {buttonIcon: arrow, profilePicture: profilePicture}],
    'userProfilePasswordEdit': [Pages.UserProfilePasswordEditPage, {buttonIcon: arrow, profilePicture: profilePicture}],
};

Object.entries(Shared).forEach(([name, template]) => {
    Handlebars.registerPartial(name, template);
});
Object.entries(Features).forEach(([name, template]) => {
    Handlebars.registerPartial(name, template);
});

function navigate(page) {
    const [source, context] = pages[page];
    const container = document.getElementById('app');
    const temlpatingFunction = Handlebars.compile(source);
    container.innerHTML = temlpatingFunction(context);
}

document.addEventListener('DOMContentLoaded', () => navigate('chatList'));

document.addEventListener('click', e => {
    const page = e.target.getAttribute('page');
    if (page) {
        navigate(page);
        e.preventDefault();
        e.stopImmediatePropagation();
    }
});