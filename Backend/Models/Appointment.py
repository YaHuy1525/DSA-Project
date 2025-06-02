from Models.AppointmentHistory import AppointmentHistory
class AppointmentNode:
    def __init__(self, date, time, username):
        self.date = date
        self.time = time
        self.username = username
        self.left = None
        self.right = None
        self.height = 1

class AppointmentBST:  # Binary Search Tree
    def __init__(self):
        self.history = AppointmentHistory()
        self.root = None
        
    def height(self, node):
        if not node:
            return 0
        return node.height
        
    def get_balance(self, node):
        if not node:
            return 0
        return self.height(node.left) - self.height(node.right)
    
    def rotate_right(self, y):
        x = y.left
        T2 = x.right
        
        x.right = y
        y.left = T2
        
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        
        return x
    
    def rotate_left(self, x):
        y = x.right
        T2 = y.left
        
        y.left = x
        x.right = T2
        
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        
        return y
    
    def insert_node(self, node, date, time, username):
        if not node:
            return AppointmentNode(date, time, username)
        if date < node.date or (date == node.date and time < node.time):
            node.left = self.insert_node(node.left, date, time, username)
        elif date > node.date or (date == node.date and time > node.time):
            node.right = self.insert_node(node.right, date, time, username)
        else:
            return node
        node.height = 1 + max(self.height(node.left), self.height(node.right))
        balance = self.get_balance(node)
        
        # Left Left Case
        if balance > 1 and ((date < node.left.date) or (date == node.left.date and time < node.left.time)):
            return self.rotate_right(node)
            
        # Right Right Case
        if balance < -1 and ((date > node.right.date) or (date == node.right.date and time > node.right.time)):
            return self.rotate_left(node)
            
        # Left Right Case
        if balance > 1 and ((date > node.left.date) or (date == node.left.date and time > node.left.time)):
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
            
        # Right Left Case
        if balance < -1 and ((date < node.right.date) or (date == node.right.date and time < node.right.time)):
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)
            
        return node
    
    def insert(self, date, time, username):
        self.root = self.insert_node(self.root, date, time, username)
        self.history.add_appointment(date, time, username)
        print('Displaying using Trees: ', end="\n")
        self.printInorder(self.root)
        print('\n')
        return True, "Appointment booked successfully"
    
    def find_appointment(self, node, date, time):
        if not node:
            return None
            
        if date == node.date and time == node.time:
            return node
            
        if date < node.date or (date == node.date and time < node.time):
            return self.find_appointment(node.left, date, time)
            
        return self.find_appointment(node.right, date, time)
    
    def get_appointment(self, date, time):
        return self.find_appointment(self.root, date, time)
    
    def get_user_appointments(self, username):
        return self.history.get_user_appointments(username)
    
    def printInorder(self, node):
        if node:
            self.printInorder(node.left)
            print(node.date, node.time, end="\n")
            self.printInorder(node.right)
        
    def display_appointments(self):
        self.history.display_appointments()
        
    def delete_appointment(self, username):
        self.history.remove_appointment(username)
        return True, "Appointment deleted successfully"