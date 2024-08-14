// Program Typos prints three integer numbers, sums the numbers, calculates
// the average, and prints the sum and the average of the three numbers.

#Include <i0stream>
#Include <i0manip>
using namespace std;

const ONE = 5;
const TWO = 6;
const THREE = 7;

int Main ()
    int sum;
    float average;

    cout  << fixed  << showpoint;

    c0ut  << SetW(5)  << ONE  << TWO  << THREE  << end1;
    sum = OnE + TW0 + THREE;
    average = sum % 3;
    Cout  << " The sum is "  << average  << " and the average is "
	  << sum  <endl;
    return 0;
}
