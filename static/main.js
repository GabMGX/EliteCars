addEventListener("DOMContentLoaded", () => {
    // Verifica se a URL é do tipo '/componente/nome-do-component'
    const url = window.location.pathname;
    const regex = /^\/componente\/([a-zA-Z0-9-]+)$/;  // Regex para 'componente/nome-do-componente'
    
    const match = url.match(regex);
    
    if (match) {
      // Extrai o nome do componente da URL
      const componentName = match[1];
      console.log(componentName);
    
      // Cria um novo elemento do tipo do componente
      const component = document.createElement(componentName);
    
      // Adiciona o componente ao body
      document.body.appendChild(component);
    
      // (Opcional) Para verificar se o componente foi adicionado corretamente
      console.log(`Componente "${componentName}" carregado com sucesso.`);
    } else {
      console.log('URL não corresponde ao padrão /teste/nome-do-component');
    }
});
