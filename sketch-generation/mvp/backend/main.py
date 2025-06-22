from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routes import accidentDescription


app = FastAPI()

app.include_router(accidentDescription.router)

# Allow frontend to talk to backend (important!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. For production, restrict.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    user_input: str

@app.post("/api")
async def handle_input(data: UserInput):
    user_input = data.user_input
    # Do something with input, e.g., echo it back or process it
    response = f"Received: {user_input}"
    return {"reply": response}
