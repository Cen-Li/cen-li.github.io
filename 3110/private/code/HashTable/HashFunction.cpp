#include <cmath>
#include "HashFunction.h"

using namespace std;

template <int TableSize>
HashFunction<TableSize>::HashFunction(void)
{
}


// overload function call operator
template <int TableSize>
int HashFunction<TableSize>::operator () (int key) const
{
    return key % TableSize;
}

template <int TableSize>
int HashFunction<TableSize>::operator () (string key) const
{
    unsigned long    result=0;

    for ( int i=key.size()-1; i>=0; --i )
        result += (unsigned long)(key[i] * pow(float(32),i));
    return result % TableSize;
}
