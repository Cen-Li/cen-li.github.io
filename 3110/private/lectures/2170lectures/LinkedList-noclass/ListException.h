#include <exception>
#include <string>
using namespace std;

class ListException: public exception
{
public:
   ListException(const string & message = "")
          : exception(message.c_str())
   { }
}; // end ListException