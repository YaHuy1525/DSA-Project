import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { api, Appointment } from "../api";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

interface DayInfo {
  id: string;
  day: string;
  date: string;
  disabled: boolean;
}

const generateMonthDays = (year: number, month: number): DayInfo[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const days: DayInfo[] = [];

  // Add empty days for the first week
  for (let i = 0; i < firstDay; i++) {
    days.push({ id: `empty-${i}`, day: "", date: "", disabled: true });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      id: `${year}-${month + 1}-${day}`,
      day: day.toString(),
      date: dateStr,
      disabled: isPast || isWeekend
    });
  }
  
  return days;
};

export const SelectTime = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [username, setUsername] = useState('');

  const handleDateSelect = (date: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    try {
      const response = await api.bookAppointment(selectedDate, selectedTime, username);
      if (response.success) {
        alert('Successfully booked');
        const historyResponse = await api.getAppointmentHistory(username);
        if (historyResponse.success) {
          setAppointments(historyResponse.appointments || []);
        }
        setSelectedDate('');
        setSelectedTime('');
      }
      else{
        alert('Not available');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
  useEffect(() => {
    const storedUsername = localStorage.getItem('userId');
    if (!storedUsername) {
      console.error('No userId found in localStorage');
      navigate('/signin');
      return;
    }
    
    console.log('Found userId in localStorage:', storedUsername);
    setUsername(storedUsername);

    const loadAppointments = async () => {
      try {
        console.log('Fetching appointments for user:', storedUsername);
        const response = await api.getAppointmentHistory(storedUsername);
        console.log('Appointments API response:', response);
        
        if (response && response.success) {
          console.log('Successfully loaded appointments:', response.appointments);
          setAppointments(response.appointments || []);
        } else {
          console.error('Failed to load appointments:', response?.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };
    
    loadAppointments();
  }, [navigate]);

  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Đặt lịch hẹn</h1>
        </div>

        <Tabs defaultValue="booking" className="space-y-6">
          <TabsList className="bg-white rounded-lg p-1">
            <TabsTrigger value="booking" className="flex-1">Đặt lịch</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Lịch sử đặt khám</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-dark-teal">Chọn ngày khám</h2>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{months[currentMonth]} {currentYear}</span>
                    <div className="flex gap-2">
                      <button onClick={handlePreviousMonth}>
                        <img className="w-3.5 h-3.5" alt="Previous month" src="/vuesax-bold-arrow-left.svg" />
                      </button>
                      <button onClick={handleNextMonth}>
                        <img className="w-3.5 h-3.5" alt="Next month" src="/vuesax-bold-arrow-right.svg" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="grid grid-cols-7 gap-1">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    
                    {generateMonthDays(currentYear, currentMonth).map((date) => (
                      <button
                        key={date.id}
                        onClick={() => handleDateSelect(date.date, date.disabled)}
                        disabled={date.disabled}
                        aria-disabled={date.disabled}
                        aria-label={date.day ? `Ngày ${date.day}` : 'Ngày trống'}
                        className={`
                          p-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-dark-teal focus:ring-offset-2
                          ${selectedDate === date.date ? "bg-dark-teal text-white" : ""}
                          ${date.disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"}
                          ${!date.day ? "invisible" : ""}
                        `}
                      >
                        {date.day}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-dark-teal mb-4">Chọn giờ khám</h2>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      disabled={!selectedDate}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium
                        ${!selectedDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : 
                          selectedTime === time ? "bg-dark-teal text-white" : "bg-gray-100 hover:bg-gray-200"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg md:relative md:shadow-none">
              <Button
                className="w-full mt-6 bg-dark-teal hover:bg-teal-700 text-white"
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime}
              >
                Xác nhận đặt lịch
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Bạn chưa có lịch hẹn nào</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment: any) => {
                    const appointmentDate = new Date(appointment.date);
                    const formattedDate = appointmentDate.toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    
                    return (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Ngày: {formattedDate}</p>
                            <p className="text-sm text-gray-600">Giờ: {appointment.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};