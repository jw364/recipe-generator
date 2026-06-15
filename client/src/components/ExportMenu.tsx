import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Printer, Clipboard, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Recipe } from '../types/recipe';
import { exportToPDF, printRecipe, copyToClipboard, downloadAsText } from '../utils/exportUtils';

interface ExportMenuProps {
  recipe: Recipe;
}

export default function ExportMenu({ recipe }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePDF = () => {
    try { exportToPDF(recipe); toast.success('PDF downloaded!'); }
    catch { toast.error('Failed to generate PDF.'); }
    setOpen(false);
  };

  const handlePrint = () => { printRecipe(); setOpen(false); };

  const handleCopy = async () => {
    try {
      await copyToClipboard(recipe);
      setCopied(true);
      toast.success('Recipe copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('Failed to copy.'); }
    setOpen(false);
  };

  const handleText = () => {
    try { downloadAsText(recipe); toast.success('Text file downloaded!'); }
    catch { toast.error('Failed to download.'); }
    setOpen(false);
  };

  const actions = [
    { label: 'Export as PDF',       icon: FileText,              color: 'text-red-400',    onClick: handlePDF },
    { label: 'Print Recipe',         icon: Printer,               color: 'text-blue-400',   onClick: handlePrint },
    { label: copied ? 'Copied!' : 'Copy to Clipboard', icon: copied ? Check : Clipboard, color: 'text-brand', onClick: handleCopy },
    { label: 'Download as Text',    icon: Download,              color: 'text-warm-500',   onClick: handleText },
  ];

  return (
    <div ref={menuRef} className="relative no-print">
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-secondary text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-brand-950 border border-warm-200 dark:border-brand-800 rounded-xl shadow-warm-md z-50 animate-slide-down overflow-hidden"
        >
          {actions.map(({ label, icon: Icon, color, onClick }) => (
            <button
              key={label}
              role="menuitem"
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-warm-300 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors text-left"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
