//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the header file hourlyemployee.h. 
//This is the interface for the class HourlyEmployee.
#ifndef HOURLYEMPLOYEE_H
#define HOURLYEMPLOYEE_H

#include <string>
#include "Employee.h"

using std::string;

class HourlyEmployee : public Employee 
{
public:
    HourlyEmployee( );
    HourlyEmployee(string theName, string theSsn,
                   double theWageRate, double theHours);
                   
    void setRate(double newWageRate);
    double getRate( ) const;
    
    void setHours(double hoursWorked);
    double getHours( ) const;
    
    void printCheck( ) const override; 

private:
    double m_wageRate; 
    double m_hours;
};

#endif //HOURLYMPLOYEE_H


