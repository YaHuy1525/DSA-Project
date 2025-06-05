class User:
    def __init__(self, name:str, email: str, password: str):
        self.name = name
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'password': self.password
        }

class HashTable:
    def __init__(self, size=256):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        index = self._hash(key)
        print(f"Inserting key: {key}, hash: {index}")
        
        for i, item in enumerate(self.table[index]):
            if item[0] == key:
                self.table[index][i] = (key, value)
                print(f"Updated existing key: {key}")
                return
        
        self.table[index].append((key, value))
        print(f"Added new key: {key}")
    
    def get(self, key):
        index = self._hash(key)
        for item in self.table[index]:
            if item[0] == key:
                return item[1]
        print(f"Key not found: {key}")
        return None
    
    def display(self):
        for item in self.table:
            if(item):
                print(item)
                
                
                
                
                