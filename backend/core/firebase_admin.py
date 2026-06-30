# core/firebase_admin.py
import os
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

load_dotenv()

def init_firebase() -> None:
    """
    Initialize Firebase Admin SDK using Application Default Credentials.
    - Local dev:  gcloud auth application-default login
    - Cloud Run:  ADC is resolved automatically from the attached service account
    No key file needed.
    """
    if not firebase_admin._apps:
        firebase_admin.initialize_app(options={
            "projectId": os.getenv("FIREBASE_PROJECT_ID")
        })