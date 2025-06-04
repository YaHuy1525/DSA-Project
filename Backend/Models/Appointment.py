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
    
    def _update_heights_and_balance(self, node):
        if not node:
            return None  
        node.height = 1 + max(self.height(node.left), self.height(node.right))
        print("Balancing tree")
        balance = self.get_balance(node)
        # Left Left Case
        if balance > 1 and self.get_balance(node.left) >= 0:
            return self.rotate_right(node)
        
        # Left Right Case
        if balance > 1 and self.get_balance(node.left) < 0:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
    
        # Right Right Case
        if balance < -1 and self.get_balance(node.right) <= 0:
            return self.rotate_left(node)
        
        # Right Left Case
        if balance < -1 and self.get_balance(node.right) > 0:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)
        
        return node
    
    def insert(self, node, date, time, username):
        if not node:
            return AppointmentNode(date, time, username)
        if date < node.date or (date == node.date and time < node.time):
            node.left = self.insert(node.left, date, time, username)
        elif date > node.date or (date == node.date and time > node.time):
            node.right = self.insert(node.right, date, time, username)
        else:
            return node   
        node = self._update_heights_and_balance(node)
        return node
    
    def insert_node(self, date, time, username):
        self.root = self.insert(self.root, date, time, username)
        self.history.add_appointment(date, time, username)
        print('Displaying using Trees(Inorder): ', end="\n")
        self.printInorder(self.root)
        print('\n')
        return True, "Appointment booked successfully"
    
    def find_min(self, node):
        while node.left:
            node = node.left
        return node
    
    def find_successor(self, node):
        if node.right:
            return self.find_min(node.right)
        successor = None
        current = self.root
        while current:
            if (node.date < current.date or (node.date == current.date and node.time < current.time)):
                successor = current
                current = current.left
            elif (node.date > current.date or (node.date == current.date and node.time > current.time)):
                current = current.right
            else: 
                break
        return successor
    
    def find_parent(self, node):
        current = self.root
        if (current.left == node or current.right == node):
            return current
        while current:
            if node.date < current.date or (node.date == current.date and node.time < current.time):
                if current.left == node:
                    return current
                current = current.left
            else:
                if current.right == node:
                    return current
                current = current.right
        return None
    
    def _delete(self, node, date, time):
        if not node:
            return node
        if date < node.date or (date == node.date and time < node.time):
            node.left = self._delete(node.left, date, time)
        elif date > node.date or (date == node.date and time > node.time):
            node.right= self._delete(node.right, date, time)
        else:
            if node.left is None:
                temp = node.right
                return temp
            elif node.right is None:
                temp = node.left
                return temp
            temp = self.find_min(node.right)
            node.date = temp.date
            node.time = temp.time
            node.username = temp.username
            node.right = self._delete(node.right, temp.date, temp.time)
        node = self._update_heights_and_balance(node)
        return node
    
    def delete_node(self, date, time):
        self.root = self._delete(self.root, date, time)
        self.history.remove_appointment(date, time)
        print("Displaying using Trees after deleting: ", end="\n")
        self.printInorder(self.root)
        print('\n')
        return True, "Appointment deleted successfully"
    
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
        
    def delete_appointment(self, date, time):
        self.history.remove_appointment(date, time)
        return True, "Appointment deleted successfully"
    
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
        
    def delete_appointment(self, date, time):
        self.history.remove_appointment(date, time)
        return True, "Appointment deleted successfully"