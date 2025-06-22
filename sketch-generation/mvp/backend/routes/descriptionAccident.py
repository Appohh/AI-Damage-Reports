from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
from langchain.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain


router = APIRouter()



# Circumstances dictionary
circumstances = {
    1: "parked (at the roadside)",
    2: "leaving a parking place (at the roadside)",
    3: "entering a parking place (at the roadside)",
    4: "emerging from a car park, from private grounds, from a track",
    5: "entering a car park, private grounds or track",
    6: "entering a roundabout (or similar traffic system)",
    7: "circulating in a roundabout etc.",
    8: "striking the rear of the other vehicle while going in the same direction and in the same lane",
    9: "going in the same direction but in a different lane",
    10: "changing lanes",
    11: "overtaking",
    12: "turning to the right",
    13: "turning to the left",
    14: "reversing",
    15: "encroaching in the opposite traffic lane",
    16: "coming from the right (at road junctions)",
    17: "not observing a right of way sign",
}

# Circumstance prompt template
circumstance_prompt_template = """
You are analyzing accident descriptions to identify applicable legal circumstances.

This is the user description:
"{description}"

From the following list of numbered traffic circumstances, determine which ones are mentioned, implied, or likely involved. Only include relevant numbers and reasons why they were selected.

List of possible circumstances:
{circumstance_list}

Respond only with valid JSON in the following format:
{{ "circumstances": [{{"number": 10, "description": "changing lanes"}}] }}
Do not explain anything. Return only the JSON object.
"""

def ai_analyze_circumstances(description):
    formatted_list = "\n".join([f"{k}. {v}" for k, v in circumstances.items()])
    prompt = circumstance_prompt_template.format(description=description, circumstance_list=formatted_list)

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            headers={"Content-Type": "application/json"},
            json={ "model": "llama3", "prompt": prompt, "stream": False },
            timeout=125
        )
        response.raise_for_status()
        response_json = response.json()
        return json.loads(response_json["response"])
    except Exception as e:
        return {"circumstances": [], "error": str(e)}

# LangChain LLM setup
llm = Ollama(model="llama3")
prompt_template = """
You are an expert accident description parser. Given the user's description below, strictly parse it into JSON with the following structure:
{{
  "cars": [
    {{ "id": "A", "status": "parked", "vehicle": "Car", "notes": "User's car" }},
    {{ "id": "B", "status": "reversing", "vehicle": "Truck", "notes": "None" }}
  ],
  "collisions": [
    ["B", "A"]
  ]
}}

Statuses must only be: "parked", "reversing", "driving", "standing", "unknown".
Vehicles must only be: "Car" or "Truck".
Collisions should be empty if no collisions.
There can be multiple vehicles and collisions.

User's description:
\"\"\"{user_description}\"\"\"

Return ONLY valid JSON — do not include explanations or additional text.
"""
prompt = PromptTemplate(input_variables=["user_description"], template=prompt_template)
llm_chain = LLMChain(llm=llm, prompt=prompt)

# Input schema
class AccidentReport(BaseModel):
    injury_description: Optional[str] = ""
    accident_description: str
    property_damage: str
    phone_number: str
    vehicle_type: str
    damage_points: List[str]
    vat_a: str
    insurer_a: Optional[str] = ""
    policy_num: Optional[str] = ""
    agent_a: Optional[str] = ""
    green_number: Optional[str] = ""
    green_card_until: Optional[str] = ""
    damage_insured_a: str
    initial_impact_a: Optional[str] = ""
    visible_damage_a: Optional[str] = ""
    remarks_a: Optional[str] = ""

@router.post("/accidentDescription")
async def accident_description(report: AccidentReport):
    # Extract and debug input
    user_desc = report.accident_description
    print(f"📝 Description: {user_desc}")

    # 1. Call LangChain LLM for parsing vehicles & collisions
    try:
        parsed_json = json.loads(llm_chain.run(user_desc))
    except Exception as e:
        parsed_json = {"error": "Failed to parse vehicle collision JSON", "details": str(e)}

    # 2. Call circumstances analysis
    circumstances_json = ai_analyze_circumstances(user_desc)

    # 3. Convert original form into a dictionary
    report_dict = report.dict()

    # 4. Return full structured response
    return {
        "reply": {
            "message": "Accident report processed.",
            "vehicle_info": parsed_json,
            "circumstances": circumstances_json,
            "summary": {
                "vehicle": report.vehicle_type,
                "damage_points": report.damage_points,
                "description": report.accident_description,
                "property_damage": report.property_damage,
                "phone_number": report.phone_number
            },
            "full_form_data": report_dict  
        }
    }


