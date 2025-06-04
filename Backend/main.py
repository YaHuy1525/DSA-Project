from flask import Flask, request, jsonify
from flask_cors import CORS
from Models.AppointmentSystem import AppointmentSystem

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

appointment_system = AppointmentSystem()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        success, message = appointment_system.register_user(
            data.get('name', ''),
            data['email'],
            data['password']
        )
        return jsonify({'success': success, 'message': message})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400    
        print("Login request data:", data) 
        
        if 'email' not in data or 'password' not in data:
            return jsonify({
                'success': False, 
                'message': 'Email and password are required',
                'received_data': str(data)
            }), 400
            
        success, message, name = appointment_system.authenticate_user(
            data['email'],
            data['password']
        )
        if success:
            return jsonify({
                'success': True, 
                'message': message,
                'name': name
            })
        return jsonify({'success': False, 'message': message}), 401
    except Exception as e:
        print("Login error:", str(e)) 
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/api/appointments/book', methods=['POST'])
def book_appointment():
    try:
        data = request.json
        success, message = appointment_system.book_appointment(
            data['date'],
            data['time'],
            data['username']
        )
        return jsonify({'success': success, 'message': message})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/api/appointments/delete/<date>/<time>', methods=['DELETE'])
def delete_appointment(date, time):
    try:
        success, message = appointment_system.remove_appointment(date, time)
        return jsonify({'success': success, 'message': message})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')