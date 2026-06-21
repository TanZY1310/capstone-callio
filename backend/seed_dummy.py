"""Seed a dummy user and customer for testing the speech feature."""
import uuid
from passlib.context import CryptContext
from database import SessionLocal, create_tables
from models.user import Users, UserRole
from models.customer import Customers

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    create_tables()
    db = SessionLocal()
    try:
        user = db.query(Users).filter(Users.email == "dummy@test.com").first()
        if not user:
            user = Users(
                first_name="Test",
                last_name="Agent",
                role=UserRole.AGENT,
                email="dummy@test.com",
                password=pwd_context.hash("password123"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user: {user.user_id}")

        customer = db.query(Customers).filter(Customers.phone == "0123456789").first()
        if not customer:
            customer = Customers(
                cust_name="Ahmad Bin Abdullah",
                phone="0123456789",
                budget=500000,
                location="Kuala Lumpur",
                status="lead",
                user_id=user.user_id,
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
            print(f"Created customer: {customer.cust_id}")
        else:
            print(f"Customer already exists: {customer.cust_id}")

        print(f"\nCustomer UUID for testing: {customer.cust_id}")
        print(f"Name: {customer.cust_name}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
