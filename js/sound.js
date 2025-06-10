/**
 * Sound functions - JavaScript equivalent of sound.py
 * Handles audio playback for the web version
 */

class SoundManager {
    constructor() {
        this.sounds = {
            background: null,
            ingredient: null,
            potionCreated: null,
            gameOver: null,
            corvo: null,
            corvoWin: null,
            end: null
        };
        
        this.isBackgroundPlaying = false;
        this.isSoundEnabled = true;
        this.currentBackgroundSound = null;
        
        this.initializeSounds();
    }

    initializeSounds() {
        // Inicializar elementos de áudio
        this.sounds.background = document.getElementById('background-music');
        this.sounds.ingredient = document.getElementById('ingredient-sound');
        this.sounds.potionCreated = document.getElementById('potion-created-sound');
        this.sounds.gameOver = document.getElementById('game-over-sound');
        this.sounds.corvo = document.getElementById('corvo-sound');
        this.sounds.corvoWin = document.getElementById('corvo-win-sound');
        this.sounds.end = document.getElementById('end-sound');

        // Configurar volumes
        if (this.sounds.background) {
            this.sounds.background.volume = 0.3;
        }
        
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound !== this.sounds.background) {
                sound.volume = 0.7;
            }
        });
    }

    // Controle geral de som
    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        if (!this.isSoundEnabled) {
            this.stopAllSounds();
        }
        return this.isSoundEnabled;
    }

    setSoundEnabled(enabled) {
        this.isSoundEnabled = enabled;
        if (!enabled) {
            this.stopAllSounds();
        }
    }

    // Som de fundo
    playBackgroundMusic() {
        if (!this.isSoundEnabled || !this.sounds.background) return;
        
        try {
            this.sounds.background.currentTime = 0;
            this.sounds.background.play().catch(error => {
                console.log('Erro ao reproduzir música de fundo:', error);
            });
            this.isBackgroundPlaying = true;
        } catch (error) {
            console.log('Erro ao inicializar música de fundo:', error);
        }
    }

    stopBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.pause();
            this.sounds.background.currentTime = 0;
            this.isBackgroundPlaying = false;
        }
    }

    // Sons de efeito
    playGameOver() {
        this.playSound('gameOver');
    }

    playPotionCreated() {
        this.playSound('potionCreated');
    }

    playAddIngredient() {
        this.playSound('ingredient');
    }

    playCorvo() {
        return this.playSound('corvo', true); // Retorna referência para poder parar depois
    }

    playCorvoWin() {
        this.playSound('corvoWin');
    }

    playEnd() {
        this.playSound('end');
    }

    // Método genérico para tocar sons
    playSound(soundName, returnReference = false) {
        if (!this.isSoundEnabled || !this.sounds[soundName]) {
            return returnReference ? null : undefined;
        }

        try {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.log(`Erro ao reproduzir ${soundName}:`, error);
            });
            
            return returnReference ? sound : undefined;
        } catch (error) {
            console.log(`Erro ao inicializar ${soundName}:`, error);
            return returnReference ? null : undefined;
        }
    }

    // Parar um som específico
    stopSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }

    // Parar som usando referência (para o corvo)
    stopSoundByReference(soundElement) {
        if (soundElement) {
            soundElement.pause();
            soundElement.currentTime = 0;
        }
    }

    // Parar todos os sons
    stopAllSounds() {
        Object.entries(this.sounds).forEach(([name, sound]) => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
        this.isBackgroundPlaying = false;
    }

    // Verificar se um som está tocando
    isSoundPlaying(soundName) {
        const sound = this.sounds[soundName];
        return sound && !sound.paused && sound.currentTime > 0 && !sound.ended;
    }

    // Configurar volume de um som específico
    setVolume(soundName, volume) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = Math.max(0, Math.min(1, volume));
        }
    }

    // Configurar volume geral
    setMasterVolume(volume) {
        const normalizedVolume = Math.max(0, Math.min(1, volume));
        
        Object.entries(this.sounds).forEach(([name, sound]) => {
            if (sound) {
                if (name === 'background') {
                    sound.volume = normalizedVolume * 0.3; // Música de fundo mais baixa
                } else {
                    sound.volume = normalizedVolume * 0.7; // Efeitos sonoros
                }
            }
        });
    }

    // Obter status dos sons
    getSoundStatus() {
        return {
            enabled: this.isSoundEnabled,
            backgroundPlaying: this.isBackgroundPlaying,
            sounds: Object.keys(this.sounds).reduce((status, soundName) => {
                status[soundName] = this.isSoundPlaying(soundName);
                return status;
            }, {})
        };
    }

    // Método para criar um botão de controle de som
    createSoundToggleButton() {
        const button = document.createElement('button');
        button.className = 'sound-toggle-button';
        button.innerHTML = this.isSoundEnabled ? '🔊' : '🔇';
        button.title = this.isSoundEnabled ? 'Desligar Som' : 'Ligar Som';
        
        button.addEventListener('click', () => {
            this.toggleSound();
            button.innerHTML = this.isSoundEnabled ? '🔊' : '🔇';
            button.title = this.isSoundEnabled ? 'Desligar Som' : 'Ligar Som';
        });
        
        return button;
    }

    // Método para aguardar o fim de um som (equivalente ao pygame.time.wait)
    async waitForSound(soundName, duration = null) {
        const sound = this.sounds[soundName];
        if (!sound || !this.isSoundEnabled) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            if (duration) {
                // Aguardar por um tempo específico
                setTimeout(resolve, duration);
            } else {
                // Aguardar até o som terminar
                const onEnded = () => {
                    sound.removeEventListener('ended', onEnded);
                    resolve();
                };
                sound.addEventListener('ended', onEnded);
            }
        });
    }

    // Método para tocar um som com delay (não-bloqueante)
    async playSoundWithDelay(soundName, delay = 0) {
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.playSound(soundName);
    }

    // Método para detectar interação do usuário (necessário para autoplay)
    enableAudioContext() {
        // Necessário para alguns navegadores que bloqueiam autoplay
        const enableAudio = () => {
            Object.values(this.sounds).forEach(sound => {
                if (sound && sound.play) {
                    sound.play().then(() => {
                        sound.pause();
                        sound.currentTime = 0;
                    }).catch(() => {
                        // Ignorar erros de autoplay
                    });
                }
            });
            
            // Remover listener após primeira interação
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
    }
}

// Instância global do gerenciador de som
let soundManager = null;

// Funções globais equivalentes ao módulo Python
function initSoundManager() {
    if (!soundManager) {
        soundManager = new SoundManager();
        soundManager.enableAudioContext();
    }
    return soundManager;
}

function soundGameOver() {
    const manager = initSoundManager();
    manager.playGameOver();
}

function soundPocaoCriada() {
    const manager = initSoundManager();
    manager.playPotionCreated();
}

function soundAddIngrediente() {
    const manager = initSoundManager();
    manager.playAddIngredient();
}

function soundCorvoWin() {
    const manager = initSoundManager();
    manager.playCorvoWin();
}

function soundCorvo() {
    const manager = initSoundManager();
    return manager.playCorvo();
}

function stopCorvoSound(soundRef) {
    const manager = initSoundManager();
    manager.stopSoundByReference(soundRef);
}

function soundBackground() {
    const manager = initSoundManager();
    manager.playBackgroundMusic();
}

function stopBackgroundSound() {
    const manager = initSoundManager();
    manager.stopBackgroundMusic();
}

function soundEnd() {
    const manager = initSoundManager();
    manager.playEnd();
}

// Exportar para uso global
window.SoundManager = SoundManager;
window.soundManager = soundManager;
window.initSoundManager = initSoundManager;
window.soundGameOver = soundGameOver;
window.soundPocaoCriada = soundPocaoCriada;
window.soundAddIngrediente = soundAddIngrediente;
window.soundCorvoWin = soundCorvoWin;
window.soundCorvo = soundCorvo;
window.stopCorvoSound = stopCorvoSound;
window.soundBackground = soundBackground;
window.stopBackgroundSound = stopBackgroundSound;
window.soundEnd = soundEnd;
