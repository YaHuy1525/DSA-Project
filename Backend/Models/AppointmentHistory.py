class AppointmentNode:
    def __init__(self, date, time, username):
        self.date = date
        self.time = time
        self.username = username
        self.next = None
        self.prev = None
        
class AppointmentHistory:
    def __init__(self):
        self.head = None
        self.tail = None
    
    def add_appointment(self, date, time, username):
        new_node = AppointmentNode(date, time, username)
        if not self.head:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node

    def get_user_appointments(self, username):
        appointments = []
        current = self.head
        while current:
            if current.username == username:
                appointments.append({
                    'date': current.date,
                    'time': current.time
                })
            current = current.next
        return appointments

    def remove_appointment(self, date, time):
        current = self.head
        while current:
            if current.date == date and current.time == time:
                if current.prev:
                    current.prev.next = current.next
                if current.next:
                    current.next.prev = current.prev
                if current == self.head:
                    self.head = current.next
                if current == self.tail:
                    self.tail = current.prev
                return True
            current = current.next
        return False
    
    def display_appointments(self):
        print("Displaying appointments using LinkedList:")
        current = self.head
        while current:
            print(f"Date: {current.date}, Time: {current.time}, Username: {current.username}")
            current = current.next

