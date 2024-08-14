#include "IntType.h"

using namespace std;

IntType::IntType(int value)
:m_value(value)
{}

// overload int operator
IntType::operator int( void ) const
{
    return m_value;
}

int IntType::getKey( void ) const
{
    return m_value;
}

ostream& operator << (ostream& out, IntType value)
{
    out << value.m_value;

    return out;
}

