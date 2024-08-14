#include "phone.cpp"

int main()
{
  phoneclass P1;
  phoneclass P2;
  
  cin >> P1;
  cout << "P1 is " << endl;
  cout << P1;
  cout << endl;

  cin >> P2;
  cout << "P2 is " << endl;
  cout << P2;
  cout << endl;

  phoneclass P3(P2);
  if ((P2 > P3)||(P2 < P3))
  {
    cerr << "Error !" << endl;
    exit(-1);
  }
  else
  {
     cout << "P2 is the same as P3 as" << endl;
     cout << P3;
  }

  cout << "print out the two persons in order" << endl;
  if (P1 < P2)
  {
     cout << P1 << endl;
     cout << P2 << endl;
  }
  else
  {
     cout << P2 << endl;
     cout << P1 << endl;
  }
}

