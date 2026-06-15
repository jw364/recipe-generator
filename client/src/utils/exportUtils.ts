import jsPDF from 'jspdf';
import type { Recipe } from '../types/recipe';

function formatRecipeAsText(recipe: Recipe): string {
  const lines: string[] = [];

  lines.push(recipe.title.toUpperCase());
  lines.push('='.repeat(recipe.title.length));
  lines.push('');
  lines.push(recipe.description);
  lines.push('');
  lines.push('DETAILS');
  lines.push('-------');
  lines.push(`Prep Time:    ${recipe.prepTime}`);
  lines.push(`Cook Time:    ${recipe.cookTime}`);
  lines.push(`Total Time:   ${recipe.totalTime}`);
  lines.push(`Servings:     ${recipe.servings}`);
  lines.push(`Difficulty:   ${recipe.difficulty}`);
  lines.push(`Cuisine:      ${recipe.cuisineType}`);
  lines.push('');
  lines.push('INGREDIENTS');
  lines.push('-----------');
  recipe.ingredients.forEach((ing) => {
    const parts = [ing.amount, ing.unit, ing.name].filter(Boolean).join(' ');
    lines.push(`• ${parts}${ing.notes ? ` (${ing.notes})` : ''}`);
  });
  lines.push('');
  lines.push('INSTRUCTIONS');
  lines.push('------------');
  recipe.instructions.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
    lines.push('');
  });
  lines.push('NUTRITION ESTIMATE (per serving)');
  lines.push('--------------------------------');
  lines.push(`Calories:      ${recipe.nutritionEstimate.calories}`);
  lines.push(`Protein:       ${recipe.nutritionEstimate.protein}`);
  lines.push(`Carbohydrates: ${recipe.nutritionEstimate.carbohydrates}`);
  lines.push(`Fat:           ${recipe.nutritionEstimate.fat}`);
  lines.push(`Fiber:         ${recipe.nutritionEstimate.fiber}`);
  lines.push('');
  if (recipe.cookingTips.length > 0) {
    lines.push('COOKING TIPS');
    lines.push('------------');
    recipe.cookingTips.forEach((tip) => {
      lines.push(`• ${tip}`);
    });
    lines.push('');
  }
  lines.push(`Generated on ${new Date(recipe.generatedAt).toLocaleDateString()}`);

  return lines.join('\n');
}

export function exportToPDF(recipe: Recipe): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color = '#1f2937') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    const [r, g, b] = hexToRgb(color);
    doc.setTextColor(r, g, b);
    const lines = doc.splitTextToSize(text, contentWidth) as string[];
    checkPageBreak(lines.length * (fontSize * 0.4) + 4);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  const addSection = (title: string) => {
    y += 4;
    checkPageBreak(12);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // Header
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(recipe.title, margin, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(recipe.description, contentWidth) as string[];
  doc.text(descLines, margin, 26);
  y = 50;

  // Meta row
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Prep: ${recipe.prepTime}  |  Cook: ${recipe.cookTime}  |  Total: ${recipe.totalTime}  |  Serves: ${recipe.servings}  |  Difficulty: ${recipe.difficulty}  |  Cuisine: ${recipe.cuisineType}`, margin, y);
  y += 8;

  // Ingredients
  addSection('INGREDIENTS');
  recipe.ingredients.forEach((ing) => {
    const parts = [ing.amount, ing.unit, ing.name].filter(Boolean).join(' ');
    addText(`• ${parts}${ing.notes ? ` (${ing.notes})` : ''}`, 10);
  });

  // Instructions
  addSection('INSTRUCTIONS');
  recipe.instructions.forEach((step, i) => {
    addText(`${i + 1}.  ${step}`, 10);
    y += 2;
  });

  // Nutrition
  addSection('NUTRITION ESTIMATE (per serving)');
  const nutritionPairs = [
    ['Calories', recipe.nutritionEstimate.calories],
    ['Protein', recipe.nutritionEstimate.protein],
    ['Carbohydrates', recipe.nutritionEstimate.carbohydrates],
    ['Fat', recipe.nutritionEstimate.fat],
    ['Fiber', recipe.nutritionEstimate.fiber],
  ];
  nutritionPairs.forEach(([key, value]) => {
    addText(`${key}: ${value}`, 10);
  });

  // Tips
  if (recipe.cookingTips.length > 0) {
    addSection('COOKING TIPS');
    recipe.cookingTips.forEach((tip) => {
      addText(`• ${tip}`, 10);
    });
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Recipe Generator  •  Page ${p} of ${totalPages}`, margin, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`${recipe.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export function printRecipe(): void {
  window.print();
}

export async function copyToClipboard(recipe: Recipe): Promise<void> {
  const text = formatRecipeAsText(recipe);
  await navigator.clipboard.writeText(text);
}

export function downloadAsText(recipe: Recipe): void {
  const text = formatRecipeAsText(recipe);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${recipe.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}
