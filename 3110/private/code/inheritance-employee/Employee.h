//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp
//This is the header file employee.h. 
//This is the interface for the class Employee.
//This is primarily intended to be used as a base class to derive
//classes for different kinds of employees.
#ifndef EMPLOYEE_H
#define EMPLOYEE_H

#include <string>
using namespace std;

class Employee
{
public:
    Employee( );
    Employee(string theName, string theSsn);

    string getName( ) const;  // necessary for passing object with const & 
    string getSsn( ) const;
    double getNetPay( ) const;
        
    void setName(string newName); 
    void setSsn(string newSsn);
    void setNetPay(double newNetPay);

    virtual void printCheck( ) const;

private:
    string m_name; 
    string m_ssn; 
    double m_netPay;
};

#endif //EMPLOYEE_H
