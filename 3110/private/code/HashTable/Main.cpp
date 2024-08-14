#include <iostream>
#include <string>
#include <ctime>

#include "HashFunction.cpp"
#include "HashTable.cpp"
#include "IntType.h"
#include "Student.h"


string generateName( void );
string generatePhoneNO( void );

const int   IntHashTableSize = 47;
const int   IntHashTableValueNum = 20;

const int   StrHashTableSize = 17;
const int   StrHashTableValueNum = 20;

int main( void )
{
	//Initialize randomArray data
	srand((unsigned)time(0));					// seed random generator

    cout << "***********************First Example********************************" << endl;
    // create a hash table for integers with int as the key type
    HashTable< IntType,int,IntHashTableSize,HashFunction<IntHashTableSize> > intHashTable;

    // insert random integers into the hash table
    for ( int i=0; i<IntHashTableValueNum; i++ )
    {
        IntType item(rand());
        intHashTable.insert( item );
    }
    // output all data in the hashtable.
    intHashTable.print(cout);
  
    cout << endl
         << "***********************Second Example********************************" << endl;
    
    // create a hash table for Students with string as the key type
    HashTable<Student, string, StrHashTableSize, HashFunction<StrHashTableSize> > strHashTable;

    // insert random Student objects into the hash table
    for ( int i=0; i<StrHashTableValueNum; i++ )
    {
        strHashTable.insert( Student(generateName(), generatePhoneNO()) );
    }
    // output all data in the hashtable. 
    strHashTable.print(cout);

    return 0;
}

//Generate a random name with length 3-12
string generateName( void )
{
    int nameLen = rand() % 9 + 3;
    string name;

    for ( int i=0; i<nameLen; i++ )
        name += char(rand() % ('z' - 'a' + 1) + 'a');
    return name;
}

// Generate a random 7-digits phone number
string generatePhoneNO( void )
{
    const int digitNum = 7;
    string phoneNO;

    // First digit cannot be 0
    phoneNO = char(rand()%9 + 1 + '0');

    for ( int i=0; i<digitNum-1; i++ )
        phoneNO += char( rand()%10 + '0' );
    return phoneNO;
}