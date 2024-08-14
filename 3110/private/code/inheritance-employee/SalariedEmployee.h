//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the header file salariedemployee.h. 
//This is the interface for the class SalariedEmployee.
#ifndef SALARIEDEMPLOYEE_H
#define SALARIEDEMPLOYEE_H

#include <string>
#include "Employee.h"

using namespace std;

class SalariedEmployee : public Employee
{
public:
    SalariedEmployee( );
    SalariedEmployee (string theName, string theSsn,
                      double theWeeklySalary);

    double getSalary( ) const;
    void setSalary(double newSalary); 
    
    void printCheck( ) const override;		// notice "const override"				

private:
    double m_salary;
};

#endif //SALARIEDEMPLOYEE_H

