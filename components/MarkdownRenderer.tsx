import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// Parses inline markdown like **bold** and *italics*.
const parseInlineFormatting = (text: string): React.ReactNode => {
    // Split by markers, keeping them in the array. This handles multiple formats in one line.
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
    return parts.filter(part => part).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // Split content into blocks based on blank lines (paragraphs or lists).
    const blocks = content.split(/\n\s*\n/);
  
    const renderBlock = (block: string, blockIndex: number) => {
      if (!block.trim()) return null;
      
      const lines = block.split('\n');
      const isList = lines.every(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
  
      if (isList) {
        return (
          <ul key={`ul-${blockIndex}`} className="list-disc list-inside space-y-1">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{parseInlineFormatting(line.trim().substring(2))}</li>
            ))}
          </ul>
        );
      }
  
      // If it's not a list, treat it as a paragraph.
      return (
        <p key={`p-${blockIndex}`}>
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {parseInlineFormatting(line)}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    };
  
    return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
};

export default MarkdownRenderer;
