import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

// Simple date formatter function (since we can't use date-fns)
const formatDate = (date) => {
  if (!date) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const DateRangePicker = () => {
  // State for the date range
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 3, 28), // April 28, 2025
    to: new Date(2025, 3, 30)    // April 30, 2025
  });
  
  // State for popover open/closed
  const [isOpen, setIsOpen] = useState(false);
  
  // State for which date we're selecting (from or to)
  const [selectingMode, setSelectingMode] = useState('from'); // 'from' or 'to'
  
  // State for current view (month/year being viewed)
  const [currentView, setCurrentView] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  
  // Reference to the popover for detecting outside clicks
  const popoverRef = useRef(null);
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Generate days for the calendar
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };
  
  // Get days for current view
  const days = getDaysInMonth(currentView.month, currentView.year);
  
  // Move to previous month
  const prevMonth = () => {
    setCurrentView(prev => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      
      return { month: newMonth, year: newYear };
    });
  };
  
  // Move to next month
  const nextMonth = () => {
    setCurrentView(prev => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      
      return { month: newMonth, year: newYear };
    });
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    if (selectingMode === 'from') {
      setDateRange({ from: date, to: null });
      setSelectingMode('to');
    } else {
      // Ensure 'to' date is after 'from' date
      if (date >= dateRange.from) {
        setDateRange(prev => ({ ...prev, to: date }));
      } else {
        // If user selects a date before 'from', swap them
        setDateRange({ from: date, to: dateRange.from });
      }
      setIsOpen(false);
      setSelectingMode('from');
    }
  };
  
  // Get display text for the button
  const getButtonText = () => {
    if (dateRange.from) {
      if (dateRange.to) {
        return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
      }
      return formatDate(dateRange.from);
    }
    return 'Pick a date range';
  };
  
  // Check if a date is the 'from' date, 'to' date, or in between
  const isDateSelected = (date) => {
    if (!date) return false;
    
    const isFrom = dateRange.from && 
      date.getDate() === dateRange.from.getDate() && 
      date.getMonth() === dateRange.from.getMonth() && 
      date.getFullYear() === dateRange.from.getFullYear();
      
    const isTo = dateRange.to && 
      date.getDate() === dateRange.to.getDate() && 
      date.getMonth() === dateRange.to.getMonth() && 
      date.getFullYear() === dateRange.to.getFullYear();
      
    const isInRange = dateRange.from && dateRange.to && 
      date > dateRange.from && date < dateRange.to;
    
    return { isFrom, isTo, isInRange };
  };
  
  // Get month name
  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  };
  
  return (
    <div className="relative w-full" ref={popoverRef}>
      {/* {/ Trigger Button /} */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full justify-start text-left px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
      >
        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
        <span>{getButtonText()}</span>
      </button>
      
      {/* {/ Popover Content /} */}
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-auto">
          <div className="flex flex-col space-y-4">
            {/* {/ First Month /} */}
            <div>
              {/* {/ Month Navigation /} */}
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={prevMonth} 
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  &lt;
                </button>
                <div className="font-medium">
                  {getMonthName(currentView.month)} {currentView.year}
                </div>
                <button 
                  onClick={nextMonth} 
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  &gt;
                </button>
              </div>
              
              {/* {/ Calendar Grid /} */}
              <div className="grid grid-cols-7 gap-1">
                {/* {/ Day headers /} */}
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* {/ Calendar days /} */}
                {days.map((day, i) => {
                  const { isFrom, isTo, isInRange } = day ? isDateSelected(day) : { isFrom: false, isTo: false, isInRange: false };
                  
                  return (
                    <div key={i} className="text-center p-1">
                      {day ? (
                        <button
                          onClick={() => handleDateSelect(day)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                            ${isFrom || isTo ? 'bg-blue-600 text-white' : 
                              isInRange ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        >
                          {day.getDate()}
                        </button>
                      ) : (
                        <span className="w-8 h-8"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* {/ Instructions /} */}
            <div className="text-xs text-gray-500 text-center">
              {selectingMode === 'from' ? 'Select start date' : 'Select end date'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;