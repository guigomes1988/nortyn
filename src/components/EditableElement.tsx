import React, { useRef, useEffect } from 'react';
import { useAdmin } from './AdminContext';

interface EditableElementProps {
  contentKey: string;
  defaultContent: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableElement({ 
  contentKey, 
  defaultContent, 
  as = 'div', 
  className = '', 
  style = {} 
}: EditableElementProps) {
  const { isVisualEditing, siteContent, updateContent } = useAdmin();
  const elementRef = useRef<HTMLElement>(null);
  const TagComponent = as as any;

  const currentContent = siteContent[contentKey] ?? defaultContent;

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerHTML !== currentContent) {
      elementRef.current.innerHTML = currentContent;
    }
  }, [currentContent]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newHtml = elementRef.current.innerHTML;
      if (newHtml !== currentContent) {
        updateContent(contentKey, newHtml);
      }
    }
  };

  const adminClasses = isVisualEditing 
    ? 'cursor-text ring-1 ring-nortyn-secondary/30 ring-inset hover:ring-nortyn-secondary/60 focus:ring-nortyn-secondary focus:outline-none focus:bg-white/5 transition-all p-1 -m-1 rounded-lg' 
    : '';

  return (
    <TagComponent
      ref={elementRef as any}
      contentEditable={isVisualEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} ${adminClasses}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: currentContent }}
    />
  );
}
