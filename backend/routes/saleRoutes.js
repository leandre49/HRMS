import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from '../controllers/saleController.js';

const router = Router();

router.use(verifyToken);

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

export default router;
