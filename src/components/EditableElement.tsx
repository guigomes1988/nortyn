import React, { useRef, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, language } = useLanguage();
  const elementRef = useRef<HTMLElement>(null);
  const TagComponent = as as any;

  // Quando o idioma for português (ou o modo de edição visual do admin estiver ativo),
  // respeitamos o conteúdo customizado salvo pelo painel administrativo (siteContent).
  // Quando o idioma selecionado for outro (en/es), exibimos a tradução ativa correspondente.
  const translatedContent = t(contentKey, defaultContent);
  const currentContent = (language === 'pt' || isVisualEditing)
    ? (siteContent[contentKey] ?? translatedContent)
    : translatedContent;

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
      key={`${contentKey}-${language}`}
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
