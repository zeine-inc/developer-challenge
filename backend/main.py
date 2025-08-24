from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine
import cloudinary
from os import getenv
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloudinary_url=getenv("CLOUDINARY_URL"),
    secure=True
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from routes import vendedor
from routes import contato

app.include_router(vendedor.router)
app.include_router(contato.router)
