#pragma once

#include <iostream>

#include "HashTableValue.h"

class IntType : public HashTableValue<int>
{
public:
    IntType(int value=-1);

    // overload int operator
    operator int( void ) const;
    
    // inherited from HashTableValue
    int getKey( void ) const;

    friend std::ostream& operator << (std::ostream&, IntType);
private:
    int m_value;
};


std::ostream& operator << (std::ostream&, IntType);
