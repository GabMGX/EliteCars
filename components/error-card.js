class ErrorCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = ``;
    }
}

customElements.define("error-card", ErrorCard);