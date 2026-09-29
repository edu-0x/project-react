# 📱 Auth - Expo React Native + Firebase

Este é um projeto móvel e web criado a partir do template em branco do **Expo**, integrando o **Firebase Suite** para autenticação e persistência de dados em tempo real. O aplicativo gerencia um fluxo seguro entre as telas de Login e Home utilizando navegação nativa.

## 🚀 Recursos do Projeto

- **Template Base**: Inicializado com o template `blank` do Expo para uma estrutura limpa e direta.
- **Autenticação Dupla (Login/Cadastro)**: Uma única interface inteligente que valida credenciais de e-mail e senha antes de se comunicar com o Firebase Auth.
- **Integração Realtime Database**: Criação automática de um nó de usuário (`users/uid`) no banco de dados assim que uma nova conta é registrada.
- **Operações Completas de CRUD**: A tela principal permite ler, editar, salvar e excluir informações adicionais do perfil (Nome, E-mail e Endereço) diretamente do banco.
- **Navegação em Pilha Nativa**: Transição fluida e segura controlada por pilha nativa, impedindo o retorno visual a telas anteriores após a autenticação (`navigation.replace`).

## 🛠️ Tecnologias e Bibliotecas

- **Core**: [React Native](https://reactnative.dev) & [Expo](https://expo.dev)
- **Backend (Firebase)**: 
  - `firebase/auth` (Gerenciamento de acessos e sessões) [2, 3]
  - `firebase/database` (Persistência e sincronização de dados em tempo real) [2, 3]
- **Navegação Nativa**: 
  - `@react-navigation/native` & `@react-navigation/native-stack` [1]
  - `react-native-screens` & `react-native-safe-area-context`
- **Persistência de Sessão**: `@react-native-async-storage/async-storage`
- **Suporte Multiplataforma**: `react-dom` & `react-native-web`

---

## 📦 Instalação e Execução

### 1. Como o projeto foi estruturado (Para recriar do zero)
Caso queira refazer a base do projeto, estes foram os comandos executados no terminal:
```bash
npx create-expo-app Auth --template blank
cd Auth
npm install firebase @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx expo install react-dom react-native-web
```

### 2. Instalar as Dependências (Se clonou este repositório)
```bash
npm install
```

### 3. Configurar o Firebase
Abra o arquivo `src/config/firebase.js` e preencha o objeto com as chaves geradas no painel do seu projeto no [Console do Firebase](https://google.com):

```javascript
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);

export { auth, database };
```
> ⚠️ **Configuração Exigida:** No console do seu Firebase, ative o método de login por **E-mail/Senha** (Authentication) e crie uma instância de banco de dados **Realtime Database** configurando as regras de leitura e escrita.

### 4. Executar o Aplicativo
```bash
npx expo start
```
No terminal aberto, digite:
- `a` para abrir no **Emulador Android**.
- `i` para abrir no **Simulador iOS**.
- `w` para abrir no **Navegador Web**.
- Ou escaneie o QR Code com o aplicativo do **Expo Go** no seu smartphone.

---

## 📁 Estrutura Atualizada do Projeto

```text
Auth/
  ├── src/
  │   ├── config/
  │   │   └── firebase.js       # Inicialização do Firebase Auth e Realtime Database
  │   └── screens/
  │       ├── LoginScreen.js    # Tela com os formulários e ações de Login/Cadastro
  │       └── HomeScreen.js     # Painel de perfil integrado ao banco de dados (CRUD)
  ├── App.js                    # Estrutura de rotas nativas com o Stack.Navigator
  ├── index.js                  # Ponto de entrada padrão do Expo
  ├── app.json                  # Arquivo de metadados e configurações globais
  └── package.json              # Dependências e scripts de execução
```

---

## ⚙️ Regras de Validação Interna

- **Senhas Seguras**: O sistema rejeita e-mails ou senhas em branco e bloqueia tentativas de registros com senhas menores que 6 caracteres sem fazer requisições desnecessárias ao servidor.
- **Sincronização em Tempo Real**: Na tela Home, o aplicativo utiliza o listener `onValue` do Firebase para atualizar instantaneamente os dados do perfil assim que o nó do usuário sofrer mudanças.
- **Exclusão de Dados**: Permite que o usuário remova suas informações pessoais cadastradas no banco mantendo apenas seu cadastro de autenticação ativo.
