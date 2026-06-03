import { Router } from 'express';

const router = Router();

export default function categoryRoutes(db) {
  router.get('/', (req, res) => {
    const categories = db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  });

  return router;
}
