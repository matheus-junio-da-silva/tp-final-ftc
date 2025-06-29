# Slides para Apresentação - Alquimia Automática

## Slide 1: Capa
**Título:** Alquimia Automática - Simulador de Poções com Autômatos
**Subtítulo:** Trabalho Prático Final - Fundamentos Teóricos da Computação

**Integrantes:**
- Mateus Júnior da Silva
- Ramom Eloi
- Marcos Tampieri
- Lucas
- Armindo

**Professor:** [Nome do Professor]
**Data:** Junho 2025

---

## Slide 2: 

### Introdução e Visão Geral
(Nosso) simulador de criação de poções é uma aplicação web, foi feito com HTML, CSS e Javascript. 

### O que fizemos?
Implementamos o AFD e APD, e também todos os extras: (que é) a máquina de Mealy, Moore e Turing.

### Por que escolhemos tecnologias web?
Escolhemos essas tecnologias pensando primeiramente na interface, 
por elas terem uma capacidade de estilização alta.

*[Sugestão de imagem: Screenshot da tela inicial do jogo com o título "Alquimia Automática"]*

---

falar que o arquivo já esta no código estaticamente para facilitar

## Slide 3: Tecnologias e Arquitetura

essas são foram as tecnologias utilizadas

### Stack Tecnológico
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Estilização:** CSS Grid/Flexbox, Google Fonts (tema medieval)
- **Áudio:** Web Audio API para efeitos sonoros e música
- **Deploy:** Hospedagem web com servidor HTTP

### Arquitetura Modular
```
📁 Estrutura do Projeto
├── index.html          (Interface principal)
├── styles.css          (Tema mágico responsivo)
├── js/
│   ├── main.js         (Controlador principal)
│   ├── automato.js     (AFD e APD)
│   ├── mealy.js        (Máquina de Mealy)
│   ├── moore.js        (Máquina de Moore)
│   ├── turing.js       (Máquina de Turing)
│   └── sound.js        (Sistema de áudio)
└── pocoes/             (Receitas dos autômatos)
```

*[Sugestão de imagem: Diagrama da arquitetura ou screenshot do código organizado]*

---

## Slide 4: Funcionalidades Implementadas

### ✅ Requisitos Básicos Atendidos
- **Autômatos Finitos Determinísticos (AFD):** Receitas simples
- **Autômatos de Pilha Determinísticos (APD):** Receitas com contexto
- **Validação de Determinismo:** Verificação automática
- **Interface Gráfica:** Experiência visual completa

### 🎯 3 Extras Implementados
1. **Máquina de Mealy:** Oráculo Místico que avalia poções (sabor/poder)
2. **Máquina de Moore:** Sequência específica de ingredientes com outputs únicos
3. **Máquina de Turing:** Processamento complexo de receitas

### 🎮 Recursos Adicionais
- Sistema de sons e música temática
- Animações (caldeirão borbulhante, partículas)
- Ingredientes criativos e divertidos
- Histórico de execução detalhado

*[Sugestão de imagem: Screenshots das 4 telas principais do menu]*

---

## Slide 5: Interface e Experiência do Usuário

### Design Temático Mágico
- **Cores:** Paleta roxa e dourada
- **Tipografia:** Fontes medievais (Creepster, MedievalSharp)
- **Animações:** Efeitos visuais de caldeirão e oráculo
- **Responsividade:** Adaptável a diferentes dispositivos

### Ingredientes Criativos e Divertidos
| Símbolo | Ingrediente |
|---------|-------------|
| `biz` | biscoito de bruxa malvada |
| `bab` | baba de camelo fedida |
| `pum` | pum de dragão fedorento |
| `bur` | buraco negro comestível |
| `zap` | zapzap elétrico infinito |
| `omg` | oh my god concentrado |

*[Sugestão de imagem: Collage de screenshots mostrando a interface em diferentes telas]*

---

## Slide 6: Demonstração dos Autômatos

### Tipos de Receitas Disponíveis
- **Poção da Sabedoria:** AFD com sequência específica
- **Receita da Morte:** Poção perigosa com ingredientes mortais
- **Poção Cíclica:** APD com estrutura de pilha
- **Receitas Turing:** Processamento complexo

### Fluxo de Uso
1. Selecionar tipo de autômato
2. Escolher receita
3. Adicionar ingredientes sequencialmente
4. Visualizar transições em tempo real
5. Obter resultado final

*[Sugestão de imagem: Screenshot da tela de seleção de receitas + tela de execução]*

---

## Slide 7: Deploy e Acessibilidade

### Hospedagem Web
- Aplicação deployada e acessível via navegador
- Sem necessidade de instalação
- Compatível com todos os navegadores modernos

### QR Code para Acesso
*[Aqui colocar o QR Code para acessar a aplicação]*

### Facilidades de Execução
- Scripts automatizados (`executar.bat`, `executar.ps1`)
- Servidor local automático
- Documentação completa no README

*[Sugestão de imagem: QR Code + screenshot da aplicação rodando em mobile]*

---

## Slide 8: Resultados e Conclusão

### Objetivos Alcançados
- ✅ Todos os requisitos básicos implementados
- ✅ 3 extras desenvolvidos (Mealy, Moore, Turing)
- ✅ Interface moderna e intuitiva
- ✅ Aplicação totalmente funcional
- ✅ Deploy realizado com sucesso

### Aprendizados
- Aplicação prática de conceitos teóricos de autômatos
- Desenvolvimento de interfaces web modernas
- Trabalho em equipe e divisão de módulos
- Conversão de conceitos acadêmicos em aplicação real

### Próximos Passos
- Demonstração ao vivo da aplicação
- Execução dos diferentes tipos de autômatos
- Teste das funcionalidades implementadas

*[Sugestão de imagem: Screenshot final mostrando uma poção sendo criada com sucesso]*

---

## Sugestões de Imagens para os Slides

1. **Slide 2:** Screenshot da tela inicial com título "Alquimia Automática"
2. **Slide 3:** Print da estrutura de arquivos no VS Code ou diagrama da arquitetura
3. **Slide 4:** Montagem com as 4 opções do menu principal
4. **Slide 5:** Collage mostrando responsividade (desktop/tablet/mobile)
5. **Slide 6:** Tela de execução de uma receita com transições visíveis
6. **Slide 7:** QR Code + screenshot mobile da aplicação
7. **Slide 8:** Screenshot de uma poção finalizada com sucesso

### Prints Específicos Recomendados:
- Tela inicial com animação do caldeirão
- Menu de seleção de autômatos
- Tela de escolha de receitas
- Interface durante execução (mostrando transições)
- Resultado do Oráculo Místico (Mealy)
- Máquina de Moore em funcionamento
- Console com histórico de execução
- Aplicação rodando em diferentes dispositivos

---

## Observações Importantes

- Foco em visão geral, não em detalhes técnicos do código
- Demonstração ao vivo será feita pelos outros integrantes
- Slides devem ser visualmente atrativos com bastante imagem
- Enfatizar criatividade e completude do projeto
- Destacar que todos os requisitos + extras foram implementados
