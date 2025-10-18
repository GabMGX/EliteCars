class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = ``;
    }
}

customElements.define("search-bar", SearchBar);
