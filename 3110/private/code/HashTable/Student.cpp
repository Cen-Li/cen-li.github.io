#include "Student.h"

using namespace std;

Student::Student(string name, string phoneNO)
: m_name(name), m_phoneNO(phoneNO)
{}

string Student::getName( void ) const
{
    return m_name;
}

string Student::getPhoneNO( void ) const
{
    return m_phoneNO;
}


string Student::getKey( void ) const
{
    return m_phoneNO;
}

ostream& operator << (ostream& out, const Student& student)
{
    out << "[" << student.m_name << ", " << student.m_phoneNO << "]";
    return out;
}