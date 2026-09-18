from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.history import router as history_router

app = FastAPI(title="Browser History DS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history_router)


@app.get("/")
def root():
    return {"message": "Browser History DS API is running"}