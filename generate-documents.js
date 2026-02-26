const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

// Create Word Document (Report)
function createWordDocument() {
  const docContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <!-- Title -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:jc w:val="center"/>
        <w:spacing w:before="240" w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="56"/>
        </w:rPr>
        <w:t>Blockchain Simulator</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>Technical Report</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="480"/>
      </w:pPr>
      <w:r>
        <w:t>January 2026</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:pPr>
        <w:pageBreakBefore/>
      </w:pPr>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Executive Summary -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>1. Executive Summary</w:t>
      </w:r>
    </w:p>
    
    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The Blockchain Simulator is an educational application designed to help users understand fundamental blockchain concepts. This report documents the technical architecture, features, implementation details, and usage guidelines for the simulator.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>Version: 1.0.0</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:t>The simulator provides interactive visualization of blockchain operations including block creation, transaction management, and proof-of-work mining mechanisms.</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:pPr>
        <w:pageBreakBefore/>
      </w:pPr>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Overview and Architecture -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>2. Project Overview and Architecture</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>2.1 Project Description</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The Blockchain Simulator is a TypeScript-based educational tool that demonstrates core blockchain principles. It implements a complete blockchain system with blocks, transactions, and a proof-of-work consensus mechanism. Users can interact with the blockchain through a web-based interface and an API.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>2.2 Technical Stack</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Language: TypeScript</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Runtime: Node.js</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Framework: Express.js</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Cryptography: Node.js crypto module (SHA-256 hashing)</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:t>Testing: Jest</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>2.3 Core Components</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>Block Module:</w:t>
      </w:r>
      <w:r>
        <w:t> Implements the Block class with SHA-256 hash calculation and proof-of-work mining functionality.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>Chain Module:</w:t>
      </w:r>
      <w:r>
        <w:t> Manages the blockchain data structure with validation and mining features.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>Transaction Module:</w:t>
      </w:r>
      <w:r>
        <w:t> Defines transaction data structure with sender, recipient, and amount.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>API Routes:</w:t>
      </w:r>
      <w:r>
        <w:t> RESTful endpoints for creating blocks, adding transactions, and retrieving blockchain data.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>Visualizer:</w:t>
      </w:r>
      <w:r>
        <w:t> Web-based visualization interface for displaying the blockchain.</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:pPr>
        <w:pageBreakBefore/>
      </w:pPr>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Features and Functionality -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>3. Features and Functionality</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>3.1 Block Creation and Management</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>Users can create new blocks containing transactions. Each block includes a timestamp, transaction list, reference to the previous block's hash, and its own calculated hash. The block stores a nonce value used in the proof-of-work algorithm.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>3.2 Transaction Processing</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The simulator allows users to add transactions to pending transaction pools. Each transaction contains sender, recipient, and amount information. Transactions are bundled into blocks during the mining process.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>3.3 Proof-of-Work Mining</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The mining feature implements a simplified proof-of-work algorithm. Miners increment a nonce value and recalculate the block hash until it meets a difficulty target (specified number of leading zeros in the hash). This demonstrates the computational effort required to secure blockchain networks.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>3.4 Chain Validation</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The system validates blockchain integrity by checking that each block's previous hash matches the hash of the preceding block. This ensures that any tampering with historical data would break the chain, demonstrating blockchain immutability.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>3.5 Web Visualization</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:t>An interactive web interface displays the blockchain structure, individual block details, and transaction information. The visualizer updates in real-time as blocks are added and mined, providing immediate visual feedback on blockchain operations.</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:pPr>
        <w:pageBreakBefore/>
      </w:pPr>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Installation and Usage -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>4. Installation and Usage</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>4.1 Prerequisites</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Node.js (v14 or higher)</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>npm (Node Package Manager)</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>4.2 Installation Steps</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>1. Navigate to the project directory</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>2. Run "npm install" to install dependencies</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>3. Run "npm start" to launch the application</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading2"/>
        <w:spacing w:before="120" w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>4.3 Using the Application</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Access the web interface at http://localhost:3000</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>Use the API endpoints to create transactions and mine blocks</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:t>View the blockchain visualization in real-time</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:t>Adjust mining difficulty to observe how it affects mining time</w:t>
      </w:r>
    </w:p>

    <!-- Page Break -->
    <w:p>
      <w:pPr>
        <w:pageBreakBefore/>
      </w:pPr>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>

    <!-- Conclusion -->
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>5. Conclusion and Future Enhancements</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>The Blockchain Simulator successfully demonstrates fundamental blockchain concepts through an interactive educational platform. Users can explore block creation, transaction processing, and proof-of-work mechanisms in a controlled environment.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="120"/>
      </w:pPr>
      <w:r>
        <w:t>Key accomplishments include a complete blockchain implementation, RESTful API for interactions, and a real-time web visualization interface. The simulator effectively teaches how blockchain technology maintains data integrity through cryptographic hashing and proof-of-work consensus.</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:t>Future enhancements could include multi-node consensus simulation, transaction signing with digital signatures, persistence to databases, and performance analytics. The simulator provides a solid foundation for blockchain education and can be extended with additional features as needed.</w:t>
      </w:r>
    </w:p>

  </w:body>
</w:document>`;

  console.log('Word document structure ready (XML format)');
}

// Create PowerPoint Document
function createPowerPointDocument() {
  const slides = [
    {
      title: "Blockchain Simulator",
      subtitle: "Educational Tool for Understanding Blockchain Technology"
    },
    {
      title: "What is Blockchain?",
      points: [
        "A distributed ledger of blocks linked together",
        "Each block contains transactions and a reference to the previous block",
        "Uses cryptographic hashing for security and immutability",
        "Decentralized consensus mechanism for validation",
        "Forms the foundation of cryptocurrencies and beyond"
      ]
    },
    {
      title: "Simulator Features",
      points: [
        "Block Creation: Create new blocks with multiple transactions",
        "Transaction Management: Add and track transactions",
        "Proof-of-Work Mining: Computational challenge-based validation",
        "Chain Validation: Ensure blockchain integrity",
        "Real-Time Visualization: Interactive web interface"
      ]
    },
    {
      title: "Technical Architecture",
      points: [
        "Language: TypeScript with Node.js runtime",
        "Framework: Express.js for API endpoints",
        "Cryptography: SHA-256 hashing algorithm",
        "Frontend: HTML5, CSS3, and JavaScript visualization",
        "Testing: Jest for unit and integration tests"
      ]
    },
    {
      title: "Key Components",
      points: [
        "Block Module: Manages individual blocks with hash calculation",
        "Chain Module: Maintains blockchain integrity and validation",
        "Transaction Module: Defines transaction data structure",
        "API Routes: RESTful endpoints for blockchain operations",
        "Visualizer: Web-based UI for blockchain display"
      ]
    },
    {
      title: "How Mining Works",
      points: [
        "Miners attempt to find a valid block hash",
        "Hash must meet difficulty target (leading zeros)",
        "Nonce incremented until target is found",
        "Demonstrates computational work for security",
        "Adjustable difficulty simulates network conditions"
      ]
    },
    {
      title: "Installation & Usage",
      points: [
        "Install Node.js dependencies: npm install",
        "Start the application: npm start",
        "Access web interface at http://localhost:3000",
        "Use API endpoints to create transactions and mine blocks",
        "Monitor blockchain growth in real-time visualization"
      ]
    },
    {
      title: "Educational Value & Future",
      points: [
        "Demonstrates core blockchain concepts interactively",
        "Suitable for students and blockchain enthusiasts",
        "Provides hands-on experience with distributed ledgers",
        "Future enhancements: multi-node simulation, digital signatures",
        "Solid foundation for advanced blockchain studies"
      ]
    }
  ];

  console.log('PowerPoint presentation structure ready with 8 slides');
}

createWordDocument();
createPowerPointDocument();
console.log('Document generation definitions created successfully!');
