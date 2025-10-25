class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // O HTML/CSS será injetado pelo seu script Python.
        this.shadowRoot.innerHTML = ``;
    }

    // O método connectedCallback é executado quando o componente é adicionado à página.
    connectedCallback() {
        // Encontra o elemento <input> dentro do Shadow DOM.
        this.inputElement = this.shadowRoot.querySelector('input');

        // Adiciona um "ouvinte" que reage ao evento 'input'.
        // O evento 'input' é disparado toda vez que o texto no campo muda.
        this.inputElement.addEventListener('input', this.onInput.bind(this));
    }

    // Esta função é chamada a cada letra que o usuário digita.
    onInput() {
        // 1. Cria um novo evento customizado chamado 'search'.
        const searchEvent = new CustomEvent('search', {
            bubbles: true, // Permite que o evento "borbulhe" para fora do Shadow DOM.
            composed: true, // Permite que o evento atravesse os limites do Shadow DOM.
            detail: { // 'detail' é um objeto onde colocamos os dados que queremos enviar.
                query: this.inputElement.value // Enviamos o texto atual do campo de pesquisa.
            }
        });

        // 2. Dispara o evento a partir do próprio <search-bar>.
        this.dispatchEvent(searchEvent);
    }
}

customElements.define("search-bar", SearchBar);