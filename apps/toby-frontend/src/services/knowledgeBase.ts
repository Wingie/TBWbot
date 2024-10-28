import MistralClient from '@mistralai/mistralai';

export interface KnowledgeBase {
  id: string;
  name: string;
  type: 'file' | 'terms';
  content: string;
}

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const AGENT_ID = 'ag:241bf8b8:20241022:untitled-agent:b9feae54';

export const createKnowledgeBaseFromFile = async (file: File): Promise<KnowledgeBase> => {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key is not configured');
  }

  const content = await file.text();
  
  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: 'file',
    content
  };
};

export const createKnowledgeBaseFromTerms = async (terms: string): Promise<KnowledgeBase> => {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key is not configured');
  }

  return {
    id: crypto.randomUUID(),
    name: `Terms KB: ${terms.split(',')[0]}...`,
    type: 'terms',
    content: terms
  };
};

export const queryKnowledgeBase = async (kbId: string, query: string): Promise<string> => {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key is not configured');
  }

  const client = new MistralClient(MISTRAL_API_KEY);
  
  try {
    const response = await client.chat({
      model: AGENT_ID,
      messages: [
        { role: 'user', content: query }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    throw new Error('Failed to query knowledge base');
  }
};