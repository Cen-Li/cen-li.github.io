#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

const int ROWS= 5;
const int COLS=5;

int main()
{
    int scores[ROWS][COLS];
    int id[ROWS];

    ifstream myIn("2Darray1.dat");
    assert(myIn);

    for (int i=0; i<3; i++)
    {
       myIn >> id[i]; 
       for (int j=0; j<3; j++)
       {
            myIn >> scores[i][j];
       } 
    }

    // output data
    for (int i=0; i<3; i++)
    {
       for (int j=0; j<3; j++)
           cout << scores[i][j] << "  ";
       cout << endl;
    }

    for (int j=0; j<3; j++)
    {
        float avg=0.0;
        for (int i=0; i<3; i++)
        {
             avg += scores[i][j];
        }
        cout << avg/3 << " ";
    }
    cout << endl;

    
    for (int i=0; i<3; i++)
    {
        float avg=0.0;
        for (int j=0; j<3; j++)
        {
             avg += scores[i][j];
        }
        cout << "student " << id[i] << " average=" << avg/3 << endl;
    }


    myIn.close();

    return 0;
}
