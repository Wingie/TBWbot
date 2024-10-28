import React, { useRef } from 'react';
import { Upload, Plus } from 'lucide-react';

interface KnowledgeBaseInputProps {
  onFileUpload: (file: File) => Promise<void>;
  onCreateKnowledgeBase: (terms: string) => Promise<void>;
  isLoading: boolean;
}

const KnowledgeBaseInput: React.FC<KnowledgeBaseInputProps> = ({
  onFileUpload,
  onCreateKnowledgeBase,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [terms, setTerms] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleTermsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terms.trim()) {
      onCreateKnowledgeBase(terms.trim());
      setTerms('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
      </div>
      <form onSubmit={handleTermsSubmit} className="flex space-x-2">
        <input
          type="text"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="Enter comma-separated terms..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !terms.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create KB</span>
        </button>
      </form>
    </div>
  );
};

export default KnowledgeBaseInput;