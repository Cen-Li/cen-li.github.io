#include<iostream>
#include<fstream>
#include<cassert>
using namespace std;

const int MAX_NUM_OF_WORDS = 200;
const int MAX_WORD_SIZE = 80;

void ReadText(ifstream &, char[][MAX_WORD_SIZE], int&);

int main()
{
   // declare 2 -dimensional array for the words in the data file
   char words[MAX_NUM_OF_WORDS][MAX_WORD_SIZE];
   int  numOfWords;   // counts the number of words
  
   // open external file
   ifstream infile;
   infile.open("words.dat");

   assert(infile);

   ReadText(infile, words, numOfWords);

   // close external file
   infile.close();
 
   cout << "There are " << numOfWords << " words read." << endl;
   cout << "They are : " << endl;
   for (int i=0; i<numOfWords; i++)
     cout << words[i] << endl;

   return 0;
}

//Function Read_Text to read the words from a file into the words[][] array
void ReadText(ifstream & infile, 
               char words[][MAX_WORD_SIZE], 
               int& numOfLines)
{
   int position;
  
   numOfLines = 0;
   while(infile.peek() != EOF)
   {
      position = 0;
      while((infile.peek() != '\n')&& (infile.peek() != EOF))
      {
         infile.get(words[numOfLines][position++]);
      }
      infile.ignore(100, '\n');
      words[numOfLines][position]='\0';
      numOfLines++;
   }
}

