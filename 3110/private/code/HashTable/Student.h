#pragma once

#include <string>
#include <iostream>

#include "HashTableValue.h"


class Student : public HashTableValue<std::string>
{
public:
    Student(std::string name, std::string phoneNO);

    std::string getName( void ) const;
    std::string getPhoneNO( void ) const;

    // inherited from HashTableValue class
    std::string getKey( void ) const;

    friend std::ostream& operator << (std::ostream&, const Student&);

private:
    std::string     m_name;
    std::string     m_phoneNO;
};


std::ostream& operator << (std::ostream&, const Student&);
