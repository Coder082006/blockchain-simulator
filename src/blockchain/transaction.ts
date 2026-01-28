export class Transaction {
    sender: string;
    recipient: string;
    amount: number;
    timestamp: number;

    constructor(sender: string, recipient: string, amount: number, timestamp: number = Date.now()) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.timestamp = timestamp;
    }

    validate(): boolean {
        // Basic validation: positive amount, distinct parties, non-empty addresses
        return Boolean(this.sender) && Boolean(this.recipient) && this.amount > 0 && this.sender !== this.recipient;
    }

    toString(): string {
        return `${this.sender}${this.recipient}${this.amount}${this.timestamp}`;
    }
}