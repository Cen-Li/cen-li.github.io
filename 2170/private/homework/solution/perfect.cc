// This program asks the user to enter an integer,
// it determines whether the number is a perfect number.
//
#include <iostream>
using namespace std;

int main() {

    int number;
    int sum=0;

    cout << "Enter an integer number: ";
    cin >> number;

    for (int i=1; i<=number/2; i++)   {
        if (number%i == 0) {
            sum += i;
        }
    }

    if (sum == number)  {
       cout << "It is a perfect number. " << endl;
    }
    else  {
       cout << "It is not a perfect number. " << endl;
    }

    return 0;
}
     
