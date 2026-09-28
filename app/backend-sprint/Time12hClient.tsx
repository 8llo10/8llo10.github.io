'use client';

import { useEffect } from 'react';

function to12HourText(value: string) {
  return value.replace(/\b([01]\d|2[0-3]):([0-5]\d)\b(?!\s*(?:AM|PM))/g, (_, hourText: string, minute: string) => {
    const hour = Number(hourText);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  });
}

export default function Time12hClient() {
  useEffect(() => {
    const normalize = () => {
      const root = document.querySelector('.be-site');
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        if (parent && !['SCRIPT', 'STYLE'].includes(parent.tagName)) {
          const current = node.nodeValue || '';
          const next = to12HourText(current);
          if (next !== current) node.nodeValue = next;
        }
        node = walker.nextNode();
      }
    };

    normalize();
    const observer = new MutationObserver(normalize);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
