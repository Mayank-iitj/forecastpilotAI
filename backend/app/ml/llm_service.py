"""ForecastPilot AI — Groq LLM Service"""
from groq import Groq
import json
from app.core.config import settings

# Initialize Groq client
client = Groq(api_key=settings.GROQ_API_KEY)

def parse_what_if_scenario(question: str) -> dict:
    """Uses Groq to parse a natural language question into budget adjustments."""
    prompt = f"""
You are an AI data assistant. The user will ask a "what-if" scenario about their marketing budget.
Extract any mentioned budget adjustments as a JSON object. 
Available channels: google_ads, meta_ads, microsoft_ads, affiliate, email, display, organic_search.
If the user mentions increasing or decreasing spend/ROAS/conversion rate, map it to a percentage change (-100 to 100).
For example, "What if we increase google ads spend by 20%?" -> {{"google_ads": 20}}
"What if meta roas drops 10% and email increases 15%" -> {{"meta_ads": -10, "email": 15}}

User Question: "{question}"

Output strictly valid JSON with no markdown formatting.
"""
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.AI_MODEL,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        result = json.loads(content)
        cleaned = {}
        for k, v in result.items():
            try:
                if isinstance(v, str):
                    v = v.replace('%', '').strip()
                cleaned[k] = float(v)
            except (ValueError, TypeError):
                continue
        return cleaned
    except Exception as e:
        print(f"Error parsing scenario: {e}")
        return {}

def generate_forecast_explanation(question: str, base_revenue: float, adjusted_revenue: float) -> str:
    """Generates a conversational explanation of the forecast impact using Groq."""
    impact = adjusted_revenue - base_revenue
    direction = "increase" if impact > 0 else "decrease"
    
    prompt = f"""
You are ForecastPilot AI, an expert AI CFO. 
The user asked: "{question}"
Base Revenue: ${base_revenue:,.2f}
Adjusted Revenue: ${adjusted_revenue:,.2f}
Impact: ${abs(impact):,.2f} {direction}

Write a concise, professional 1-2 sentence explanation of the projected impact. 
Do not hallucinate specific data other than what is provided. Be direct and insightful.
"""
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.AI_MODEL,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating explanation: {e}")
        return f"Based on the scenario '{question}', the model projects a revenue change of ${impact:,.0f}."

def generate_cfo_chat_response(messages: list) -> str:
    """Generates a multi-turn chat response from the AI Marketing CFO using Groq."""
    
    system_prompt = {
        "role": "system",
        "content": "You are ForecastPilot AI, an expert AI Marketing CFO. "
                   "Provide data-driven, strategic, and concise insights to the user. "
                   "Format your responses using clean Markdown. Keep responses professional and insightful."
    }
    
    # Ensure messages is a list of dicts with 'role' and 'content'
    formatted_messages = [system_prompt]
    for msg in messages:
        formatted_messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        
    try:
        response = client.chat.completions.create(
            messages=formatted_messages,
            model=settings.AI_MODEL,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating chat response: {e}")
        return "I'm currently experiencing a connection issue. Please try again in a moment."

def generate_report_content(report_type: str) -> str:
    """Generates a realistic mock report using Groq."""
    prompt = f"""
You are ForecastPilot AI, an expert AI CFO.
Generate a concise {report_type} for our marketing performance.
Include a brief executive summary and 3 bullet points with key insights.
Keep it strictly under 150 words.
"""
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.AI_MODEL,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating report: {e}")
        return "Error generating report summary."
