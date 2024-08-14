#include "type.h"
#include <iostream>
using namespace std;

int main()
{
    ComplexStruct  data;
    data.real=5;
    data.imaginary=10;

    cout << data;
    return 0;
}
