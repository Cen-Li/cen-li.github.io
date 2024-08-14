#include <iostream>

using namespace std;

const int SIZE=6;
int main()
{
    int a[SIZE]={0};
    int position, value;

    for (int i=0; i<4; i++)
      a[i] = i*10;

    position = 0;
    // delete value at position
    for (int i=position; i<4-1; i++)
        a[i] = a[i+1];

    for (int i=0; i<SIZE; i++)
		cout << a[i] << endl;

    return 0;
}
    
