const apiBase = '/api';

const statusEl = document.getElementById('status-message');
const validityEl = document.getElementById('chain-validity');
const chainContainer = document.getElementById('chain-container');
const addTxForm = document.getElementById('add-transaction');
const mineForm = document.getElementById('mine-form');
const balanceForm = document.getElementById('balance-form');
const balanceResult = document.getElementById('balance-result');
const refreshBtn = document.getElementById('refresh-chain');
const demoPlayBtn = document.getElementById('demo-play');
const demoStopBtn = document.getElementById('demo-stop');
const visualBtn = document.getElementById('visual-btn');

let tutorialStep = 1;
let demoRunning = false;
let demoAbort = false;
let currentChain = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateTutorial = (step) => {
    tutorialStep = step;
    document.querySelectorAll('.step').forEach((el, idx) => {
        el.classList.remove('active');
        if (idx + 1 === step) {
            el.classList.add('active');
        }
    });
};

const showStatus = (text, good = true) => {
    statusEl.textContent = text;
    statusEl.style.color = good ? '#7cf29a' : '#ff8585';
};

const formatTime = (ts) => new Date(ts).toLocaleString();

const renderChain = (chain, valid) => {
    chainContainer.innerHTML = '';
    validityEl.textContent = valid ? '✓ Chain valid' : '✗ Chain INVALID';
    validityEl.style.color = valid ? '#7cf29a' : '#ff8585';

    chain.forEach((block, idx) => {
        // Add visual link arrow between blocks
        if (idx > 0) {
            const link = document.createElement('div');
            link.className = 'chain-link';
            chainContainer.appendChild(link);
        }

        const card = document.createElement('div');
        card.className = 'block';
        card.dataset.index = block.index;
        
        // Check if this block has been tampered with (contains TAMPERED transaction)
        const isTampered = block.transactions.some(tx => tx.sender === 'TAMPERED');
        
        if (isTampered) {
            card.classList.add('invalid');
        }

        const header = document.createElement('header');
        const title = document.createElement('div');
        title.innerHTML = `<strong>Block #${block.index}</strong>`;
        const ts = document.createElement('div');
        ts.className = 'hint';
        ts.textContent = formatTime(block.timestamp);
        header.appendChild(title);
        header.appendChild(ts);

        const prev = document.createElement('div');
        prev.className = 'hash';
        prev.innerHTML = `<span class="tooltip">Prev Hash<span class="tooltiptext">Links to previous block. If changed, all following blocks break.</span></span>: ${block.previousHash.substring(0, 16)}...`;

        const hash = document.createElement('div');
        hash.className = 'hash';
        
        if (isTampered) {
            hash.classList.add('hash-mismatch');
            hash.innerHTML = `<span class="tooltip">⚠️ Hash Mismatch - Block Tampered!<span class="tooltiptext">This block's data was changed (transaction added), but the hash wasn't recalculated. This is how tampering is detected!</span></span>: ${block.hash.substring(0, 16)}...`;
        } else {
            hash.innerHTML = `<span class="tooltip">Hash<span class="tooltiptext">Unique cryptographic fingerprint of this block's data. Change 1 byte → hash changes completely.</span></span>: ${block.hash.substring(0, 16)}...`;
        }

        const nonce = document.createElement('div');
        nonce.className = 'hint';
        nonce.innerHTML = `<span class="tooltip">Nonce<span class="tooltiptext">Number incremented during mining. Found when hash starts with difficulty zeros (${block.hash.substring(0, 3)} = ${block.hash.substring(0, 3).match(/0/g)?.length || 0} leading zeros).</span></span>: ${block.nonce}`;

        const txList = document.createElement('div');
        txList.className = 'transactions';
        if (block.transactions.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'hint';
            empty.textContent = 'No transactions';
            txList.appendChild(empty);
        } else {
            block.transactions.forEach((tx) => {
                const item = document.createElement('div');
                item.className = 'transaction';
                if (tx.sender === 'TAMPERED') {
                    item.style.color = '#ff8585';
                    item.style.fontWeight = 'bold';
                }
                item.textContent = `${tx.sender} → ${tx.recipient} : ${tx.amount}`;
                txList.appendChild(item);
            });
        }

        // Add tamper button (except genesis)
        if (idx > 0) {
            const tamperBtn = document.createElement('button');
            tamperBtn.className = 'tamper-btn';
            tamperBtn.textContent = '⚠️ Tamper with this block';
            tamperBtn.onclick = () => tamperBlock(idx);
            card.appendChild(tamperBtn);
        }

        card.appendChild(header);
        card.appendChild(prev);
        card.appendChild(hash);
        card.appendChild(nonce);
        card.appendChild(txList);
        chainContainer.appendChild(card);
    });
};

const calculateBlockHash = (block) => {
    // Simple SHA256 simulation for display (actual hash is computed server-side)
    const data = `${block.index}${block.previousHash}${block.timestamp}${JSON.stringify(block.transactions)}${block.nonce}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const chr = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
};

const fetchChain = async () => {
    try {
        showStatus('Fetching chain...');
        const res = await fetch(`${apiBase}/chain`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        currentChain = data.chain || [];
        renderChain(currentChain, data.valid);
        showStatus('Chain updated.');
        
        // Show mining progress if active
        if (data.miningProgress && data.miningProgress.isActive) {
            showStatus(`⛏️ Mining... Nonce: ${data.miningProgress.nonce} | Hash: ${data.miningProgress.currentHash.substring(0, 16)}...`);
        }
    } catch (err) {
        console.error(err);
        showStatus(`Failed to fetch chain: ${err.message}`, false);
    }
};

const submitTransaction = async (sender, recipient, amount) => {
    try {
        showStatus('Submitting transaction...');
        const res = await fetch(`${apiBase}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, recipient, amount: Number(amount) })
        });
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `HTTP ${res.status}`);
        }
        await res.json();
        showStatus('✓ Transaction queued. Now mine to include it in a block.');
        updateTutorial(2); // Move to Step 2
    } catch (err) {
        console.error(err);
        showStatus(`Failed to add transaction: ${err.message}`, false);
    }
};

const mineBlock = async (minerAddress) => {
    try {
        showStatus('⛏️ Mining... this may take a moment (computing proof-of-work)');
        const res = await fetch(`${apiBase}/mine`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minerAddress })
        });
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `HTTP ${res.status}`);
        }
        const minedBlock = await res.json();
        showStatus(`✓ Block mined! Nonce: ${minedBlock.block.nonce} | Hash: ${minedBlock.block.hash.substring(0, 16)}...`);
        updateTutorial(3); // Move to Step 3
        
        // Polling for updates during mining
        let pollCount = 0;
        const pollInterval = setInterval(async () => {
            pollCount++;
            if (pollCount > 20) {
                clearInterval(pollInterval);
                await fetchChain();
            } else {
                await fetchChain();
            }
        }, 500);
    } catch (err) {
        console.error(err);
        showStatus(`Mining failed: ${err.message}`, false);
    }
};

const tamperBlock = async (blockIndex, options = { skipConfirm: false }) => {
    if (!options.skipConfirm) {
        if (!confirm(`Tamper with block #${blockIndex}? This will demonstrate how tampering breaks the chain!`)) {
            return;
        }
    }
    try {
        showStatus('Tampering with block...');
        const res = await fetch(`${apiBase}/tamper/${blockIndex}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newData: '999' })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        showStatus('⚠️ Block tampered! Check chain validity.', false);
        updateTutorial(4); // Move to Step 4
        await fetchChain();
    } catch (err) {
        console.error(err);
        showStatus(`Tamper failed: ${err.message}`, false);
    }
};

const fetchBalance = async (address) => {
    try {
        balanceResult.textContent = 'Fetching balance...';
        const res = await fetch(`${apiBase}/balance/${encodeURIComponent(address)}`);
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        balanceResult.textContent = `${data.address} balance: ${data.balance}`;
    } catch (err) {
        console.error(err);
        balanceResult.textContent = `Error: ${err.message}`;
    }
};

addTxForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sender = document.getElementById('sender').value.trim();
    const recipient = document.getElementById('recipient').value.trim();
    const amount = document.getElementById('amount').value;
    if (!sender || !recipient || !amount) return;
    await submitTransaction(sender, recipient, amount);
    addTxForm.reset();
});

mineForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const miner = document.getElementById('miner-address').value.trim();
    if (!miner) return;
    await mineBlock(miner);
});

balanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('balance-address').value.trim();
    if (!address) return;
    await fetchBalance(address);
});

refreshBtn.addEventListener('click', fetchChain);

document.addEventListener('DOMContentLoaded', fetchChain);

// --- Demo helpers ---

const flashBlock = (blockIndex) => {
    const card = Array.from(document.querySelectorAll('.block')).find(c => Number(c.dataset.index) === Number(blockIndex));
    if (!card) return;
    card.classList.add('flash');
    setTimeout(() => card.classList.remove('flash'), 1500);
};

const runDemo = async () => {
    if (demoRunning) return;
    demoRunning = true;
    demoAbort = false;

    try {
        showStatus('🎬 Demo: queuing a transaction...');
        updateTutorial(1);
        await submitTransaction('demo-alice', 'demo-bob', 2.5);
        await sleep(800);
        if (demoAbort) throw new Error('Demo stopped');

        showStatus('🎬 Demo: mining block (watch nonce/hash)...');
        updateTutorial(2);
        await mineBlock('demo-miner');
        await sleep(1200);
        if (demoAbort) throw new Error('Demo stopped');

        await fetchChain();
        const latestIndex = currentChain.length ? currentChain[currentChain.length - 1].index : 0;
        flashBlock(latestIndex);
        await sleep(1000);

        showStatus('🎬 Demo: tampering with the first mined block...');
        const targetIndex = currentChain.length > 1 ? currentChain[1].index : currentChain[0]?.index;
        if (typeof targetIndex === 'number') {
            await tamperBlock(targetIndex, { skipConfirm: true });
            flashBlock(targetIndex);
        }
        await sleep(1000);
        if (demoAbort) throw new Error('Demo stopped');

        showStatus('✅ Demo complete. Chain should show invalid after tamper.');
    } catch (err) {
        if (err.message !== 'Demo stopped') {
            console.error(err);
            showStatus(`Demo error: ${err.message}`, false);
        } else {
            showStatus('Demo stopped.', false);
        }
    } finally {
        demoRunning = false;
        demoAbort = false;
    }
};

const stopDemo = () => {
    demoAbort = true;
};

demoPlayBtn.addEventListener('click', runDemo);
demoStopBtn.addEventListener('click', stopDemo);

if (visualBtn) {
    visualBtn.addEventListener('click', () => window.location.href = '/visualizer.html');
} else {
    console.warn('Visual button not found');
    // Add click handler to any button with id visual-btn when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('visual-btn');
        if (btn) {
            btn.addEventListener('click', () => window.location.href = '/visualizer.html');
        }
    });
}
