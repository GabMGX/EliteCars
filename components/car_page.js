class CarDetailPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Inicia com a variavel com null
        this._carData = null; 
    }

    // Este 'setter' é a chave! Ele é chamado quando definimos a propriedade 'carData' no elemento.
    // Ex: const page = document.createElement('car-detail-page'); page.carData = { ... };
    set carData(data) {
        this._carData = data;
        // Assim que os dados são recebidos o componente se renderiza.
        this.render();
    }

    get carData() {
        return this._carData;
    }

    render() {
        // Se ainda não houver dados, não faz nada.
        if (!this.carData) {
            return;
        }

        this.shadowRoot.innerHTML = ``;

        // Extrai os dados do carro para facilitar o uso.
        const { nome, marca, preco, imagens, desconto, descricao } = this.carData;

        // Preenche com os dados do carro
        this.shadowRoot.getElementById('main-image').src = `${imagens}/1.webp`;;
        this.shadowRoot.getElementById('car-name').textContent = nome;
        this.shadowRoot.getElementById('car-brand').textContent = marca;
        this.shadowRoot.getElementById('car-description').textContent = descricao;

        // Formulação de texto.
        const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);

        const priceEl = this.shadowRoot.getElementById('car-price');
        const originalPriceEl = this.shadowRoot.getElementById('car-original-price');

        if (desconto && desconto > 0) {
            originalPriceEl.style.display = 'inline';
            originalPriceEl.textContent = formatCurrency(preco);
            priceEl.textContent = formatCurrency(preco - desconto);
        } else {
            originalPriceEl.style.display = 'none';
            priceEl.textContent = formatCurrency(preco);
        }
    }
}

customElements.define('car-detail-page', CarDetailPage);