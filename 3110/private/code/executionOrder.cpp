#include <iostream>
using namespace std;

class C1
{
public:
  C1 ();
	C1(int n);
	~C1();
protected:
  int *pi;
  int intNum;
};

C1::C1() {
  intNum = 10;
  cout << "C1 default constructor, ";
  cout << intNum << " integers are allocated" << endl;
	pi = new int [intNum];
  
}
C1::C1(int n) : intNum(n)
{
cout << intNum << " integers are allocated" << endl;
	pi = new int [intNum];
}

C1::~C1()
{	
  cout << intNum << "integers are released"<< endl;
	delete [] pi;
}

class C2 : public C1
{
public : 
  C2 ();
	C2(int n);
	~C2();
private:
	char *pc;
	int charNum=10;
};

C2::C2() : C1() {
  cout << "C2 default constructor, 10 characters allocated" << endl;
  pc = new char [charNum];
} 

C2::C2(int n) : C1(n), charNum (n)
{	
  cout << charNum << "characters are allocated."<< endl;
	pc = new char [charNum];
}

C2::~C2()
{	
  cout << charNum  << "characters are released"<< endl;
	delete [] pc;
}

int main ()
{
  cout << "First object " << endl;
	C2   exampleObj;

  cout << endl << endl;
  cout << "Second object " << endl;
	C2   array(30);

  cout << endl << endl << "objects exit the scope ... " << endl;
	return 0;
}
