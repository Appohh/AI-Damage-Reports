from fastapi import APIRouter
from pydantic import BaseModel
from langchain.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

router = APIRouter()

class Description(BaseModel):
    user_description: str

# Initialize the local LLM
llm = Ollama(model="llama3")  # Change to the model you installed with ollama pull

# Define prompt template
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

@router.post("/accidentDescription")
async def handle_input(data: Description):
    print(f"Received data: {data.user_description}")  # Add this line for debugging
    user_description = data.user_description

    # Call the LLM
    print("Calling the model...")
    response = llm_chain.run(user_description)
    print("Model response:", response)

    # Try to parse the JSON strictly
    import json
    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        result = {"error": "Failed to parse JSON from model output.", "raw_output": response}

    return {"reply": result}