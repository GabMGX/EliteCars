class CarCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = ``;
    }
}

customElements.define("car-card", CarCard);
