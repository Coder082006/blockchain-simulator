const fs = require('fs');
const path = require('path');

// Using docx library for Word document creation
const { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle, TextRun, HeadingLevel, AlignmentType, PageBreak } = require('docx');

// Create Word Report (5 pages)
function createWordReport() {
  const doc = new Document({
    sections: [
      {
        children: [
          // Title Page
          new Paragraph({
            text: "Blockchain Simulator",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            thematicBreak: false,
            run: new TextRun({
              bold: true,
              size: 56
            })
          }),
          new Paragraph({
            text: "Technical Report",
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "January 2026",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: "",
            pageBreakBefore: true
          }),

          // Executive Summary
          new Paragraph({
            text: "1. Executive Summary",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            run: new TextRun({ bold: true, size: 48 })
          }),
          new Paragraph({
            text: "The Blockchain Simulator is an educational application designed to help users understand fundamental blockchain concepts. This report documents the technical architecture, features, implementation details, and usage guidelines for the simulator.",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "Version: 1.0.0",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "The simulator provides interactive visualization of blockchain operations including block creation, transaction management, and proof-of-work mining mechanisms.",
            spacing: { after: 200 }
          }),

          // Project Overview and Architecture
          new Paragraph({
            text: "2. Project Overview and Architecture",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            run: new TextRun({ bold: true, size: 48 })
          }),
          new Paragraph({
            text: "2.1 Project Description",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "The Blockchain Simulator is a TypeScript-based educational tool that demonstrates core blockchain principles. It implements a complete blockchain system with blocks, transactions, and a proof-of-work consensus mechanism. Users can interact with the blockchain through a web-based interface and an API.",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "2.2 Technical Stack",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "• Language: TypeScript\n• Runtime: Node.js\n• Framework: Express.js\n• Cryptography: Node.js crypto module (SHA-256 hashing)\n• Testing: Jest",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "2.3 Core Components",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "• Block Module: Implements the Block class with SHA-256 hash calculation and proof-of-work mining functionality.\n• Chain Module: Manages the blockchain data structure with validation and mining features.\n• Transaction Module: Defines transaction data structure with sender, recipient, and amount.\n• API Routes: RESTful endpoints for creating blocks, adding transactions, and retrieving blockchain data.\n• Visualizer: Web-based visualization interface for displaying the blockchain.",
            spacing: { after: 200 }
          }),

          // Features and Functionality
          new Paragraph({
            text: "3. Features and Functionality",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            run: new TextRun({ bold: true, size: 48 }),
            pageBreakBefore: true
          }),
          new Paragraph({
            text: "3.1 Block Creation and Management",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "Users can create new blocks containing transactions. Each block includes a timestamp, transaction list, reference to the previous block's hash, and its own calculated hash. The block stores a nonce value used in the proof-of-work algorithm.",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "3.2 Transaction Processing",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "The simulator allows users to add transactions to pending transaction pools. Each transaction contains sender, recipient, and amount information. Transactions are bundled into blocks during the mining process.",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "3.3 Proof-of-Work Mining",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "The mining feature implements a simplified proof-of-work algorithm. Miners increment a nonce value and recalculate the block hash until it meets a difficulty target (specified number of leading zeros in the hash). This demonstrates the computational effort required to secure blockchain networks.",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "3.4 Chain Validation",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "The system validates blockchain integrity by checking that each block's previous hash matches the hash of the preceding block. This ensures that any tampering with historical data would break the chain, demonstrating blockchain immutability.",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "3.5 Web Visualization",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "An interactive web interface displays the blockchain structure, individual block details, and transaction information. The visualizer updates in real-time as blocks are added and mined, providing immediate visual feedback on blockchain operations.",
            spacing: { after: 200 }
          }),

          // Installation and Usage
          new Paragraph({
            text: "4. Installation and Usage",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            run: new TextRun({ bold: true, size: 48 }),
            pageBreakBefore: true
          }),
          new Paragraph({
            text: "4.1 Prerequisites",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "• Node.js (v14 or higher)\n• npm (Node Package Manager)",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "4.2 Installation Steps",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "1. Navigate to the project directory\n2. Run 'npm install' to install dependencies\n3. Run 'npm start' to launch the application",
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: "4.3 Using the Application",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
            run: new TextRun({ bold: true })
          }),
          new Paragraph({
            text: "• Access the web interface at http://localhost:3000\n• Use the API endpoints to create transactions and mine blocks\n• View the blockchain visualization in real-time\n• Adjust mining difficulty to observe how it affects mining time",
            spacing: { after: 200 }
          }),

          // Conclusion
          new Paragraph({
            text: "5. Conclusion and Future Enhancements",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
            run: new TextRun({ bold: true, size: 48 }),
            pageBreakBefore: true
          }),
          new Paragraph({
            text: "The Blockchain Simulator successfully demonstrates fundamental blockchain concepts through an interactive educational platform. Users can explore block creation, transaction processing, and proof-of-work mechanisms in a controlled environment.",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "Key accomplishments include a complete blockchain implementation, RESTful API for interactions, and a real-time web visualization interface. The simulator effectively teaches how blockchain technology maintains data integrity through cryptographic hashing and proof-of-work consensus.",
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: "Future enhancements could include multi-node consensus simulation, transaction signing with digital signatures, persistence to databases, and performance analytics. The simulator provides a solid foundation for blockchain education and can be extended with additional features as needed.",
            spacing: { after: 100 }
          })
        ]
      }
    ]
  });

  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(
      path.join(__dirname, 'BlockchainSimulator_Report.docx'),
      buffer
    );
    console.log('✓ Word Report created: BlockchainSimulator_Report.docx');
  });
}

module.exports = { createWordReport };
