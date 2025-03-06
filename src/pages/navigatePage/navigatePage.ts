import Block from "../../shared/core/block/block.ts";


export default class NavigatePage extends Block {
    constructor() {
        super("nav", {
            className: "navigate",
               });
    }

    public render(): string {
        return `
          <nav class="navigate">
    <ul>
        <li><a href="#" page="login">Login</a></li>
        <li><a href="#" page="singIn">singIn</a></li>
        <li><a href="#" page="chatList">chatList</a></li>
        <li><a href="#" page="userProfile">userProfile</a></li>
        <li><a href="#" page="userProfileEdit">userProfileEdit</a></li>
        <li><a href="#" page="userProfilePasswordEdit">userProfilePasswordEdit</a></li>
        <li><a href="#" page="Error5xxPage">5xx</a></li>
        <li><a href="#" page="NotFoundPage">NotFoundPage</a></li>
    </ul>
</nav>


    `;
    }
}
