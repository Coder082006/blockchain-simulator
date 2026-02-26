const fs = require('fs');
const path = require('path');
const PresentationBuilder = require('pptxgenjs');

// Create PowerPoint with 8 slides
function createPowerPoint() {
  const prs = new PresentationBuilder();
  
  // Set slide dimensions
  prs.defineLayout({ name: 'TITLE_SLIDE', master: 'MASTER_1' });
  
  // Slide 1: Title Slide
  let slide1 = prs.addSlide();
  slide1.background = { color: "1F4788" };
  slide1.addText("Blockchain Simulator", {
    x: 0.5, y: 2.0, w: 9, h: 1.5,
    fontSize: 54, bold: true, color: "FFFFFF",
    align: "center", fontFace: "Arial"
  });
  slide1.addText("Educational Tool for Understanding Blockchain Technology", {
    x: 0.5, y: 3.7, w: 9, h: 1.0,
    fontSize: 32, color: "E0E0E0",
    align: "center", fontFace: "Arial"
  });
  slide1.addText("January 2026", {
    x: 0.5, y: 5.5, w: 9, h: 0.5,
    fontSize: 18, color: "B0B0B0",
    align: "center", fontFace: "Arial"
  });

  // Slide 2: What is Blockchain?
  let slide2 = prs.addSlide();
  slide2.background = { color: "FFFFFF" };
  slide2.addText("What is Blockchain?", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points2 = [
    "A distributed ledger of blocks linked together",
    "Each block contains transactions and a reference to the previous block",
    "Uses cryptographic hashing for security and immutability",
    "Decentralized consensus mechanism for validation",
    "Forms the foundation of cryptocurrencies and beyond"
  ];
  
  let yPos = 1.3;
  points2.forEach(point => {
    slide2.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 3: Simulator Features
  let slide3 = prs.addSlide();
  slide3.background = { color: "FFFFFF" };
  slide3.addText("Simulator Features", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points3 = [
    "Block Creation: Create new blocks with multiple transactions",
    "Transaction Management: Add and track transactions",
    "Proof-of-Work Mining: Computational challenge-based validation",
    "Chain Validation: Ensure blockchain integrity",
    "Real-Time Visualization: Interactive web interface"
  ];
  
  yPos = 1.3;
  points3.forEach(point => {
    slide3.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 4: Technical Architecture
  let slide4 = prs.addSlide();
  slide4.background = { color: "FFFFFF" };
  slide4.addText("Technical Architecture", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points4 = [
    "Language: TypeScript with Node.js runtime",
    "Framework: Express.js for API endpoints",
    "Cryptography: SHA-256 hashing algorithm",
    "Frontend: HTML5, CSS3, and JavaScript visualization",
    "Testing: Jest for unit and integration tests"
  ];
  
  yPos = 1.3;
  points4.forEach(point => {
    slide4.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 5: Key Components
  let slide5 = prs.addSlide();
  slide5.background = { color: "FFFFFF" };
  slide5.addText("Key Components", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points5 = [
    "Block Module: Manages individual blocks with hash calculation",
    "Chain Module: Maintains blockchain integrity and validation",
    "Transaction Module: Defines transaction data structure",
    "API Routes: RESTful endpoints for blockchain operations",
    "Visualizer: Web-based UI for blockchain display"
  ];
  
  yPos = 1.3;
  points5.forEach(point => {
    slide5.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 6: How Mining Works
  let slide6 = prs.addSlide();
  slide6.background = { color: "FFFFFF" };
  slide6.addText("How Mining Works", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points6 = [
    "Miners attempt to find a valid block hash",
    "Hash must meet difficulty target (leading zeros)",
    "Nonce incremented until target is found",
    "Demonstrates computational work for security",
    "Adjustable difficulty simulates network conditions"
  ];
  
  yPos = 1.3;
  points6.forEach(point => {
    slide6.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 7: Installation & Usage
  let slide7 = prs.addSlide();
  slide7.background = { color: "FFFFFF" };
  slide7.addText("Installation & Usage", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "1F4788",
    align: "left", fontFace: "Arial"
  });
  
  const points7 = [
    "Install Node.js dependencies: npm install",
    "Start the application: npm start",
    "Access web interface at http://localhost:3000",
    "Use API endpoints to create transactions and mine blocks",
    "Monitor blockchain growth in real-time visualization"
  ];
  
  yPos = 1.3;
  points7.forEach(point => {
    slide7.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "333333",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Slide 8: Educational Value & Future
  let slide8 = prs.addSlide();
  slide8.background = { color: "1F4788" };
  slide8.addText("Educational Value & Future", {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 44, bold: true, color: "FFFFFF",
    align: "left", fontFace: "Arial"
  });
  
  const points8 = [
    "Demonstrates core blockchain concepts interactively",
    "Suitable for students and blockchain enthusiasts",
    "Provides hands-on experience with distributed ledgers",
    "Future enhancements: multi-node simulation, digital signatures",
    "Solid foundation for advanced blockchain studies"
  ];
  
  yPos = 1.3;
  points8.forEach(point => {
    slide8.addText("• " + point, {
      x: 0.7, y: yPos, w: 8.6, h: 0.6,
      fontSize: 18, color: "E0E0E0",
      align: "left", fontFace: "Arial"
    });
    yPos += 0.75;
  });

  // Save PowerPoint
  prs.save({ path: path.join(__dirname, 'BlockchainSimulator_Presentation.pptx') });
  console.log('✓ PowerPoint Presentation created: BlockchainSimulator_Presentation.pptx');
}

createPowerPoint();
