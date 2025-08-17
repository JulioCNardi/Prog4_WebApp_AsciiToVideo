       function toggleColors() {
            const header = document.querySelector('header');
            const nav = document.querySelector('nav');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');
            
            // Adiciona ou remove a classe 'light-mode' do header, nav e footer
            header.classList.toggle('light-mode');
            nav.classList.toggle('light-mode');
            footer.classList.toggle('light-mode');
            
            // Adiciona ou remove a classe 'dark-mode' da main
            main.classList.toggle('dark-mode');
        }