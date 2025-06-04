const API_BASE_URL = 'http://localhost:5000/api';

export interface BaseResponse {
  success: boolean;
  message?: string;
}
export interface Appointment {
  date: string;
  time: string;
  username: string;
}
export interface User {
  email: string;
  name: string;
}
export interface UserResponse extends BaseResponse {
  name?: string;
  email?: string;
}
export interface AppointmentResponse extends BaseResponse {
  appointment?: Appointment;
  appointments?: Appointment[];
}

export const api = {
  async register(userData: { name: string; email: string; password: string }): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json() as UserResponse;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Error' 
      };
    }
  },

  async login(email: string, password: string): Promise<UserResponse> {
    try {
      const payload = { email, password };
      console.log('Sending login request with:', payload);
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'ERROR' 
      };
    }
  },
  

  async bookAppointment(date: string, time: string, username: string): Promise<AppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date, 
          time, 
          username,
        }),
      });    
      const data = await response.json();
      console.log('Booking status:', data);
      return data;
    } catch (error) {
      console.error('Booking error:', error);
      return { 
        success: false, 
        message: 'Network error while booking appointment' 
      };
    }
  },

  async deleteAppointment(date: string, time: string): Promise<BaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/delete/${date}/${time}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return { 
        success: false, 
        message: 'Error deleting appointment' 
      };
    }
  },

  async getAppointmentHistory(username: string): Promise<AppointmentResponse> {
    try {
      if (!username) {
        console.error('No username provided for appointment history');
        return { success: false, message: 'No username provided' };
      }   
      const response = await fetch(`${API_BASE_URL}/appointments/history/${encodeURIComponent(username)}`);
      const data = await response.json() as AppointmentResponse;
      return data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { 
        success: false, 
        message: 'ERROR' 
      };
    }
  }
};
