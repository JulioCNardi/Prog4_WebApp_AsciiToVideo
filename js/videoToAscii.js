// Aguarda o DOM ser completamente carregado
        window.addEventListener('load', () => {
            // Seleciona os elementos da página
            const videoElement = document.getElementById('videoElement');
            const canvas = document.getElementById('asciiCanvas');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const restartBtn = document.getElementById('restartBtn');
            const videoUpload = document.getElementById('video-upload');
            const uploadMessage = document.querySelector('.file-upload-container p');
            const densitySlider = document.getElementById('density-slider');
            const densityValueSpan = document.getElementById('density-value');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            // Conjunto de caracteres ASCII, do mais escuro para o mais claro
            const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. " ;

            // Define o tamanho da grade ASCII. Quanto menor o valor, maior a densidade de caracteres e o detalhe da imagem.
            let asciiDensity = 6;

            // Função para converter um valor de brilho (0-255) em um caractere ASCII
            function getAsciiChar(brightness) {
                const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                return asciiChars[charIndex];
            }

            // A função principal de renderização que roda a cada frame
            function renderAscii() {
                // Garante que o canvas tenha o mesmo tamanho do vídeo
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                // Desenha o frame atual do vídeo no canvas invisível
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // Obtém os dados de pixel do canvas
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Limpa o canvas para desenhar os caracteres ASCII
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Configurações do texto
                ctx.font = `${asciiDensity}px monospace`;
                ctx.textBaseline = 'top';
                
                // Itera sobre os pixels para converter em ASCII
                for (let y = 0; y < canvas.height; y += asciiDensity) {
                    for (let x = 0; x < canvas.width; x += asciiDensity) {
                        // Calcula o índice do pixel na matriz de dados
                        const pixelIndex = ((y * canvas.width) + x) * 4;
                        
                        // Obtém os valores RGB
                        const r = data[pixelIndex];
                        const g = data[pixelIndex + 1];
                        const b = data[pixelIndex + 2];

                        // Calcula o brilho usando a fórmula de luminosidade para escolher o caractere
                        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                        const asciiChar = getAsciiChar(brightness);
                        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        ctx.fillText(asciiChar, x, y);
                    }
                }
                
                // Solicita o próximo frame de animação se o vídeo estiver tocando
                if (!videoElement.paused && !videoElement.ended) {
                    requestAnimationFrame(renderAscii);
                }
            }

            // A lógica principal agora lida com o carregamento do arquivo
            videoUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const videoUrl = URL.createObjectURL(file);
                    // Define o src do elemento de vídeo
                    videoElement.src = videoUrl;
                    videoElement.load();
                    uploadMessage.textContent = `Vídeo "${file.name}" carregado. Clique em Reproduzir!`;
                }
            });
            
            // Inicia a renderização ASCII somente quando o vídeo começar a ser reproduzido
            videoElement.addEventListener('play', () => {
                requestAnimationFrame(renderAscii);
            });

            // Lógica para os botões de controle
            playPauseBtn.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play().catch(error => {
                        console.error("Erro ao tentar reproduzir o vídeo:", error);
                        uploadMessage.textContent = "Clique em um dos botões para interagir com o vídeo.";
                    });
                } else {
                    videoElement.pause();
                }
            });

            restartBtn.addEventListener('click', () => {
                videoElement.currentTime = 0;
                if (videoElement.paused) {
                    videoElement.play().catch(error => {
                        console.error("Erro ao tentar reproduzir o vídeo:", error);
                        uploadMessage.textContent = "Clique em um dos botões para interagir com o vídeo.";
                    });
                }
            });

            densitySlider.addEventListener('input', (event) => {
                asciiDensity = parseInt(event.target.value);
                densityValueSpan.textContent = asciiDensity;
            });
        });