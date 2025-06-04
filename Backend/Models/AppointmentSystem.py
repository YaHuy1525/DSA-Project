from Models.AppointmentHistory import AppointmentHistory
from Models.User import HashTable, User
from Models.Appointment import AppointmentBST

class AppointmentSystem:
    def __init__(self):
        self.users = HashTable()
        self.appointments = AppointmentBST()
    
    def register_user(self, name: str, email: str, password: str):
        existing_user = self.users.get(email)
        if existing_user:
            return False, "User already exists"
        user = User(name, email, password)
        self.users.insert(email, user)
        self.users.display()
        return True, "User registered successfully"
    
    def authenticate_user(self, email: str, password: str):
        user = self.users.get(email)
        if not user:
            return False, "User not found", None
        if user.password != password:
            return False, "Invalid password", None
        return True, "Login successful", user.name
    
    def get_user_appointments(self, username):
        self.appointments.display_appointments()
        return self.appointments.get_user_appointments(username)
    
    def book_appointment(self, date, time, username):
        if self.appointments.find_appointment(self.appointments.root, date, time):
            return False, "Appointment already exists"
        return self.appointments.insert_node(date, time, username)
    
    def remove_appointment(self, date, time):
        return self.appointments.delete_node(date, time)