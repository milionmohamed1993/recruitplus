import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callOpenAIWithRetry(resumeText: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${retries} to call OpenAI API`);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a skilled HR analyst. Analyze the resume text and:
              1. Extract technical skills and categorize them
              2. Generate relevant interview questions based on the skills
              3. Create a skill assessment matrix
              
              Return the data in this exact JSON format:
              {
                "skillCategories": {
                  "technical": [{"name": "skill name", "level": 1-5}],
                  "softSkills": [{"name": "skill name", "level": 1-5}],
                  "languages": [{"name": "language", "level": 1-5}]
                },
                "questions": [
                  {
                    "category": "category name",
                    "question": "question text",
                    "skillReference": "related skill"
                  }
                ]
              }`
            },
            {
              role: "user",
              content: resumeText
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });

        if (response.status === 429) {
          const backoffMs = Math.pow(2, i) * 1000; // Exponential backoff
          console.log(`Rate limited. Waiting ${backoffMs}ms before retry...`);
          await sleep(backoffMs);
          continue;
        }

        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      
      const backoffMs = Math.pow(2, i) * 1000;
      console.log(`Waiting ${backoffMs}ms before retry...`);
      await sleep(backoffMs);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    
    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Starting resume analysis...');
    const result = await callOpenAIWithRetry(resumeText);
    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in analyze-skills function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});