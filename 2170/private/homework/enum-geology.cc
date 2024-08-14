// Homework 3 problem: enum type practice

#include <iostream>
#include <string>
using namespace std;

enum Period {NEOGENE, PALEOGENE, CRETACEOUS, JURASSIC, TRIASSIC, PERMIAN, CARBONIFEROUS, DEVONIAN, SILURIAN, ORDOVICIAN, CAMBRIAN, PRECAMBRIAN};

string GetString(Period p);
Period FindP(int allP[], int size, int toFind);

int main()
{
    int start, finish;
    Period sPeriod, ePeriod;
    char  playAgain='y';

    int allP[12]={23, 65, 136, 192, 225, 280, 345, 395, 435, 500, 570, 45000};

    while (playAgain=='y' || playAgain =='Y')
    {
        do 
        {
            cout << "Enter a range of prehistoric dates (in millions of years), I will tell you the list of periods included in the range." << endl;
		    cout << "start and finish date need to be >= 23, for example 55  300: " << endl;
            cin >> start >> finish;
        }
        while (start < 23 || finish < 23);
        
        sPeriod = FindP(allP, 12, start);
        ePeriod = FindP(allP, 12, finish);
cout << sPeriod << "\t" << ePeriod << endl;
    
        if (sPeriod >= 0)
        {
    	    cout << endl << "The list of periods are: " << endl;
    	    for (Period p=sPeriod; p<=ePeriod; p = (Period)(p+1))
 			    cout << GetString(p) << endl;
        }

        cout << endl << endl;
        cout << "Would you like to try again? (y/n): " << endl;
        cin >> playAgain; 
    }

	return 0;
}

Period FindP(int allP[], int size, int toFind)
{
     for (int i=0; i<size; i++)
 		 if (allP[i] > toFind)
            return Period(i-1);

     return Period(11);
}


string GetString(Period p)
{
    switch (p)
    {
       case NEOGENE: return "Neogene";
       case PALEOGENE: return "Paleonene";
       case CRETACEOUS: return "Cretaceous";
       case JURASSIC: return "Jurassic";
       case TRIASSIC: return "Triassic";
       case PERMIAN: return "Permian";
       case CARBONIFEROUS: return "Carboniferous";
       case DEVONIAN: return "Devonian";
       case SILURIAN: return "Silurian";
       case ORDOVICIAN: return "Ordovician";
       case CAMBRIAN: return "Cambrian";
       case PRECAMBRIAN: return "PreCambrian";
   }
}
