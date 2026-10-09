import hashlib
import json
import re
import logging
from typing import Any, Dict, Optional
from app.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

# Prompt cache in memory
_prompt_cache: Dict[str, str] = {}

def get_prompt_hash(prompt: str) -> str:
    return hashlib.md5(prompt.strip().encode("utf-8")).hexdigest()

def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Strips markdown code fences and parses JSON safely, with regex fallback."""
    if not raw_text:
        return {}
    
    cleaned = raw_text.strip()
    # Strip markdown code block wrappers ```json ... ``` or ``` ... ```
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception as e:
        logger.warning(f"Direct JSON parse failed: {e}. Attempting regex extraction.")
        # Try regex pattern to match standard JSON object {...} or array [...]
        json_match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except Exception as e2:
                logger.error(f"Regex JSON extraction failed: {e2}")
    return {"raw": raw_text}

def call_gemini(prompt: str, system_instruction: Optional[str] = None) -> str:
    """Call Gemini Flash with caching and error fallback."""
    cache_key = get_prompt_hash(prompt + (system_instruction or ""))
    if cache_key in _prompt_cache:
        return _prompt_cache[cache_key]

    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return ""

    try:
        # Use standard google-genai or requests to Gemini API
        import google.genai as genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        full_prompt = prompt
        if system_instruction:
            full_prompt = f"System: {system_instruction}\n\nUser: {prompt}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
        )
        res_text = response.text or ""
        _prompt_cache[cache_key] = res_text
        return res_text
    except Exception as err:
        logger.error(f"Gemini API error: {err}")
        return ""

def call_gemini_json(prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
    """Always requests JSON structure, calls Gemini and cleans result."""
    json_prompt = f"{prompt}\n\nIMPORTANT: Return ONLY a valid JSON object. No prose or explanations outside the JSON."
    raw = call_gemini(json_prompt, system_instruction)
    if not raw:
        return {}
    return clean_json_response(raw)
