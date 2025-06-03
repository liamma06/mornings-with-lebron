const axios = require('axios');
require('dotenv').config();

async function LebronResponse(reflection) {
    try{
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 500,
            messages:[
                {
                    role: 'user',
                    content: `Based on this reflection: "${reflection}", write a motivational response as if you were LeBron James(be dramatic, add some mentions about basketball, play into some of the memes about lebron) responding to someone who wrote this. Be empathic, supportive, inspiring, and use LeBron's typical motivational speaking style.  Add an additional sentence at the end with a actionable step or reflective thought. Keep it to 2-3 sentences for maximum impact.`
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    }catch (error) {
        console.error('Error calling Anthropic API:', error.message);
        throw new Error('Failed to get response from Anthropic API');
    }
}

async function emotionRate(reflection){
     try{
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 500,
            messages:[
                {
                    role: 'user',
                    content: `
                        You are an emotion analysis assistant. Analyze the user's reflection and assign a score from 0 (not present) to 1 (very strongly present) for each of the following emotions:

                        ["happy", "sad", "anxious", "hopeful", "tired", "angry", "calm"]

                        Return a JSON object with the emotion as the key and the score as the value.

                        Reflection:
                        "${reflection}"

                        Example Output:
                        {
                        "happy": 0.2,
                        "sad": 0.5,
                        "anxious": 0.8,
                        "hopeful": 0.6,
                        "tired": 0.4,
                        "angry": 0.1,
                        "calm": 0.7
                        }
                    `
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    }catch (error) {
        console.error('Error calling Anthropic API:', error.message);
        throw new Error('Failed to get response from Anthropic API');
    }
}

module.exports = {LebronResponse, emotionRate};