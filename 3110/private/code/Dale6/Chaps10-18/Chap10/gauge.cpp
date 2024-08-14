// Program Gauge inputs pressure readings from file Gauge.dat 
// and writes appropriate messages.  

#include <iostream>
#include <fstream>
using namespace std;

enum  DecisionType {ERROR, NORMAL, HIGH, EVACUATE}; 

DecisionType  GetPressure(ifstream&);
// Returns variable of DecisionType.

int main ()
{
  ifstream  readings;
  DecisionType  pressure;        
  readings.open("gauge.dat");
  do
  {
    pressure = GetPressure(readings);
    switch (pressure)
    {
      case ERROR    : cout << "Error in input."  << endl;
                      break;
      case NORMAL   : cout << "Pressure in normal range." << endl;
                      break;
      case HIGH     : cout << "Pressure on the high side." << endl;
                      break;   
      case EVACUATE : cout << "Evacuate plant!!!!" << endl;
                      break;
    }
  }  while (pressure != EVACUATE);
  return 0;
}

/**************************************************/        
                                                            

DecisionType GetPressure(ifstream& readings)
// Pre:  File readings has been opened.                     
// Post: An integer pressure has been read from file readings.  
//       pressure is ERROR if a negative pressure was read.        
//       pressure is NORMAL if the value was between 0 and 49.   
//       pressure is HIGH if the value was between 50 and 99.        
//       pressure is EVACUATE if the value was 100 or greater.       

{                                                            
  int reading;
  DecisionType pressure;
  readings  >> reading;
  if (reading < 0)
     pressure = ERROR;
  else if (reading < 50)
     pressure = NORMAL;
  else if (reading < 100)
    pressure = HIGH;
  else 
    pressure = EVACUATE;
  return pressure;
}                                                         
