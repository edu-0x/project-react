# 📱 Auth Project — Guia de Funcionalidades e Arquitetura

Bem-vindo ao coração do **Auth**, um aplicativo multiplataforma construído com **React Native** e **Expo**. Este documento foi criado para explicar detalhadamente como o aplicativo funciona na prática, como as telas se comunicam e as curiosidades arquiteturais por trás do código.

---

## 🎯 Funcionalidades na Prática

O aplicativo foi desenhado para resolver dois problemas principais: **identificação segura** e **gerenciamento de perfil em tempo real**. 

### 🔐 1. Tela de Login e Autenticação Inteligente (`LoginScreen`)
* **Validação Local Antecipada**: Antes mesmo de enviar os dados para a internet, o aplicativo limpa espaços em branco e verifica se a senha tem pelo menos 6 caracteres. Isso economiza internet do usuário e processamento do servidor.
* **Registro Automatizado em Duas Etapas**: Ao clicar em "Cadastrar", o app cria a credencial de acesso no *Firebase Auth* e, imediatamente, cria um perfil em branco vinculado ao ID exclusivo (`UID`) do usuário no *Realtime Database*.
* **Feedback de Carregamento**: Os botões bloqueiam e mudam o texto para "Aguarde..." ou "Cadastrando..." para evitar que o usuário clique duas vezes por ansiedade.

### 👤 2. Painel de Perfil Dinâmico (`HomeScreen`)
* **CRUD Completo do Usuário**: Uma vez logado, o usuário ganha acesso a um formulário onde pode visualizar, cadastrar, atualizar e deletar suas informações de Nome e Endereço.
* **Sincronização Viva (Realtime)**: O aplicativo não faz uma busca estática pelos dados. Ele fica "escutando" o banco de dados. Se você alterar o nome do usuário direto pelo painel do Firebase, o texto muda na tela do celular instantaneamente, sem precisar atualizar a página.
* **Exclusão Seletiva**: O botão "Excluir dados" limpa as informações de perfil do banco de dados (Nome/Endereço), mas preserva a conta de login do usuário ativa.

---

## 🧭 Como Funciona a Navegação?

A navegação foi estruturada utilizando o **React Navigation Native Stack**, simulando o comportamento de transição nativa de aplicativos iOS e Android.

```text
       [ Usuário Abre o App ]
                 │
                 ▼
       ┌───────────────────┐
       │    LoginScreen    │ ◄─── Nome/Senha incorretos (Permanece aqui)
       └───────────────────┘
                 │
                 │ Autenticação com Sucesso
                 ▼ (navigation.replace)
       ┌───────────────────┐
       │    HomeScreen     │ ───► Clique em "Sair" (navigation.replace)
       └───────────────────┘
```

### O Segredo do `.replace()`
Em aplicativos comuns, quando você muda de tela, a tela anterior fica "escondida" atrás da nova. Se o usuário apertar o botão físico de "Voltar" no Android, ele retornaria para a tela de login.
Para evitar essa falha de segurança, o projeto utiliza `navigation.replace('Home')` e `navigation.replace('Login')`. Esse método **destrói a tela anterior** da memória e coloca a nova tela no lugar, impedindo que o usuário volte para o Login estando logado, ou volte para a Home após clicar em "Sair".

---

## 💡 Curiosidades e Bastidores Técnicos

### 🧠 1. Memória de Elefante (Persistência Nativa)
Graças à configuração do `getReactNativePersistence(AsyncStorage)` no arquivo de configuração, o Firebase injeta um interceptador no ciclo de vida do app. Se o usuário fechar o aplicativo completamente e abri--lo no dia seguinte, o Firebase lembra quem ele era e não exige um novo login.

### 🌐 2. Um Código, Três Plataformas
Mesmo sendo um projeto focado em Mobile, a inclusão do `react-native-web` permite que esse exato mesmo código rode perfeitamente no navegador do computador. O comportamento dos inputs e botões se adapta visualmente para o clique do mouse ou o toque na tela.

### 🧹 3. Sem Vazamento de Memória (Memory Leaks)
Na `HomeScreen`, a escuta do banco de dados (`onValue`) consome memória constantemente. No código, foi implementado um retorno de limpeza (`return () => unsubscribe()`) dentro do `useEffect`. Isso garante que, no momento exato em que o usuário clica em "Sair", a escuta da internet é desligada, evitando que o app continue gastando internet e processamento em segundo plano.

### 🕒 4. Rastro de Modificação
Toda vez que o usuário edita seu perfil na Home e clica em "Salvar dados", o Firebase grava uma propriedade chamada `updatedAt` com o carimbo de data e hora no formato ISO (`new Date().toISOString()`). Isso permite auditoria futura para saber exatamente quando o usuário modificou suas informações pela última vez.
