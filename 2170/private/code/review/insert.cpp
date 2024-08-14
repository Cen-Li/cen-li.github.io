#include <iostream>
#include<fstream>

using namespace std;

void ReadData(ifstream &myIn, int a[], int &count);

const int SIZE=10;
int main()
{
    int a[SIZE]={0};
    int position, value;
    int count;
    ifstream myIn;
    myIn.open("array.dat");

    ReadData(myIn, a, count);
 
    cout << "Before insertion:" << endl;  
    for (int i=0; i<count; i++)
		cout << a[i] << endl;
   
    myIn.close();

    position = 1;
    value = 25;
    // insert value at position
    for (int i=count; i>=position; i--)
        a[i+1] = a[i];
    a[position] = value;

    count++;

    cout << "After insertion:" << endl;  
    for (int i=0; i<count; i++)
		cout << a[i] << endl;

    return 0;
}
    
void ReadData(ifstream &myIn, int a[], int &count)
{
    count =0;

    while (myIn >> a[count])
    {
       count ++;
    }

    return;
}

