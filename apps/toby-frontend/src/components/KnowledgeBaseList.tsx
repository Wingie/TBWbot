import React from 'react';
import { Database } from 'lucide-react';
import { KnowledgeBase } from '../services/knowledgeBase';

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  activeKnowledgeBase: string | null;
  onSelect: (id: string | null) => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  knowledgeBases,
  activeKnowledgeBase,
  onSelect,
}) => {
  if (knowledgeBases.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Knowledge Bases</h3>
      <div className="space-y-1">
        {knowledgeBases.map((kb) => (
          <button
            key={kb.id}
            onClick={() => onSelect(kb.id === activeKnowledgeBase ? null : kb.id)}
            className={`w-full px-3 py-2 text-left rounded-lg flex items-center space-x-2 ${
              kb.id === activeKnowledgeBase
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="text-sm truncate">{kb.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBaseList;