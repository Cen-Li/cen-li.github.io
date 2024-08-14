//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the header file hourlyemployee.h. 
//This is the interface for the class HourlyEmployee.
#ifndef HOURLYEMPLOYEE_H
#define HOURLYEMPLOYEE_H

#include <string>
#include "Employee.h"

using namespace std;

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

/*
The override keyword serves two purposes:

It shows the reader of the code that "this is a virtual method, that is overriding a virtual method of the base class."
The compiler also knows that it's an override, so it can "check" that you are not altering/adding new methods that you think are overrides.
  
class base
{
  public:
    virtual int foo(float x) = 0; 
};


class derived: public base
{
   public:
     int foo(float x) override { ... } // OK
};

class derived2: public base
{
   public:
     int foo(int x) override { ... } // ERROR
};
*/