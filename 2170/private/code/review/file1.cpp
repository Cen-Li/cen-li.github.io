#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    int grade, max, min;
    ifstream myIn;

    myIn.open("file1.dat");
    myIn >> grade;
    if (myIn)
    {
       max=grade;
       min=grade;
  
       while (myIn)
       {
          myIn >> grade;
          if (grade > max)
             max = grade;
          else if (grade < min)
             min = grade;
       }   
  
       cout << "max = " << max << endl;
       cout << "min = " << min << endl;
    }
    else 
       cout << "The file is empty, no min and max reported" << endl;
    myIn.close();

    return 0;
}

