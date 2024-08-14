#pragma once

template <class KeyType>
class HashTableValue
{
public:
    virtual KeyType getKey( void ) const = 0;
};
