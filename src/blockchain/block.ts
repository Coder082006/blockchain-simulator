import crypto from 'crypto';
import { Transaction } from './transaction';

export class Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, transactions: Transaction[], previousHash: string, timestamp: number = Date.now()) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        const data = `${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.transactions)}${this.nonce}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    mineBlock(difficulty: number, progressCallback?: (nonce: number, hash: string) => void): void {
        const target = '0'.repeat(Math.max(0, difficulty));
        while (!this.hash.startsWith(target)) {
            this.nonce += 1;
            this.hash = this.calculateHash();
            if (progressCallback) {
                progressCallback(this.nonce, this.hash);
            }
        }
    }
}