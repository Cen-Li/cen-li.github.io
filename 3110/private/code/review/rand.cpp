#include <iostream>
using namespace std;

int GetData();

int main()
{
    int data;

    for (int i=0; i<10; i++)
    {
        data = GetData();
        cout << "data = " << data << endl;
    }

    return 0;
}

int GetData()
{
    srand(time(0));
    return rand()%100;
}
