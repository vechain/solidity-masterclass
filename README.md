# Solidity Masterclass

A comprehensive development environment and learning resource for building smart contracts on VeChain using Hardhat. This repository contains practical examples and best practices for Solidity development.

## 📚 Overview

This repository serves as the companion codebase for the Solidity Masterclass video series [Video Series Link]. It provides a complete development environment with real-world examples of smart contract patterns, security considerations, and best practices.

## 🎥 Video Series

Each section of code corresponds to detailed video explanations in our course:

1. [Setting Up Your Development Environment] - Initial setup and configuration
2. [Smart Contract Fundamentals] - Basic patterns and best practices
3. [Token Standards & Implementation] - ERC20, ERC721, ERC1155
4. [Advanced Patterns & Security] - Proxy patterns, upgrades, and security

## ✨ Features

```7:12:README.md
- ✅ Hardhat configuration for VeChain networks (Solo, Testnet, Mainnet)
- 🐳 Thor-Solo instance for local development
- 📦 Upgradeable smart contracts templates
- 🧪 Comprehensive test suite setup
- 🔧 Deploy and upgrade scripts
- 🎭 Mock contracts for common VeChain contracts
```

## 🛠 Prerequisites

```16:18:README.md
- Node.js v20 (version specified in `.nvmrc`)
- Yarn or npm
- Docker (for running Thor-Solo)
```

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/solidity-masterclass.git
cd solidity-masterclass
```

2. Install dependencies:

```bash
yarn install
```

3. Create your environment file:

```bash
cp .env.example .env
```

### Development Commands

````38:78:README.md
1. Start the Thor-Solo instance:

```bash
yarn start-solo
```

### Compile

```bash
yarn compile
```

### Deploy

```bash
yarn deploy:solo
```

or

```bash
yarn deploy:testnet
```

or

```bash
yarn deploy:mainnet
```

### Test

```bash
yarn test
```

or to generate a coverage report:

```bash
yarn test:coverage:solidity
```
````

## ⚠️ Important Note

```90:92:README.md
## Warning

This template is using the `@openzeppelin/contracts-upgradeable` `v5.0.2` and `@openzeppelin/contracts` `v5.0.2` in order to be compatible with the VeChain Solidity compiler version of `0.8.20`.
```

## 🔒 Security

This repository includes examples of both secure patterns and common vulnerabilities for educational purposes. Never deploy contracts to production without thorough security audits.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📬 Support

For support and discussions, please [join our Discord community](discord-link) or [open an issue](issues-link).

---

For detailed explanations of each concept, please refer to the corresponding video lessons in our [Solidity Masterclass Series](video-series-link).
