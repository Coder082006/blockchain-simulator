#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Script to generate Blockchain Simulator Report and Presentation
async function generateDocuments() {
  console.log('='.repeat(60));
  console.log('Blockchain Simulator - Document Generator');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Check if required packages are installed
    console.log('📦 Checking dependencies...');
    
    const requiredPackages = ['docx', 'pptxgenjs'];
    let needsInstall = false;

    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
        console.log(`  ✓ ${pkg} is installed`);
      } catch (e) {
        console.log(`  ✗ ${pkg} is missing`);
        needsInstall = true;
      }
    }

    if (needsInstall) {
      console.log('');
      console.log('📥 Installing required packages...');
      console.log('  Running: npm install docx pptxgenjs');
      console.log('');
      
      try {
        await execPromise('npm install docx pptxgenjs');
        console.log('  ✓ Dependencies installed successfully');
      } catch (error) {
        console.error('  ✗ Failed to install dependencies');
        console.error('  Error:', error.message);
        process.exit(1);
      }
    }

    console.log('');
    console.log('📄 Generating Word Document (5 pages)...');
    
    // Generate Word document
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
    
    const wordDoc = new Document({
      sections: [
        {
          children: [
            // Page 1: Title
            new Paragraph({
              text: "Blockchain Simulator",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 200 },
              run: new TextRun({ bold: true, size: 56 })
            }),
            new Paragraph({
              text: "Technical Report",
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              run: new TextRun({ size: 32 })
            }),
            new Paragraph({
              text: "January 2026",
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              run: new TextRun({ size: 24 })
            }),
            new Paragraph({
              text: "",
              pageBreakBefore: true
            }),

            // Page 2: Executive Summary & Overview
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
              text: "The Blockchain Simulator is a TypeScript-based educational tool that demonstrates core blockchain principles. It implements a complete blockchain system with blocks, transactions, and a proof-of-work consensus mechanism.",
              spacing: { after: 100 }
            }),

            new Paragraph({
              text: "2.2 Technical Stack",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Language: TypeScript | Runtime: Node.js | Framework: Express.js | Cryptography: SHA-256 | Testing: Jest",
              spacing: { after: 200 }
            }),

            new Paragraph({
              text: "2.3 Core Components",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Block Module: Hash calculation and proof-of-work mining\nChain Module: Blockchain integrity validation\nTransaction Module: Transaction data structure\nAPI Routes: RESTful endpoints\nVisualizer: Web-based blockchain display",
              spacing: { after: 200 }
            }),

            // Page 3: Features
            new Paragraph({
              text: "",
              pageBreakBefore: true
            }),
            new Paragraph({
              text: "3. Features and Functionality",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 48 })
            }),

            new Paragraph({
              text: "3.1 Block Creation and Management",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Users can create new blocks containing transactions. Each block includes timestamp, transaction list, previous block reference, and calculated hash.",
              spacing: { after: 100 }
            }),

            new Paragraph({
              text: "3.2 Transaction Processing",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Add transactions to pending pools with sender, recipient, and amount information. Transactions are bundled into blocks during mining.",
              spacing: { after: 100 }
            }),

            new Paragraph({
              text: "3.3 Proof-of-Work Mining",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Mining algorithm increments nonce values until block hash meets difficulty target. Demonstrates computational effort for blockchain security.",
              spacing: { after: 100 }
            }),

            new Paragraph({
              text: "3.4 Chain Validation",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "System validates blockchain integrity by ensuring each block's previous hash matches preceding block's hash. Ensures blockchain immutability.",
              spacing: { after: 100 }
            }),

            new Paragraph({
              text: "3.5 Web Visualization",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Interactive web interface displays blockchain structure and transaction information. Updates in real-time as blocks are added and mined.",
              spacing: { after: 200 }
            }),

            // Page 4: Installation and Usage
            new Paragraph({
              text: "",
              pageBreakBefore: true
            }),
            new Paragraph({
              text: "4. Installation and Usage",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 48 })
            }),

            new Paragraph({
              text: "4.1 Prerequisites",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 50 },
              run: new TextRun({ bold: true })
            }),
            new Paragraph({
              text: "Node.js (v14 or higher)\nnpm (Node Package Manager)",
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
              text: "• Access web interface at http://localhost:3000\n• Use API endpoints to create transactions and mine blocks\n• View blockchain visualization in real-time\n• Adjust mining difficulty to observe mining time changes",
              spacing: { after: 200 }
            }),

            // Page 5: Conclusion
            new Paragraph({
              text: "",
              pageBreakBefore: true
            }),
            new Paragraph({
              text: "5. Conclusion and Future Enhancements",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
              run: new TextRun({ bold: true, size: 48 })
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
              text: "Future enhancements could include multi-node consensus simulation, transaction signing with digital signatures, database persistence, and performance analytics. The simulator provides a solid foundation for blockchain education and can be extended with additional features as needed.",
              spacing: { after: 100 }
            })
          ]
        }
      ]
    });

    const wordPath = path.join(__dirname, 'BlockchainSimulator_Report.docx');
    await Packer.toBuffer(wordDoc).then(buffer => {
      fs.writeFileSync(wordPath, buffer);
    });
    console.log(`  ✓ Word Report created: BlockchainSimulator_Report.docx`);

    // Generate PowerPoint
    console.log('');
    console.log('🎨 Generating PowerPoint Presentation (8 slides)...');
    
    const PptxGenJS = require('pptxgenjs');
    const prs = new PptxGenJS();
    
    // Define slide layout options
    const slideOptions = {
      margin: [0.5, 0.5, 0.5, 0.5]
    };

    // Slide 1: Title
    let slide = prs.addSlide();
    slide.background = { color: "1F4788" };
    slide.addText("Blockchain Simulator", {
      x: 0.5, y: 2.0, w: 9, h: 1.5,
      fontSize: 54, bold: true, color: "FFFFFF",
      align: "center"
    });
    slide.addText("Educational Tool for Understanding Blockchain Technology", {
      x: 0.5, y: 3.7, w: 9, h: 1.0,
      fontSize: 28, color: "E0E0E0",
      align: "center"
    });
    slide.addText("January 2026", {
      x: 0.5, y: 5.5, w: 9, h: 0.5,
      fontSize: 18, color: "B0B0B0",
      align: "center"
    });

    // Slide 2: What is Blockchain?
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("What is Blockchain?", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points = [
      "A distributed ledger of blocks linked together",
      "Each block contains transactions and a reference to the previous block",
      "Uses cryptographic hashing for security and immutability",
      "Decentralized consensus mechanism for validation",
      "Forms the foundation of cryptocurrencies and beyond"
    ];
    
    let y = 1.2;
    points.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 3: Features
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("Simulator Features", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points3 = [
      "Block Creation: Create new blocks with multiple transactions",
      "Transaction Management: Add and track transactions",
      "Proof-of-Work Mining: Computational challenge-based validation",
      "Chain Validation: Ensure blockchain integrity",
      "Real-Time Visualization: Interactive web interface"
    ];
    
    y = 1.2;
    points3.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 4: Technical Architecture
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("Technical Architecture", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points4 = [
      "Language: TypeScript with Node.js runtime",
      "Framework: Express.js for API endpoints",
      "Cryptography: SHA-256 hashing algorithm",
      "Frontend: HTML5, CSS3, and JavaScript visualization",
      "Testing: Jest for unit and integration tests"
    ];
    
    y = 1.2;
    points4.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 5: Key Components
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("Key Components", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points5 = [
      "Block Module: Manages individual blocks with hash calculation",
      "Chain Module: Maintains blockchain integrity and validation",
      "Transaction Module: Defines transaction data structure",
      "API Routes: RESTful endpoints for blockchain operations",
      "Visualizer: Web-based UI for blockchain display"
    ];
    
    y = 1.2;
    points5.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 6: How Mining Works
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("How Mining Works", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points6 = [
      "Miners attempt to find a valid block hash",
      "Hash must meet difficulty target (leading zeros)",
      "Nonce incremented until target is found",
      "Demonstrates computational work for security",
      "Adjustable difficulty simulates network conditions"
    ];
    
    y = 1.2;
    points6.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 7: Installation & Usage
    slide = prs.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("Installation & Usage", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "1F4788"
    });
    
    const points7 = [
      "Install Node.js dependencies: npm install",
      "Start the application: npm start",
      "Access web interface at http://localhost:3000",
      "Use API endpoints to create transactions and mine blocks",
      "Monitor blockchain growth in real-time visualization"
    ];
    
    y = 1.2;
    points7.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "333333"
      });
      y += 0.75;
    });

    // Slide 8: Educational Value & Future
    slide = prs.addSlide();
    slide.background = { color: "1F4788" };
    slide.addText("Educational Value & Future", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 44, bold: true, color: "FFFFFF"
    });
    
    const points8 = [
      "Demonstrates core blockchain concepts interactively",
      "Suitable for students and blockchain enthusiasts",
      "Provides hands-on experience with distributed ledgers",
      "Future enhancements: multi-node simulation, digital signatures",
      "Solid foundation for advanced blockchain studies"
    ];
    
    y = 1.2;
    points8.forEach(point => {
      slide.addText("• " + point, {
        x: 0.7, y: y, w: 8.6, h: 0.65,
        fontSize: 18, color: "E0E0E0"
      });
      y += 0.75;
    });

    const pptPath = path.join(__dirname, 'BlockchainSimulator_Presentation.pptx');
    await prs.writeFile({ fileName: pptPath });
    console.log(`  ✓ PowerPoint Presentation created: BlockchainSimulator_Presentation.pptx`);

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Document generation completed successfully!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Generated files:');
    console.log(`  📄 BlockchainSimulator_Report.docx (5 pages)`);
    console.log(`  🎨 BlockchainSimulator_Presentation.pptx (8 slides)`);
    console.log('');
    console.log('Both files are ready in the project directory.');
    console.log('');

  } catch (error) {
    console.error('❌ Error generating documents:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the generator
generateDocuments().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
