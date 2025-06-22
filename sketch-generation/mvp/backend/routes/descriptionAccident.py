from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/accidentDescription")
async def accident_description(report: AccidentReport):
    # Here you can process, store, or forward the report as needed.
    # For demo, just echo back a dummy reply.
    return {
        "reply": {
            "message": "Accident report received.",
            "summary": {
                "vehicle": report.vehicle_type,
                "damage_points": report.damage_points,
                "description": report.accident_description,
                "property_damage": report.property_damage,
                "phone_number": report.phone_number
            }
        }
    }