// Program Cars reads a record from a file and writes
// its contents back to another file with the price member
// increased by 10%.
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

struct Date
{
  int month;
  int day;
  int year;
};

struct Car
{
  float price;
  Date purchased;
  string customer;
};

Car GetCar(ifstream& dataIn);
// Pre:  File dataIn has been opened.
// Post: The fields of car are read from file dataIn.

void WriteCar(ofstream& dataOut, Car car);
// Pre:  File dataOut has been opened.
// Post: The fields of car are written on file dataOut,
//       appropriately labeled.

int main ()
{
  Car  car;
  ifstream dataIn;
  ofstream dataOut;

  dataIn.open("cars.dat");
  dataOut.open("cars.out");
  cout << fixed << showpoint;

  car = GetCar(dataIn);
  while (dataIn)
  {
    car.price = car.price * 1.10;
    WriteCar(dataOut, car);
    car = GetCar(dataIn);
  }
  return 0;
}

//*****************************************************

Car GetCar(ifstream&  dataIn)
{
  Car car;
  dataIn >> car.customer;
  dataIn >> car.price  >> car.purchased.day
         >> car.purchased.month  >> car.purchased.year;
  dataIn.ignore(2, '\n');
  return car;
}

//*****************************************************

void  WriteCar(ofstream&  dataOut, Car  car)
{
  dataOut << "Customer: " << car.customer << endl
	    << "Price:    " << car.price << endl
	    << "Purchased:"  << car.purchased.day << "/"
	    << car.purchased.month << "/"
	    << car.purchased.year << endl;
}
