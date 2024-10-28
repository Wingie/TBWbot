import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  url: string;
  file?: File | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url, file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (!url && !file) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
        <FileText className="w-16 h-16 mb-4" />
        <p>Upload a file or enter a URL to view the document</p>
      </div>
    );
  }

  const isImage = (file?.type.startsWith('image/') || url.match(/\.(jpeg|jpg|gif|png)$/));
  const isPDF = (file?.type === 'application/pdf' || url.match(/\.pdf$/));

  if (isImage) {
    const imageUrl = file ? URL.createObjectURL(file) : url;
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <img 
          src={imageUrl} 
          alt="Document preview" 
          className="max-w-full max-h-full object-contain" 
          onLoad={() => file && URL.revokeObjectURL(imageUrl)}
        />
      </div>
    );
  }

  if (isPDF) {
    const pdfUrl = file ? URL.createObjectURL(file) : url;
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
            <span className="text-sm">
              Page {pageNumber} of {numPages || '-'}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex justify-center p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
          >
            <Page 
              pageNumber={pageNumber} 
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>
    );
  }

  // For other file types, show a basic preview or message
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
      <FileText className="w-16 h-16 mb-4" />
      <p className="text-center">
        {file ? `Preview not available for ${file.name}` : 'Preview not available for this file type'}
      </p>
    </div>
  );
};

export default DocumentViewer;