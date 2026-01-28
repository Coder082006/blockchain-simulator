import { Block } from './block';
import { Transaction } from './transaction';

export interface MiningProgress {
    isActive: boolean;
    nonce: number;
    currentHash: string;
    targetDifficulty: number;
}

export class Blockchain {
    chain: Block[];
    pendingTransactions: Transaction[];
    difficulty: number;
    miningReward: number;
    miningProgress: MiningProgress;

    constructor(difficulty: number = 3, miningReward: number = 10) {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.miningReward = miningReward;
        this.miningProgress = {
            isActive: false,
            nonce: 0,
            currentHash: '',
            targetDifficulty: difficulty
        };
    }

    private createGenesisBlock(): Block {
        return new Block(0, [], '0');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.validate()) {
            throw new Error('Invalid transaction');
        }
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(minerAddress: string): Block {
        // Add mining reward to the transactions being mined
        const rewardTx = new Transaction('SYSTEM', minerAddress, this.miningReward);
        const transactionsToMine = [...this.pendingTransactions, rewardTx];
        
        const block = new Block(
            this.chain.length,
            transactionsToMine,
            this.getLatestBlock().hash
        );

        this.miningProgress.isActive = true;
        this.miningProgress.targetDifficulty = this.difficulty;

        block.mineBlock(this.difficulty, (nonce, hash) => {
            this.miningProgress.nonce = nonce;
            this.miningProgress.currentHash = hash;
        });

        this.miningProgress.isActive = false;
        this.chain.push(block);

        // Clear pending transactions
        this.pendingTransactions = [];

        return block;
    }

    getBalanceOfAddress(address: string): number {
        let balance = 0;
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.sender === address) balance -= tx.amount;
                if (tx.recipient === address) balance += tx.amount;
            }
        }
        return balance;
    }

    getChain(): Block[] {
        return this.chain;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            const recalculatedHash = currentBlock.calculateHash();
            if (currentBlock.hash !== recalculatedHash) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}