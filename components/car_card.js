class CarCard extends HTMLElement {
    constructor() {
        super();

        // Anexa uma shadow DOM ao elemento no modo 'open' para encapsular o estilo e a estrutura.
        this.attachShadow({ mode: 'open' });

        // --- Propriedades do Componente ---
        // O index da imagem atualmente exibida no slideshow.
        this.currentImageIndex = 1;

        // O caminho base para as imagens do slideshow.
        this.imageBasePath = '';

        // A referência do intervalo para o slideshow (setInterval)
        this.slideshowInterval = null;
    }

    // Ciclo de vida do componente: chamado quando o elemento é inserido na DOM.
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.updateCard();
    }

    // Define os atributos que o componente deve observar para mudanças.
    static get observedAttributes() {
        return ['image-base-path', 'name', 'preco', 'marca', 'desconto'];
    }

    // Chamado sempre que um dos atributos observados muda.
    attributeChangedCallback() {
        this.updateCard();
    }

    // Renderiza o HTML inicial e armazena referências aos elementos
    render() {
        this.shadowRoot.innerHTML = ``;

        // --- Armazenando referências aos elementos do DOM para acesso rápido ---
        this.imgElement = this.shadowRoot.getElementById('imagem');
        this.dots = this.shadowRoot.querySelectorAll('.dot');
        this.saleTag = this.shadowRoot.getElementById('sale');
        this.nameEl = this.shadowRoot.getElementById('nome');
        this.brandEl = this.shadowRoot.getElementById('marca');
        this.priceEl = this.shadowRoot.getElementById('preco');
        this.originalPriceEl = this.shadowRoot.getElementById('preco-original');
    }

    // Configura os listeners de eventos para o card.
    setupEventListeners() {
        this.addEventListener('mouseenter', this.startSlideshow);
        this.addEventListener('mouseleave', this.stopSlideshow);
    }

    // Atualiza todo o conteúdo do card com base nos atributos do elemento.
     
    updateCard() {
        // Atualiza informações básicas
        this.nameEl.textContent = this.getAttribute('name') || 'Nome Indisponível';
        this.brandEl.textContent = this.getAttribute('marca') || 'Marca Indisponível';
        this.imageBasePath = this.getAttribute('image-base-path');

        // Define a imagem inicial
        if (this.imageBasePath) {
            this.imgElement.src = `${this.imageBasePath}/1.webp`;
        }

        // Atualiza a lógica de preços e promoção
        this.updatePrice();
    }

    // Atualiza a exibição do preço, tratando a lógica de descontos.
    updatePrice() {
        const price = parseFloat(this.getAttribute('preco')) || 0;
        const discount = parseFloat(this.getAttribute('desconto')) || 0;
        const hasDiscount = this.hasAttribute('desconto') && discount > 0;

        // Formata valores para a moeda local (Real Brasileiro)
        const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);

        if (hasDiscount) {
            const discountedPrice = price - discount;
            this.saleTag.style.display = 'block';
            this.originalPriceEl.style.display = 'block';
            this.originalPriceEl.textContent = formatCurrency(price);
            this.priceEl.textContent = formatCurrency(discountedPrice);
        } else {
            this.saleTag.style.display = 'none';
            this.originalPriceEl.style.display = 'none';
            this.priceEl.textContent = formatCurrency(price);
        }
    }

    // Inicia a transição automática de imagens (slideshow).
    
    startSlideshow() {
        // Evita vários intervalos rodando ao mesmo tempo
        if (this.slideshowInterval) return;

        this.slideshowInterval = setInterval(() => {
            // Avança para a próxima imagem, voltando à primeira após a última (1, 2, 3, 1...)
            this.currentImageIndex = (this.currentImageIndex % 3) + 1;
            
            // Atualiza o src da imagem
            this.imgElement.src = `${this.imageBasePath}/${this.currentImageIndex}.webp`;

            // Atualiza o indicador visual (dot)
            this.updateActiveDot();
        }, 1000); // Intervalo de 1 segundo
    }

    // Para a transição automática de imagens e reseta para a imagem inicial.
    stopSlideshow() {
        clearInterval(this.slideshowInterval);
        this.slideshowInterval = null;

        // Reseta o slideshow para o estado inicial
        this.currentImageIndex = 1;
        this.imgElement.src = `${this.imageBasePath}/1.webp`;
        this.updateActiveDot();
    }

    // Sincroniza o indicador de ponto ('dot') ativo com a imagem atual.
    updateActiveDot() {
        this.dots.forEach((dot, index) => {
            // O índice do 'dot' (0-2) corresponde ao `currentImageIndex` (1-3) - 1
            if (index === this.currentImageIndex - 1) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Define o custom element 'car-card' no registro de elementos do navegador.
customElements.define("car-card", CarCard);