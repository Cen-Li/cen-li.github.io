// Program Dinner prints out a dinner menu
#include <iostream>
#include <string>
using namespace std;

const string SALAD = "Green Salad";
const string MEAT = "Chicken Marsala";
const string VEGGIE = "Carrots with lemon butter";
const string STARCH = "Mashed potatoes";
const string DESSERT = "Apple pie";

int main ()
{
  string mainCourse;

  cout  << "First course: "  << SALAD  << endl;
  mainCourse = MEAT + "with" + VEGGIE + "and" 
        + STARCH;
  cout  << "Main course: "  << mainCourse  << endl;
  cout  << "Dessert: "  << DESSERT << endl;
  return 0;
}

