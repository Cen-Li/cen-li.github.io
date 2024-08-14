//****************************************************************
// BMI Program
// This program calculates the body mass index (BMI) given a weight
// in pounds and a height in inches and prints a health message
// based on the BMI. Input in English measures.
//*****************************************************************

#include <iostream>

using namespace std;

int main()
{
  const int BMI_CONSTANT = 703;  // Constant in non-metric formula
  float weight;			   // Weight in weight
  float height;			   // Height in height
  float bodyMassIndex;		   // Appropriate BMI
  bool dataIsOK;                 // True if data non-negative
  
  // Prompt for and input weight and height
  cout << "Enter your weight in pounds. " << endl;
  cin >> weight;
  cout << "Enter your height in inches. " << endl;
  cin >> height;
  
  // Test data
  if (weight < 0 || height < 0)
    dataIsOK = false;
  else
    dataIsOK = true;

  if (dataIsOK)
  {
    // Calculate body mass index
    bodyMassIndex = weight * BMI_CONSTANT / (height * height);
  
    // Print message indicating status
    cout << "Your body mass index is " << bodyMassIndex 
         << ". " << endl;
    cout << "Interpretation and instructions. " << endl;
    if (bodyMassIndex < 20)
      cout << "Underweight: Have a milkshake." << endl;
    else if (bodyMassIndex <= 25)
      cout << "Normal: Have a glass of milk."  << endl;
    else if (bodyMassIndex <=  30)
      cout << "Overweight: Have a glass of ice tea."  << endl;
    else
      cout << "Obese: See your doctor." << endl;
  }
  else
    cout << "Invalid data; weight and height must be positive." 
         << endl; 
  return 0;
}             

