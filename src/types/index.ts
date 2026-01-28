export interface Transaction {
    sender: string;
    recipient: string;
    amount: number;
    timestamp: number;
}

export interface Block {
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;
}

export interface Blockchain {
    addTransaction(transaction: Transaction): void;
    minePendingTransactions(minerAddress: string): Block;
    getChain(): Block[];
    isChainValid(): boolean;
    getBalanceOfAddress(address: string): number;
}