# Blockchain Simulator

## Overview
The Blockchain Simulator is an educational tool designed to help users understand the fundamental concepts of blockchain technology. It provides a visual representation of how blocks are created, linked, and validated within a blockchain.

## Features
- **Block Creation**: Users can create new blocks with transactions.
- **Transaction Management**: Add and view transactions within the blockchain.
- **Chain Visualization**: A visualizer that displays the entire blockchain and individual blocks.
- **API Integration**: Interact with the blockchain through a set of API endpoints.

## Project Structure
```
blockchain-simulator
├── src
│   ├── blockchain
│   │   ├── block.ts
│   │   ├── chain.ts
│   │   └── transaction.ts
│   ├── visualizer
│   │   ├── renderer.ts
│   │   └── utils.ts
│   ├── api
│   │   ├── routes.ts
│   │   └── handlers.ts
│   ├── app.ts
│   └── types
│       └── index.ts
├── public
│   ├── index.html
│   └── styles.css
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd blockchain-simulator
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the visualizer.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.