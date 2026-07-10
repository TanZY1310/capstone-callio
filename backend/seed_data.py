import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.customer import Customers
from models.speech import SpeechAnalysis, Objection

CUSTOMER_SETS = [
    # Set 0 — Demo Agent (Amir Hassan)
    [
        {"cust_name": "Tan Ze Yan",              "phone": "60199460642", "budget": "",  "location": "",     "status": "Not Yet Call"},
        {"cust_name": "Nurul Huda Binti Abdullah", "phone": "60125556701", "budget": "$300K-$500K",  "location": "Bukit Bintang",  "status": "WhatsApp"},
        {"cust_name": "Lee Chong Wei",             "phone": "60125556702", "budget": "$800K-$1M",    "location": "Damansara",      "status": "Appointment"},
        {"cust_name": "Priya Devi",                "phone": "60125556703", "budget": "$200K-$300K",  "location": "Cheras",         "status": "Not Yet Call"},
        {"cust_name": "Wong Kok Wai",              "phone": "60125556704", "budget": "$1M-$2M",      "location": "Bangsar",        "status": "Completed"},
        {"cust_name": "Ahmad Faizal",              "phone": "60125556705", "budget": "$400K-$600K",  "location": "Setapak",        "status": "No Pickup"},
        {"cust_name": "Goh Siew Ling",             "phone": "60125556706", "budget": "$600K-$900K",  "location": "Subang Jaya",    "status": "Might Keep In Touch"},
    ],
    # Set 1 — Sub-agent 1 (Sarah Chen)
    [
        {"cust_name": "Ramesh Kumar",     "phone": "60125556800", "budget": "$350K-$550K",   "location": "Puchong",          "status": "Pending Appointment"},
        {"cust_name": "Chong Mei Ling",    "phone": "60125556801", "budget": "$450K-$650K",   "location": "Old Klang Road",   "status": "WhatsApp"},
        {"cust_name": "Haris Iskandar",   "phone": "60125556802", "budget": "$900K-$1.2M",   "location": "TTDI",             "status": "Appointment"},
        {"cust_name": "Kavitha Raj",      "phone": "60125556803", "budget": "$250K-$400K",   "location": "Kepong",           "status": "Not Yet Call"},
        {"cust_name": "Lim Chee Keong",   "phone": "60125556804", "budget": "$1.5M-$2.5M",   "location": "Desa ParkCity",    "status": "Completed"},
        {"cust_name": "Nor Azlina",       "phone": "60125556805", "budget": "$300K-$500K",   "location": "Ampang",           "status": "No Pickup"},
        {"cust_name": "Jason Yap",        "phone": "60125556806", "budget": "$700K-$1M",     "location": "Sri Hartamas",     "status": "Might Keep In Touch"},
    ],
    # Set 2 — Sub-agent 2 (James Lim)
    [
        {"cust_name": "Siti Fatimah",     "phone": "60125556900", "budget": "$500K-$800K",   "location": "Shah Alam",        "status": "Pending Appointment"},
        {"cust_name": "Darren Lee",       "phone": "60125556901", "budget": "$400K-$600K",   "location": "Kota Damansara",   "status": "WhatsApp"},
        {"cust_name": "Sharifah Aminah",  "phone": "60125556902", "budget": "$1M-$1.5M",     "location": "KL Sentral",       "status": "Appointment"},
        {"cust_name": "Rajesh Menon",     "phone": "60125556903", "budget": "$180K-$250K",   "location": "Sentul",           "status": "Not Yet Call"},
        {"cust_name": "Yap Mei Fong",     "phone": "60125556904", "budget": "$800K-$1.2M",   "location": "Damansara Heights","status": "Completed"},
        {"cust_name": "Mohd Rizal",       "phone": "60125556905", "budget": "$350K-$500K",   "location": "Gombak",           "status": "No Pickup"},
        {"cust_name": "Angela Pereira",   "phone": "60125556906", "budget": "$600K-$850K",   "location": "Kelana Jaya",      "status": "Might Keep In Touch"},
    ],
]

DEMO_SPEECH_TEMPLATES = [
    {
        "transcription": "Prospect expressed strong interest in units near this area. We discussed pricing options and available units. The prospect wants to consult with their family before making a final decision.",
        "sentiment": {"overallSentiment": "positive", "score": 0.75},
        "next_actions": ["Follow up on family discussion", "Prepare unit comparison sheet", "Schedule site visit"],
        "preferences": {"budgetValue": "Mid-range", "location": "Klang Valley", "purpose": "buy"},
        "summary": "Strong interest shown. Prospect needs to consult family members. Follow-up call scheduled for next week.",
        "buyer_stage": "Pending Appointment",
    },
    {
        "transcription": "Prospect called to inquire about the listing. Wanted to know about nearby amenities, public transport access, and financing options. Price-sensitive but clearly interested in the area.",
        "sentiment": {"overallSentiment": "neutral", "score": 0.5},
        "next_actions": ["Send property brochure", "Share nearby amenities info", "Follow up in one week"],
        "preferences": {"budgetValue": "Entry-level", "location": "City Centre", "purpose": "investment"},
        "summary": "Budget-conscious prospect looking for investment property. Location is the top priority. Needs more information on financing.",
        "buyer_stage": "WhatsApp",
    },
    {
        "transcription": "Confirmed site viewing appointment for this weekend. Prospect is very enthusiastic about the development. Asked detailed questions about floor plans, completion date, and maintenance fees.",
        "sentiment": {"overallSentiment": "very positive", "score": 0.9},
        "next_actions": ["Prepare for site visit", "Bring floor plans and price list", "Check unit availability"],
        "preferences": {"budgetValue": "Premium", "location": "Prime area", "purpose": "buy"},
        "summary": "Highly motivated buyer ready to make a decision. Site visit scheduled. High probability of conversion.",
        "buyer_stage": "Appointment",
    },
]

DEMO_OBJECTIONS = [
    "Too Expensive",
    "Location Too Far",
    "Need to Discuss with Family",
    "Concerned About Financing",
    "Comparing with Other Properties",
]

def seed_demo_data(db: Session, user_id: uuid.UUID, set_index: int = 0):
    existing = db.execute(
        select(Customers).where(Customers.user_id == user_id).limit(1)
    ).scalar_one_or_none()
    if existing:
        return

    customer_set = CUSTOMER_SETS[set_index]

    customer_map = {}
    for c in customer_set:
        customer = Customers(
            cust_id=uuid.uuid4(),
            user_id=user_id,
            cust_name=c["cust_name"],
            phone=c["phone"],
            budget=c["budget"],
            location=c["location"],
            status=c["status"],
        )
        db.add(customer)
        db.flush()
        customer_map[c["cust_name"]] = customer

    for i, sa in enumerate(DEMO_SPEECH_TEMPLATES):
        customer_names = list(customer_map.keys())
        if i >= len(customer_names):
            break

        cust_name = customer_names[i]
        customer = customer_map[cust_name]

        analysis = SpeechAnalysis(
            id=uuid.uuid4(),
            user_id=user_id,
            customer_id=customer.cust_id,
            customer_name=cust_name,
            transcription=sa["transcription"],
            sentiment=sa["sentiment"],
            next_actions=sa["next_actions"],
            preferences=sa["preferences"],
            summary=sa["summary"],
            buyer_stage=sa["buyer_stage"],
            created_at=datetime.utcnow() - timedelta(days=i + 1),
        )
        db.add(analysis)
        db.flush()

        for obj_type in DEMO_OBJECTIONS[:2]:
            objection = Objection(
                objection_id=uuid.uuid4(),
                call_id=analysis.id,
                objection_type=obj_type,
            )
            db.add(objection)

    customer_names = list(customer_map.keys())

    db.commit()
