// Program Pointer reads in three variables, assigns
// pointers to them, adds them, and prints the result. 

#include <iostream>
using namespace std;
                                     
int  main ()
{
    int  one;
    int  two;
    int  three;
    int  result;
    int*  ptrOne;
    int*  ptrTwo;
    int*  ptrThree;

    cout  << "Enter three integer numbers separated"
          << " by blanks; press return."  << endl;
    cin  >> one  >> two  >> three;
    ptrOne = &one;
    ptrTwo = &two;
    ptrThree = &three;
    cout  << endl  << *ptrOne  << " + "  << *ptrTwo  
          << " + "  << *ptrThree  << " = ";
    result = *ptrOne + *ptrTwo + *ptrThree;
    cout  << result  << endl;
    return 0;
}
