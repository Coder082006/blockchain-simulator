import { Application, Router } from 'express';
import { handleAddTransaction, handleGetBalance, handleGetChain, handleMine, handleTamperBlock } from './handlers';

export const setupRoutes = (app: Application): void => {
	const router = Router();

	router.post('/transactions', handleAddTransaction);
	router.post('/mine', handleMine);
	router.get('/chain', handleGetChain);
	router.get('/balance/:address', handleGetBalance);
	router.post('/tamper/:index', handleTamperBlock);

	app.use('/api', router);
};