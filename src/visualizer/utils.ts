function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export { formatDate, generateRandomColor };