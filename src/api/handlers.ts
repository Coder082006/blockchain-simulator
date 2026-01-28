import { Request, Response } from 'express';
import { Blockchain } from '../blockchain/chain';
import { Transaction } from '../blockchain/transaction';

const blockchain = new Blockchain();

export const handleAddTransaction = (req: Request, res: Response) => {
    const { sender, recipient, amount } = req.body;

    if (!sender || !recipient || typeof amount !== 'number') {
        return res.status(400).json({ message: 'sender, recipient, and numeric amount are required' });
    }

    try {
        const transaction = new Transaction(sender, recipient, amount);
        blockchain.addTransaction(transaction);
        return res.status(201).json({ message: 'Transaction queued for mining', transaction });
    } catch (err) {
        return res.status(400).json({ message: (err as Error).message });
    }
};

export const handleMine = (req: Request, res: Response) => {
    const { minerAddress } = req.body;
    if (!minerAddress) {
        return res.status(400).json({ message: 'minerAddress is required to receive rewards' });
    }

    const minedBlock = blockchain.minePendingTransactions(minerAddress);
    return res.status(201).json({ message: 'Block mined', block: minedBlock });
};

export const handleGetChain = (_req: Request, res: Response) => {
    return res.status(200).json({ 
        chain: blockchain.getChain(), 
        valid: blockchain.isChainValid(),
        miningProgress: blockchain.miningProgress
    });
};

export const handleGetBalance = (req: Request, res: Response) => {
    const { address } = req.params;
    if (!address) {
        return res.status(400).json({ message: 'address param is required' });
    }
    const balance = blockchain.getBalanceOfAddress(address);
    return res.status(200).json({ address, balance });
};

export const handleTamperBlock = (req: Request, res: Response) => {
    const blockIndex = parseInt(req.params.index);
    const { newData } = req.body;

    if (isNaN(blockIndex) || blockIndex < 0 || blockIndex >= blockchain.chain.length) {
        return res.status(400).json({ message: 'Invalid block index' });
    }

    if (!newData) {
        return res.status(400).json({ message: 'newData is required' });
    }

    // Tamper with the block by adding fake transaction
    const block = blockchain.chain[blockIndex];
    const fakeTransaction = new Transaction('TAMPERED', 'HACKER', parseFloat(newData) || 999);
    block.transactions.push(fakeTransaction);
    
    // Don't recalculate hash - this simulates tampering
    const valid = blockchain.isChainValid();
    
    return res.status(200).json({ 
        message: 'Block tampered! Chain should now be invalid.', 
        block,
        chainValid: valid 
    });
};