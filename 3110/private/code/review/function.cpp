#include <iostream>
using namespace std;

float GetInput();

void Compute(float r, float &area, float &circumference);

int main()
{
    float radius;
    float area, circumference;


    radius = GetInput();

    Compute(radius, area, circumference);

    cout << "area = " << area << endl;
    cout << "circumference =" <<  circumference << endl;

    return 0;
}

float GetInput()
{
    float r;

    cout << "Enter radius:" << endl;
    cin >> r;
  
    return r;
}

void Compute(float r, float &area, float &circumference)
{
    const float PI = 3.1415;

    area = PI*r*r;
    circumference = 2*PI*r;
   
    return;
}
