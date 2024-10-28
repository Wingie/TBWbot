import React, { useState, useEffect } from 'react';
import { Mistral } from "@mistralai/mistralai";
import DocumentViewer from './components/DocumentViewer';
import ChatInterface from './components/ChatInterface';
import KnowledgeBaseInput from './components/KnowledgeBaseInput';
import KnowledgeBaseList from './components/KnowledgeBaseList';
import { 
  KnowledgeBase, 
  createKnowledgeBaseFromFile, 
  createKnowledgeBaseFromTerms,
  queryKnowledgeBase 
} from './services/knowledgeBase';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [activeKnowledgeBase, setActiveKnowledgeBase] = useState<string | null>(null);
  const [isCreatingKnowledgeBase, setIsCreatingKnowledgeBase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
  const AGENT_ID = 'ag:241bf8b8:20241022:untitled-agent:b9feae54';

  useEffect(() => {
    if (!MISTRAL_API_KEY) {
      setError('Mistral API key is not configured. Please add VITE_MISTRAL_API_KEY to your environment variables.');
    }
  }, [MISTRAL_API_KEY]);

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setIsCreatingKnowledgeBase(true);
      setCurrentFile(file);
      const newKnowledgeBase = await createKnowledgeBaseFromFile(file);
      setKnowledgeBases(prev => [...prev, newKnowledgeBase]);
      setActiveKnowledgeBase(newKnowledgeBase.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating knowledge base from file');
    } finally {
      setIsCreatingKnowledgeBase(false);
    }
  };

  const handleCreateKnowledgeBase = async (terms: string) => {
    try {
      setError(null);
      setIsCreatingKnowledgeBase(true);
      const newKnowledgeBase = await createKnowledgeBaseFromTerms(terms);
      setKnowledgeBases(prev => [...prev, newKnowledgeBase]);
      setActiveKnowledgeBase(newKnowledgeBase.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating knowledge base from terms');
    } finally {
      setIsCreatingKnowledgeBase(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!MISTRAL_API_KEY) {
      setError('Mistral API key is not configured');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content }]);

      const client = new Mistral({
        apiKey: MISTRAL_API_KEY
      });
      let context = '';

      if (activeKnowledgeBase) {
        const kb = knowledgeBases.find(kb => kb.id === activeKnowledgeBase);
        if (kb) {
          context = `Context: ${kb.content}\n\n`;
        }
      }

      // const response = await client.chat.complete({
      //   model: "mistral-large-latest", 
      //   messages: [
      //     // ...messages,  // Remove this line to avoid sending the entire chat history repeatedly
      //     { role: 'user', content: context + content }
      //   ],
      // });

      const response = await client.agents.stream({
        messages: [
          { role: 'user', content: context + content },
        ],
        agentId: "ag:241bf8b8:20241022:untitled-agent:b9feae54",
      });
    
      let assistantContent = ''; // Keep this to track the overall content

      // 1. Create a separate component for the assistant's message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
  
      for await (const event of response) {
        if (event.data.choices && event.data.choices[0]) {
          assistantContent += event.data.choices[0].delta.content; // Update the overall content
  
          // 2. Update the *last* message in the array
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].content = assistantContent;
            return updatedMessages;
          });
  
          // 3. Optional: Introduce a small delay for a more natural feel
          await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
        } 
      }

      
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error processing your request');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-4 flex flex-col">
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setCurrentFile(null);
                }}
                placeholder="Enter document URL..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <KnowledgeBaseInput
              onFileUpload={handleFileUpload}
              onCreateKnowledgeBase={handleCreateKnowledgeBase}
              isLoading={isCreatingKnowledgeBase}
            />
            <KnowledgeBaseList
              knowledgeBases={knowledgeBases}
              activeKnowledgeBase={activeKnowledgeBase}
              onSelect={setActiveKnowledgeBase}
            />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <DocumentViewer url={url} file={currentFile} />
        </div>
      </div>

      <div className="w-1/2 p-4">
        <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
          <ChatInterface
            onSendMessage={handleSendMessage}
            messages={messages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;