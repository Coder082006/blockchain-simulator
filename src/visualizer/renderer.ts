import { Block, Transaction } from '../types';

export function renderChain(chain: Block[]): void {
    const chainContainer = document.getElementById('chain');
    if (chainContainer) {
        chainContainer.innerHTML = '';
        chain.forEach(block => {
            renderBlock(block);
        });
    }
}

export function renderBlock(block: Block): void {
    const blockContainer = document.createElement('div');
    blockContainer.className = 'block';
    
    const blockIndex = document.createElement('h3');
    blockIndex.innerText = `Block #${block.index}`;
    
    const blockHash = document.createElement('p');
    blockHash.innerText = `Hash: ${block.hash}`;
    
    const blockPrevHash = document.createElement('p');
    blockPrevHash.innerText = `Previous Hash: ${block.previousHash}`;
    
    const blockTimestamp = document.createElement('p');
    blockTimestamp.innerText = `Timestamp: ${new Date(block.timestamp).toLocaleString()}`;
    
    const transactionsList = document.createElement('ul');
    block.transactions.forEach((transaction: Transaction) => {
        const transactionItem = document.createElement('li');
        transactionItem.innerText = `From: ${transaction.sender} To: ${transaction.recipient} Amount: ${transaction.amount}`;
        transactionsList.appendChild(transactionItem);
    });
    
    blockContainer.appendChild(blockIndex);
    blockContainer.appendChild(blockHash);
    blockContainer.appendChild(blockPrevHash);
    blockContainer.appendChild(blockTimestamp);
    blockContainer.appendChild(transactionsList);
    
    const chainContainer = document.getElementById('chain');
    if (chainContainer) {
        chainContainer.appendChild(blockContainer);
    }
}
