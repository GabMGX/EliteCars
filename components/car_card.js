class CarCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = ``;
        this.image = this.shadowRoot.getElementById("imagem");
        this.image.src = "https://blog.deltafiat.com.br/wp-content/uploads/2023/08/carro-completo.jpeg";
    }
}

customElements.define("car-card", CarCard);
