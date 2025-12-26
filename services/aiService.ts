import axios from 'axios';

interface TaskExtraction {
  task: string;
  time: string;
  date?: string;
}

/**
 * Sends text to DeepSeek-V3 model to extract task information
 * @param text The text to analyze
 * @returns Structured task data or null if extraction failed
 */
export const extractTaskInfo = async (text: string): Promise<TaskExtraction | null> => {
  try {
    // Replace with your actual DeepSeek API endpoint and key
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const API_KEY = process.env.DEEPSEEK_API_KEY || '';
    
    if (!API_KEY) {
      console.error('DeepSeek API key not found');
      return null;
    }

    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-v3',
        messages: [
          {
            role: 'system',
            content: `Extract the task name and time from the following text. 
            Return a JSON object with "task" and "time" fields. 
            If a date is mentioned, include a "date" field.
            Format time as HH:MM in 24-hour format.
            Example: { "task": "Meeting with client", "time": "14:00" }`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    // Parse the response to get the extracted JSON
    const content = response.data.choices[0]?.message?.content;
    if (!content) return null;

    // Extract JSON from the response (handling potential text wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    return JSON.parse(jsonMatch[0]) as TaskExtraction;
  } catch (error) {
    console.error('Error extracting task info:', error);
    return null;
  }
};
