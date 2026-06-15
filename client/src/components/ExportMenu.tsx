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
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePDF = () => {
    try {
      exportToPDF(recipe);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF.');
    }
    setOpen(false);
  };

  const handlePrint = () => {
    printRecipe();
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(recipe);
      setCopied(true);
      toast.success('Recipe copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
    setOpen(false);
  };

  const handleDownloadText = () => {
    try {
      downloadAsText(recipe);
      toast.success('Text file downloaded!');
    } catch {
      toast.error('Failed to download text file.');
    }
    setOpen(false);
  };

  const actions = [
    { label: 'Export as PDF', icon: FileText, onClick: handlePDF, color: 'text-red-500' },
    { label: 'Print Recipe', icon: Printer, onClick: handlePrint, color: 'text-blue-500' },
    { label: copied ? 'Copied!' : 'Copy to Clipboard', icon: copied ? Check : Clipboard, onClick: handleCopy, color: 'text-purple-500' },
    { label: 'Download as Text', icon: Download, onClick: handleDownloadText, color: 'text-emerald-500' },
  ];

  return (
    <div ref={menuRef} className="relative no-print">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-colors shadow-sm"
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
          className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 z-50 animate-slide-down overflow-hidden"
        >
          {actions.map(({ label, icon: Icon, onClick, color }) => (
            <button
              key={label}
              role="menuitem"
              onClick={onClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
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
