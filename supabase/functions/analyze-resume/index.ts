import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const { text } = await req.json();
    console.log('Analyzing resume text length:', text.length);

    const systemPrompt = `You are an expert at analyzing resumes. Extract the following information from this resume and format it as JSON:
    - Personal Information:
      - Full Name
      - Email
      - Phone Number
      - Birth Date (if available)
      - Address (if available)
      - Nationality (if available)
      - Location/City
    
    - Professional Information:
      - Current/Last Position
      - Company
      - Department
      - Industry
      - Years of Experience
    
    - Education:
      - Highest Degree
      - University/Institution`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Unexpected response format from OpenAI');
    }

    // Parse the response to ensure it's valid JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed resume data');
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // If parsing fails, try to clean up the response
      const cleanedContent = data.choices[0].message.content
        .replace(/```json\n?/, '') // Remove JSON code block markers
        .replace(/```\n?/, '')     // Remove closing code block marker
        .trim();                   // Remove any extra whitespace
      
      try {
        parsedContent = JSON.parse(cleanedContent);
        console.log('Successfully parsed cleaned resume data');
      } catch (secondParseError) {
        console.error('Failed to parse cleaned response:', secondParseError);
        throw new Error('Failed to parse the resume data structure');
      }
    }

    return new Response(JSON.stringify({
      result: parsedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});