#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

int main()
{
    float principle, rate, numberTimes;
    int years;
    float amount;

    cout << "Enter principle amount of your investment : $";
    cin >> principle;

    cout << "Enter the interest rate: ";
    cin >> rate;
    rate = rate/100;

    cout << "Enter the number of times interest is compounded per year:";
    cin >> numberTimes;

    cout << "Enter the number of years of this investment: ";
    cin >> years;

    amount = principle * pow((1 + rate/numberTimes), numberTimes*years);

    cout << fixed << setprecision(2);
    cout << "Your investment of $"<< principle << " will grow into $ "
         << amount << " at the end of " << years << " years." << endl;

    return 0;
}
