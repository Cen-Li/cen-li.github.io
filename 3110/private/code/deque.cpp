#include <cstring>
#include <string>
#include <deque>
#include <iostream>
#include <algorithm>
using namespace std;

void print( deque<string> );

void example1();

void example2();

int main( void )
{
    cout << "Example1 .................." << endl;
    example1();
    cout << "End of Example1........................." << endl;
    cout << endl << endl;
    
    cout << "Example2 ..............................." << endl;
    example2();
    cout << "End of Example2........................." << endl;

    return 0;
}    
void example1()
{
  deque<char> dequeObject1;
  char str[] = "Using a deque.";
  int i;

  for(i = 0; i<strlen(str); i++) 
  {
    dequeObject1.push_front(str[i]);
    dequeObject1.push_back(str[i]);
  }

  cout << "Original dequeObject1:\n";
  for(i = 0; i <dequeObject1.size(); i++)
    cout << dequeObject1[i];
  cout << "\n\n";

  for(i = 0; i <strlen(str); i++) 
     dequeObject1.pop_front();
  cout << "dequeObject1 after popping front:\n";
  for(i = 0; i <dequeObject1.size(); i++)
    cout << dequeObject1[i];
  cout << "\n\n";

  deque<char> dequeObject2(dequeObject1); 
  cout << "dequeObject2 original contents:\n";
  for(i = 0; i <dequeObject2.size(); i++)
    cout << dequeObject2[i];
  cout << "\n\n";

  for(i = 0; i <dequeObject2.size(); i++)
     dequeObject2[i] = dequeObject2[i]+1;
  
  cout << "dequeObject2 transposed contents:\n";
  for(i = 0; i <dequeObject2.size(); i++)
    cout << dequeObject2[i];
  cout << "\n\n";

  deque<char>::iterator p = dequeObject1.begin();
  while(p != dequeObject1.end()) {
    if(*p == 'a') break;
       p++;
  }

  dequeObject1.insert(p, dequeObject2.begin(), dequeObject2.end());

  cout << "dequeObject1 after insertion:\n";
  for(i = 0; i <dequeObject1.size(); i++)
    cout << dequeObject1[i];
  cout << "\n\n";

  return;
}


void example2()
{
    deque<string> dequeObject;                                                  

    dequeObject.push_back( "yak" );                                             
    dequeObject.push_back( "zebra" );                                               
    dequeObject.push_front( "cat" );                                            
    dequeObject.push_front( "canary" );                                         

    print(dequeObject);

    dequeObject.pop_front();                                                    
    dequeObject.pop_back();                                                     

    print(dequeObject);

    //list operations on a deque:
    dequeObject.erase(find( dequeObject.begin(), dequeObject.end(), "cat" ));           
    print(dequeObject);

    dequeObject.insert( dequeObject.begin(), "canary" );                            
    print(dequeObject);

    int sz = dequeObject.size();      
    dequeObject.resize( 5 );          
    dequeObject[sz] = "fox";          
    dequeObject[sz+1] = "elephant";   
    dequeObject[sz+2] = "cat";        
    print( dequeObject );             

    dequeObject.erase( dequeObject.begin() + 2 ); 
    print( dequeObject );             

    //sorting a deque. sort function is defined in STL
    sort( dequeObject.begin(), dequeObject.end() );                                 
    print( dequeObject );           

    return;
}

void print( deque<string> d ) {

    deque<string>::const_iterator iter;                 

    cout << "The number of items in the deque:" << d.size() << endl; 
    for ( iter = d.begin(); iter != d.end(); iter++ )
         cout << *iter << " ";
    cout << endl << endl;
}
