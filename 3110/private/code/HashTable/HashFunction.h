#pragma once

#include <string>

// KeyType must be either int or string
template<int TableSize>
class HashFunction
{
public:
    HashFunction(void);

    // overload function call operator
    int operator () (int key) const;
    int operator () (std::string key) const;
};
