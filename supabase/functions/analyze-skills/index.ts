import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if ((error.status === 429 || error.status >= 500) && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting skill analysis...');
    const { text } = await req.json();

    if (!text) {
      console.error('No text provided for analysis');
      throw new Error('No text provided for analysis');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const result = await retryWithBackoff(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert at analyzing resumes and extracting skills. 
              Analyze the text and provide:
              1. A detailed analysis of technical skills
              2. A set of technical interview questions based on the skills
              
              Return the response in this exact JSON format:
              {
                "skillAnalysis": {
                  "technicalSkills": ["skill1", "skill2"],
                  "softSkills": ["skill1", "skill2"],
                  "analysis": "Detailed analysis of skills..."
                },
                "interviewQuestions": [
                  {
                    "skill": "skill name",
                    "question": "Technical question",
                    "expectedAnswer": "What you would expect from a good candidate"
                  }
                ]
              }`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    });

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-skills function:', error);
    return new Response(
      JSON.stringify({
        error: `Error analyzing skills: ${error.message}`,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});