class App {
    constructor() {
        // --- Estrutura Base ---
        this.root = document.body;
        this.nav_bar = document.createElement('nav-bar');
        this.pageContainer = document.createElement('main');
        this.pageContainer.id = 'page-container';
        this.root.append(this.nav_bar, this.pageContainer);

        // --- Rotas Estáticas ---
        this.staticRoutes = {
            "/": this.renderCarros.bind(this),
            "/carros": this.renderCarros.bind(this),
            "/ofertas": this.renderOfertas.bind(this),
        };

        // --- Eventos Globais ---
        this.setupEventListeners();

        // --- Renderização Inicial ---
        this.router();
    }
    
    // --- Configuração dos Eventos ---
    setupEventListeners() {
        document.addEventListener("click", e => {
            const link = e.target.closest("[data-link]");
            if (link) {
                e.preventDefault();
                this.navigateTo(link.getAttribute("href"));
            }
        });

        document.addEventListener('click', e => {
            const card = e.target.closest('car-card');
            if (card && card.dataset.id) {
                this.navigateTo(`/carro/${card.dataset.id}`);
            }
        });

        window.addEventListener("popstate", () => this.router());

        document.addEventListener('search', this.handleSearch.bind(this));
    }

    handleSearch(event) {
      // Pega o texto da pesquisa que veio no detalhe do evento.
      const query = event.detail.query;

      // Normaliza o texto da pesquisa (remove acentos e deixa em minúsculas).
      const normalizedQuery = this.normalizeForSearch(query);

      // Seleciona todos os cards de carro que estão na página.
      const carCards = this.pageContainer.querySelectorAll('car-card');

      // Itera sobre cada card para decidir se ele deve ser mostrado ou escondido.
      carCards.forEach(card => {
          const carName = card.getAttribute('name');
          const carBrand = card.getAttribute('marca');

          // Normaliza o nome e a marca do carro para uma comparação justa.
          const normalizedName = this.normalizeForSearch(carName);
          const normalizedBrand = this.normalizeForSearch(carBrand);

          // Verifica se o nome OU a marca do carro incluem o texto pesquisado.
          const isMatch = normalizedName.includes(normalizedQuery) || normalizedBrand.includes(normalizedQuery);

          // Se for uma correspondência, mostra o card. Se não, esconde.
          // Usamos 'flex' porque é o display padrão do seu card no CSS.
          card.style.display = isMatch ? 'flex' : 'none';
        });
    }

    // --- Roteador Principal ---
    router() {
        const path = window.location.pathname;
        const carroDetalheRegex = /^\/carro\/([a-zA-Z0-9-]+)$/;
        const carroMatch = path.match(carroDetalheRegex);

        this.pageContainer.innerHTML = ''; 

        if (carroMatch) {
            const carId = carroMatch[1];
            this.renderCarroDetalhe(carId);
        } else if (this.staticRoutes[path]) {
            this.staticRoutes[path]();
        } else {
            this.renderNotFound();
        }
    }

    // --- Lógica de Navegação ---
    navigateTo(url) {
        history.pushState(null, null, url);
        this.router();
    }
    
    normalizeForSearch(text) {
        if (!text) return '';
        return text.toString().toLowerCase()
            .normalize('NFD') // Separa os acentos das letras
            .replace(/[\u0300-\u036f]/g, ''); // Remove os acentos
    }
    
    // Renomeei 'slugify' para ser mais claro sobre seu propósito (URLs).
    createSlug(text) {
        return this.normalizeForSearch(text)
            .replace(/\s+/g, '-') // Troca espaços por "-"
            .replace(/[^\w-]+/g, '') // Remove todos os caracteres que não são palavras ou "-"
            .replace(/--+/g, '-'); // Remove "-" duplicados
    }

    // --- Funções de Renderização de Página ---
    async renderCarroDetalhe(carId) {
        try {
            const response = await fetch('/static/cars.json');
            const cars = await response.json();

            // Encontra o carro correspondente ao ID (slug)
            const car = cars.find(c => {
                // Usa a função slugify para garantir que ache
                const id = this.createSlug(`${c.marca}-${c.nome}`);
                return id === carId;
            });

            if (car) {
                const detailPageElement = document.createElement('car-detail-page');
                detailPageElement.carData = car;
                this.pageContainer.append(detailPageElement);
            } else {
                this.renderNotFound();
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes do carro:", err);
            this.pageContainer.innerHTML = `<p style="color: red;">Não foi possível carregar os detalhes.</p>`;
        }
    }
    
    async renderCarros() {
        this.renderCarList();
    }

    async renderOfertas() {
        this.renderCarList({ comDesconto: true });
    }

    async renderCarList(options = {}) {
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        this.pageContainer.append(cardsContainer);

        try {
            const response = await fetch('/static/cars.json');
            let cars = await response.json();

            if (options.comDesconto) {
                cars = cars.filter(car => car.desconto);
            }

            cars.forEach(car => {
                const car_card = document.createElement('car-card');

                // Usa a função slugify para criar o ID do card
                const carId = this.createSlug(`${car.marca}-${car.nome}`);
                car_card.dataset.id = carId; 

                car_card.setAttribute('image-base-path', car.imagens);
                car_card.setAttribute('name', car.nome);
                car_card.setAttribute('marca', car.marca);
                car_card.setAttribute('preco', car.preco);
                car_card.setAttribute('descricao', car.descricao);
                if (car.desconto) {
                    car_card.setAttribute('desconto', car.desconto);
                }
                cardsContainer.append(car_card);
            });
        } catch (err) {
            console.error("Erro ao carregar cars.json:", err);
        }
    }
    
    renderNotFound() {
        const error_card = document.createElement('error-card');
        this.pageContainer.append(error_card);
    }
}

document.addEventListener("DOMContentLoaded", () => new App());