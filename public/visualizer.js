const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let chain = [];
let mempool = []; // Pending transactions waiting to be mined
let animationQueue = [];
let chainData = { chain: [], valid: true };

// Network nodes
let networkNodes = [];
let currentMiningNode = null;
let propagationWaves = [];

// Canvas setup
function resizeCanvas() {
    canvas.width = window.innerWidth - 320;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Network Node class
class NetworkNode {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.radius = 35;
        this.status = 'synced'; // synced, syncing, mining
        this.hasLatestBlock = true;
        this.blockHeight = 0;
        this.propagationProgress = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Node circle
        let color = '#00ff88';
        if (this.status === 'mining') color = '#ff6600';
        else if (this.status === 'syncing') color = '#ffaa00';

        ctx.fillStyle = `rgba(15, 30, 63, 0.8)`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node icon
        ctx.font = '20px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⬢', 0, 0);

        // Node name
        ctx.font = '10px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.name, 0, this.radius + 15);

        // Block height
        ctx.font = '9px monospace';
        ctx.fillStyle = '#aaa';
        ctx.fillText(`H: ${this.blockHeight}`, 0, this.radius + 27);

        // Status indicator
        if (this.status === 'mining') {
            ctx.fillStyle = '#ff6600';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('MINING', 0, -this.radius - 10);
        } else if (this.status === 'syncing') {
            ctx.fillStyle = '#ffaa00';
            ctx.font = 'bold 8px monospace';
            const progress = Math.round(this.propagationProgress * 100);
            ctx.fillText(`SYNC ${progress}%`, 0, -this.radius - 10);
        }

        ctx.restore();
    }
}

// Visual Block with confirmation counter
class VisualBlock {
    constructor(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = 140;
        this.height = 160;
        this.scale = 1;
        this.rotation = 0;
        this.opacity = 1;
        this.isValid = true;
        this.tampered = false;
        this.shakeOffset = 0;
        this.data = { nonce: 0, hash: 'pending', transactions: [] };
        this.pulseAlpha = 0;
        this.confirmations = 0; // How many blocks built on top
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        const drawX = this.x + this.shakeOffset;
        const drawY = this.y;

        ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // Block glow effect
        ctx.shadowColor = this.tampered ? 'rgba(255, 68, 68, 0.8)' : 'rgba(0, 255, 136, 0.6)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Block background
        const color = this.tampered ? '#ff4444' : (this.isValid ? '#00ff88' : '#ff8800');
        ctx.fillStyle = this.tampered ? 'rgba(255, 68, 68, 0.15)' : (this.isValid ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 136, 0, 0.15)');
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        // Draw block with rounded corners
        this.roundRect(ctx, -this.width / 2, -this.height / 2, this.width, this.height, 10);
        ctx.fill();
        ctx.stroke();

        // Block header
        ctx.fillStyle = color;
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`BLOCK #${this.index}`, 0, -this.height / 2 + 12);

        // Confirmation badge
        if (this.confirmations > 0) {
            ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 8, 50, 18);
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`${this.confirmations}x Conf`, -this.width / 2 + 30, -this.height / 2 + 11);
        }

        // Separator line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 + 5, -this.height / 2 + 32);
        ctx.lineTo(this.width / 2 - 5, -this.height / 2 + 32);
        ctx.stroke();
        ctx.globalAlpha = this.opacity;

        // Block content
        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';

        ctx.fillText(`Nonce: ${this.data.nonce}`, 0, -this.height / 2 + 40);
        ctx.fillText(`Txs: ${this.data.transactions?.length || 0}`, 0, -this.height / 2 + 54);

        const hashDisplay = (this.data.hash || 'pending').substring(0, 10);
        ctx.fillText(`Hash: ${hashDisplay}...`, 0, -this.height / 2 + 68);

        // Previous block hash
        if (this.data.previousHash) {
            ctx.fillStyle = 'rgba(255, 170, 0, 0.8)';
            ctx.font = '9px monospace';
            const prevHashDisplay = this.data.previousHash.substring(0, 8);
            ctx.fillText(`Prev: ${prevHashDisplay}...`, 0, -this.height / 2 + 82);
            ctx.fillStyle = color;
            ctx.font = '10px monospace';
        }

        if (this.data.timestamp) {
            const date = new Date(this.data.timestamp).toLocaleTimeString();
            ctx.fillText(`${date}`, 0, -this.height / 2 + 96);
        }

        // Tampered indicator
        if (this.tampered) {
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('⚠️ TAMPERED', 0, this.height / 2 - 25);
        }

        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// Animation helper
function animate(duration, update, onComplete) {
    animationQueue.push({ duration, update, onComplete, elapsed: 0 });
}

function updateAnimations(deltaTime) {
    for (let i = animationQueue.length - 1; i >= 0; i--) {
        const anim = animationQueue[i];
        anim.elapsed += deltaTime;
        const progress = Math.min(anim.elapsed / anim.duration, 1);
        anim.update(progress);

        if (progress === 1) {
            if (anim.onComplete) anim.onComplete();
            animationQueue.splice(i, 1);
        }
    }
}

// Draw chain links
function drawLinks(ctx) {
    if (chain.length < 2) return;

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);

    for (let i = 0; i < chain.length - 1; i++) {
        const from = chain[i];
        const to = chain[i + 1];

        const startX = from.x + from.width;
        const startY = from.y + from.height / 2;
        const endX = to.x;
        const endY = to.y + to.height / 2;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head pointing to next block
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 12 * Math.cos(angle - 0.5), endY - 12 * Math.sin(angle - 0.5));
        ctx.lineTo(endX - 12 * Math.cos(angle + 0.5), endY - 12 * Math.sin(angle + 0.5));
        ctx.closePath();
        ctx.fill();
    }

    ctx.setLineDash([]);
}

// Draw network connections between nodes
function drawNetworkConnections(ctx) {
    if (networkNodes.length < 2) return;
    
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    
    for (let i = 0; i < networkNodes.length - 1; i++) {
        const node1 = networkNodes[i];
        const node2 = networkNodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

// Draw propagation waves
function drawPropagationWaves(ctx) {
    propagationWaves.forEach((wave, index) => {
        const progress = wave.progress;
        const alpha = 1 - progress;
        const radius = wave.radius * progress;

        ctx.strokeStyle = `rgba(0, 255, 136, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        wave.progress += 0.02;
        if (wave.progress >= 1) {
            propagationWaves.splice(index, 1);
        }
    });
}

// Main render loop
let lastTime = Date.now();
function render() {
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 60) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    updateAnimations(deltaTime);
    
    // Draw network layer
    if (networkNodes && networkNodes.length > 0) {
        drawNetworkConnections(ctx);
        networkNodes.forEach(node => node.draw(ctx));
        drawPropagationWaves(ctx);
    }
    
    // Draw blockchain layer
    drawLinks(ctx);
    chain.forEach(block => block.draw(ctx));

    requestAnimationFrame(render);
}

render();

// Helper functions
function addStatus(message, type = 'info') {
    const status = document.getElementById('statusInfo');
    const className = type ? ` class="${type}"` : '';
    const timestamp = new Date().toLocaleTimeString();
    status.innerHTML += `<div class="status${className}">[${timestamp}] ${message}</div>`;
    status.scrollTop = status.scrollHeight;

    if (status.children.length > 15) {
        status.removeChild(status.firstChild);
    }
}

function setFlowStage(stageName, status = 'active') {
    // Reset all stages
    document.querySelectorAll('.flow-stage').forEach(stage => {
        stage.classList.remove('active');
    });
    document.querySelectorAll('.stage-indicator').forEach(indicator => {
        indicator.classList.remove('active', 'complete');
    });

    // Set current stage
    const stageElement = document.querySelector(`.flow-stage[data-stage="${stageName}"]`);
    const indicatorElement = document.getElementById(`stage-${stageName}`);
    
    if (stageElement && status === 'active') {
        stageElement.classList.add('active');
    }
    
    if (indicatorElement) {
        indicatorElement.classList.add(status);
    }

    // Mark previous stages as complete
    const stages = ['validate', 'mempool', 'bundle', 'mine', 'propagate', 'confirm'];
    const currentIndex = stages.indexOf(stageName);
    if (currentIndex > 0) {
        for (let i = 0; i < currentIndex; i++) {
            const prevIndicator = document.getElementById(`stage-${stages[i]}`);
            if (prevIndicator) {
                prevIndicator.classList.add('complete');
            }
        }
    }
}

function resetFlowStages() {
    document.querySelectorAll('.flow-stage').forEach(stage => {
        stage.classList.remove('active');
    });
    document.querySelectorAll('.stage-indicator').forEach(indicator => {
        indicator.classList.remove('active', 'complete');
    });
}

// Initialize network nodes
function initializeNodes() {
    const nodeY = 80;
    const spacing = (canvas.width - 100) / 4;
    networkNodes = [
        new NetworkNode(0, 'Node-A', 80, nodeY),
        new NetworkNode(1, 'Node-B', 80 + spacing, nodeY),
        new NetworkNode(2, 'Node-C', 80 + spacing * 2, nodeY),
        new NetworkNode(3, 'Node-D', 80 + spacing * 3, nodeY)
    ];
    console.log('Network nodes initialized:', networkNodes.length);
    updateNodeStatusPanel();
}

// Update node status panel in sidebar
function updateNodeStatusPanel() {
    const panel = document.getElementById('nodeStatusPanel');
    if (!panel) return;

    panel.innerHTML = '';
    networkNodes.forEach(node => {
        const nodeItem = document.createElement('div');
        nodeItem.className = `node-item ${node.status}`;
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `node-status-indicator ${node.status}`;
        
        const nodeInfo = document.createElement('span');
        nodeInfo.style.flex = '1';
        nodeInfo.textContent = `${node.name} (H:${node.blockHeight})`;
        
        const statusText = document.createElement('span');
        statusText.style.fontSize = '9px';
        statusText.style.color = '#888';
        if (node.status === 'synced') statusText.textContent = '✓ Synced';
        else if (node.status === 'mining') statusText.textContent = '⛏ Mining';
        else if (node.status === 'syncing') statusText.textContent = '↻ Syncing';
        
        nodeItem.appendChild(statusIndicator);
        nodeItem.appendChild(nodeInfo);
        nodeItem.appendChild(statusText);
        panel.appendChild(nodeItem);
    });
}

function updateNodeStatusPanel() {
    const panel = document.getElementById('nodeStatusPanel');
    if (!panel) return;

    panel.innerHTML = '';
    networkNodes.forEach(node => {
        const nodeItem = document.createElement('div');
        nodeItem.className = `node-item ${node.status}`;
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `node-status-indicator ${node.status}`;
        
        const nodeInfo = document.createElement('span');
        nodeInfo.style.flex = '1';
        nodeInfo.textContent = `${node.name} (H:${node.blockHeight})`;
        
        const statusText = document.createElement('span');
        statusText.style.fontSize = '9px';
        statusText.style.color = '#888';
        if (node.status === 'synced') statusText.textContent = '✓ Synced';
        else if (node.status === 'mining') statusText.textContent = '⛏ Mining';
        else if (node.status === 'syncing') statusText.textContent = '↻ Syncing';
        
        nodeItem.appendChild(statusIndicator);
        nodeItem.appendChild(nodeInfo);
        nodeItem.appendChild(statusText);
        panel.appendChild(nodeItem);
    });
}

async function fetchChain() {
    try {
        const res = await fetch('/api/chain');
        chainData = await res.json();
        return chainData;
    } catch (e) {
        console.error(e);
        addStatus(`⚠️ Failed to fetch chain: ${e.message}`, 'error');
        return { chain: [], valid: true };
    }
}

async function addTransaction() {
    const sender = document.getElementById('senderInput').value.trim();
    const recipient = document.getElementById('recipientInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);

    if (!sender || !recipient || !amount) {
        addStatus('❌ Please fill all fields', 'error');
        return false;
    }

    try {
        // Stage 1: Validate
        setFlowStage('validate', 'active');
        addStatus(`🔍 Stage 1: Validating transaction (${sender} → ${recipient}, ${amount})`, 'info');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, recipient, amount })
        });

        if (!res.ok) throw new Error(await res.json().then(d => d.message));

        addStatus(`✅ Validation passed: Signature valid, Balance sufficient`, 'success');
        await new Promise(resolve => setTimeout(resolve, 300));

        // Stage 2: Add to mempool
        setFlowStage('mempool', 'active');
        addStatus(`📨 Stage 2: Broadcasting to mempool...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 400));

        const tx = { sender, recipient, amount, status: 'pending' };
        mempool.push(tx);

        addStatus(`✅ TX added to mempool (Waiting for miner to bundle)`, 'success');
        updateMempoolList();
        
        // Reset flow after a delay
        setTimeout(() => resetFlowStages(), 2000);
        
        return true;
    } catch (e) {
        addStatus(`❌ Validation failed: ${e.message}`, 'error');
        resetFlowStages();
        return false;
    }
}

async function mineBlock() {
    const minerAddress = document.getElementById('minerInput').value.trim();
    if (!minerAddress) {
        addStatus('❌ Enter miner address', 'error');
        return false;
    }

    if (mempool.length === 0) {
        addStatus('❌ No pending transactions in mempool to mine', 'error');
        return false;
    }

    try {
        // Stage 3: Bundling transactions
        setFlowStage('bundle', 'active');
        addStatus(`📦 Stage 3: Bundling ${mempool.length} transaction(s) from mempool...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
        addStatus(`✅ Transactions bundled into candidate block`, 'success');

        // Stage 4: Mining
        setFlowStage('mine', 'active');
        addStatus('⛏️ Stage 4: Mining (Proof-of-Work)... Finding valid nonce', 'warning');
        await new Promise(resolve => setTimeout(resolve, 300));

        const res = await fetch('/api/mine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minerAddress })
        });

        if (!res.ok) throw new Error(await res.json().then(d => d.message));

        const { block } = await res.json();
        addStatus(`✅ Valid hash found! Nonce: ${block.nonce}`, 'success');
        await new Promise(resolve => setTimeout(resolve, 400));

        // Stage 5: Propagation
        setFlowStage('propagate', 'active');
        addStatus(`📡 Stage 5: Broadcasting block #${block.index} to network...`, 'info');
        
        // Only do network propagation if nodes are initialized
        if (networkNodes && networkNodes.length > 0) {
            // Select random mining node
            currentMiningNode = networkNodes[Math.floor(Math.random() * networkNodes.length)];
            currentMiningNode.status = 'mining';
            updateNodeStatusPanel();
            
            // Create propagation wave from mining node
            propagationWaves.push({
                x: currentMiningNode.x,
                y: currentMiningNode.y,
                radius: 200,
                progress: 0
            });
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Propagate to other nodes with delays
            for (let i = 0; i < networkNodes.length; i++) {
                const node = networkNodes[i];
                if (node.id === currentMiningNode.id) {
                    node.blockHeight = block.index + 1;
                    node.status = 'synced';
                    addStatus(`✓ ${node.name} confirmed block #${block.index}`, 'success');
                } else {
                    node.status = 'syncing';
                    node.propagationProgress = 0;
                }
            }
            updateNodeStatusPanel();
            
            // Simulate propagation delay to other nodes
            for (let delay = 0; delay < networkNodes.length - 1; delay++) {
                await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
                
                // Find next node to sync
                const syncingNode = networkNodes.find(n => n.status === 'syncing' && n.id !== currentMiningNode.id);
                if (syncingNode) {
                    // Animate sync progress
                    await animate(300, (progress) => {
                        syncingNode.propagationProgress = progress;
                    });
                    
                    syncingNode.blockHeight = block.index + 1;
                    syncingNode.status = 'synced';
                    syncingNode.propagationProgress = 0;
                    addStatus(`✓ ${syncingNode.name} received block #${block.index}`, 'success');
                    updateNodeStatusPanel();
                }
            }
            
            addStatus(`✅ Block propagated to all ${networkNodes.length} network nodes`, 'success');
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            addStatus(`✅ Block propagated to network`, 'success');
        }

        // Validate and update confirmation counts
        chain.forEach(b => b.confirmations++);
        mempool = []; // Mempool cleared

        // Create and animate new block
        const spacing = 180;
        const newVisualBlock = new VisualBlock(
            block.index,
            chain.length * spacing + 50,
            canvas.height / 2 - 80
        );

        newVisualBlock.scale = 0;
        newVisualBlock.opacity = 0;
        newVisualBlock.data = block;
        newVisualBlock.confirmations = 0; // New block has 0 confirmations
        chain.push(newVisualBlock);

        // Pop-in animation
        animate(600, (progress) => {
            const easeOut = 1 - Math.pow(1 - progress, 3);
            newVisualBlock.scale = easeOut;
            newVisualBlock.opacity = progress;
        }, async () => {
            addStatus(`✅ Block propagated to network nodes`, 'success');
            await new Promise(resolve => setTimeout(resolve, 400));

            // Stage 6: Confirmation
            setFlowStage('confirm', 'active');
            addStatus(`🎉 Stage 6: BLOCK CONFIRMED! #${block.index} added to chain`, 'success');
            addStatus(`📊 Block #${block.index} | Nonce: ${block.nonce} | ${block.transactions.length} TX | ${chain.length - 1} confirmations on previous blocks`, 'info');
            
            updateBlockList();
            updateMempoolList();

            // Reset flow after completion
            setTimeout(() => resetFlowStages(), 3000);
        });

        return true;
    } catch (e) {
        addStatus(`❌ Mining failed: ${e.message}`, 'error');
        resetFlowStages();
        return false;
    }
}

async function tamperBlock(blockIndex) {
    try {
        const res = await fetch(`/api/tamper/${blockIndex}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newData: '999' })
        });

        if (!res.ok) throw new Error(await res.json().then(d => d.message));

        // Find and animate tamper effect
        const targetBlock = chain.find(b => b.index === blockIndex);
        if (targetBlock) {
            targetBlock.tampered = true;
            targetBlock.isValid = false;

            // Shake animation
            animate(600, (progress) => {
                targetBlock.shakeOffset = Math.sin(progress * Math.PI * 6) * 8;
            });

            addStatus(`⚠️ Block #${blockIndex} TAMPERED! Chain integrity broken!`, 'error');
        }

        await fetchChain();
        updateBlockList();
        return true;
    } catch (e) {
        addStatus(`❌ Tamper failed: ${e.message}`, 'error');
        return false;
    }
}

async function tamperBlockFromInput() {
    const blockIndexInput = document.getElementById('tamperBlockInput');
    const blockIndex = parseInt(blockIndexInput.value);

    if (isNaN(blockIndex) || blockIndex < 0) {
        addStatus('❌ Please enter a valid block index (0 or greater)', 'error');
        return;
    }

    if (blockIndex >= chainData.chain.length) {
        addStatus(`❌ Block #${blockIndex} does not exist. Chain has ${chainData.chain.length} blocks (0-${chainData.chain.length - 1})`, 'error');
        return;
    }

    if (blockIndex === 0) {
        addStatus('⚠️ Cannot tamper with genesis block (Block #0)', 'warning');
        return;
    }

    addStatus(`💥 Attempting to tamper with Block #${blockIndex}...`, 'warning');
    await tamperBlock(blockIndex);
    blockIndexInput.value = '';
}

async function resetChain() {
    try {
        chain = [];
        mempool = [];
        propagationWaves = [];
        await fetchChain();

        // Render genesis block
        const genesisBlock = new VisualBlock(0, 50, canvas.height / 2 - 80);
        genesisBlock.data = chainData.chain[0] || { nonce: 0, hash: 'genesis', transactions: [] };
        chain.push(genesisBlock);
        
        // Reset all nodes to genesis
        if (networkNodes && networkNodes.length > 0) {
            networkNodes.forEach(node => {
                node.blockHeight = 1;
                node.status = 'synced';
                node.propagationProgress = 0;
            });
            updateNodeStatusPanel();
        }

        addStatus('🔄 Chain reset to genesis block', 'success');
        updateBlockList();
        updateMempoolList();
    } catch (e) {
        addStatus(`❌ Reset failed: ${e.message}`, 'error');
    }
}

async function startAutoDemo() {
    addStatus('▶️ Starting auto demo...', 'warning');

    // Step 1: Add transaction
    document.getElementById('senderInput').value = 'alice';
    document.getElementById('recipientInput').value = 'bob';
    document.getElementById('amountInput').value = '50';

    await new Promise(resolve => setTimeout(resolve, 500));
    await addTransaction();

    // Step 2: Mine
    document.getElementById('minerInput').value = 'demo-miner';
    await new Promise(resolve => setTimeout(resolve, 1000));
    await mineBlock();

    await new Promise(resolve => setTimeout(resolve, 1000));
    addStatus('✅ Demo complete! Valid block added to chain.', 'success');
}

function updateMempoolList() {
    const mempoolPanel = document.getElementById('mempoolList');
    if (!mempoolPanel) {
        console.warn('Mempool list element not found');
        return;
    }

    mempoolPanel.innerHTML = '';
    
    if (mempool.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.color = '#888';
        emptyMsg.style.fontSize = '12px';
        emptyMsg.style.padding = '8px';
        emptyMsg.textContent = 'No pending transactions';
        mempoolPanel.appendChild(emptyMsg);
        return;
    }

    mempool.forEach((tx, idx) => {
        const txElement = document.createElement('div');
        txElement.style.cssText = `
            padding: 8px;
            margin: 4px 0;
            background: rgba(255, 170, 0, 0.1);
            border-left: 3px solid #ffaa00;
            font-size: 11px;
            animation: pulse-glow 1.5s infinite;
            border-radius: 2px;
        `;
        txElement.innerHTML = `
            <div style="color: #ffaa00; font-weight: bold;">TX #${idx + 1}</div>
            <div style="color: #aaa; margin-top: 2px;">
                ${tx.sender.substring(0, 8)}... → ${tx.recipient.substring(0, 8)}...
            </div>
            <div style="color: #888; margin-top: 2px;">
                Amount: ${tx.amount}
            </div>
        `;
        mempoolPanel.appendChild(txElement);
    });
}

async function updateBlockList() {
    await fetchChain();
    const list = document.getElementById('blockList');
    list.innerHTML = '';

    chainData.chain.forEach((block, i) => {
        const item = document.createElement('div');
        const isTampered = block.transactions.some(tx => tx.sender === 'TAMPERED');
        item.className = `block-item ${isTampered || !chainData.valid ? 'invalid' : ''}`;

        item.innerHTML = `
            <strong>Block #${block.index}</strong>
            Nonce: ${block.nonce} | Txs: ${block.transactions.length}
            Hash: ${block.hash.substring(0, 12)}...
            ${isTampered ? '<br>⚠️ TAMPERED' : ''}
        `;
        list.appendChild(item);
    });

    const statusText = chainData.valid ? '✅ VALID' : '❌ INVALID';
    addStatus(`📦 Chain: ${chainData.chain.length} blocks (${statusText})`, chainData.valid ? 'success' : 'error');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initializeNodes();
    resetChain();
});
