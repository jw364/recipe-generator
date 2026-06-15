import { Request, Response, NextFunction } from 'express';
import type { RecipeRequest } from '../types/index';

export function validateRecipeRequest(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Partial<RecipeRequest>;

  if (!body.ingredients || !Array.isArray(body.ingredients)) {
    res.status(400).json({ success: false, error: 'ingredients must be a non-empty array.' });
    return;
  }

  if (body.ingredients.length === 0) {
    res.status(400).json({ success: false, error: 'At least one ingredient is required.' });
    return;
  }

  if (body.ingredients.length > 30) {
    res.status(400).json({ success: false, error: 'Too many ingredients (maximum 30).' });
    return;
  }

  const invalid = body.ingredients.find(
    (i) => typeof i !== 'string' || i.trim().length === 0 || i.length > 100
  );
  if (invalid !== undefined) {
    res.status(400).json({ success: false, error: 'Each ingredient must be a non-empty string (max 100 chars).' });
    return;
  }

  if (body.servings !== undefined) {
    const s = Number(body.servings);
    if (isNaN(s) || s < 1 || s > 20) {
      res.status(400).json({ success: false, error: 'servings must be between 1 and 20.' });
      return;
    }
  }

  if (body.cuisineType !== undefined && typeof body.cuisineType !== 'string') {
    res.status(400).json({ success: false, error: 'cuisineType must be a string.' });
    return;
  }

  if (body.difficulty !== undefined) {
    const allowed = ['', 'Easy', 'Medium', 'Hard'];
    if (!allowed.includes(body.difficulty)) {
      res.status(400).json({ success: false, error: 'difficulty must be Easy, Medium, or Hard.' });
      return;
    }
  }

  if (body.dietaryRestrictions !== undefined) {
    if (!Array.isArray(body.dietaryRestrictions)) {
      res.status(400).json({ success: false, error: 'dietaryRestrictions must be an array.' });
      return;
    }
  }

  next();
}
