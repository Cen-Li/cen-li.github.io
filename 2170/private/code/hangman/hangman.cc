//// PROGRAMMER:    Solution
// Class:           CSCI 2170
// Course Instructor: Dr. Cen Li
// Due Date:        Wednesday, 2/2/2011
// Description:     This program plays the game hangman
//                  Input is in the form of data file and it contains
//                  and it contains the word bank.
//                  Program output is the record of the game play.

#include<iostream>
#include<fstream>
#include "list.h"

#include<cassert>
#include<cstdlib>
#include<string>
#include<iostream>
using namespace std;

enum HungType {PLATFORM, HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG, HUNG};

const int MAX_NUM_OF_WORDS = 200;       //maximum number of words

void Display(int n);
//This function plays the game, input is the randomly selected word
void PlayGame(string word);

//This function prompts the player for a guess
char GetGuess();

//This function displays the player's guesses so far.
bool CorrectGuess(List& word, char oneGuess);

//This function displays the content of the word.
void DisplayWord(List word);

//This function displays the player's guesses so far.
void DisplayGuesses(List guesses);

//This function determines whether or not the player has won the game
bool CheckWon(List word);

//This function determines the hung status of the game
void DisplayHung(int h);  

int main()
{
   string wordBank[MAX_NUM_OF_WORDS];
   int numOfWords=0;

   string selectedWord;    // holds the randomly selected word
   char again;       // gets y/n depending if the player wants to play again

   srand(time(0));

   // open external file
   ifstream infile;
   infile.open("words.dat");

   assert(infile);

   //This while loop reads the words from a data file
   while(numOfWords < MAX_NUM_OF_WORDS && infile >> wordBank[numOfWords++]);

   // close external file
   infile.close();

   //This do-while loop executes the game at least once
   //and then plays again if the player's answer is y(es).
   do
   {
       selectedWord = wordBank[rand() % numOfWords];
       PlayGame(selectedWord);

       cout << "Would you like to play again? (y/n)" << endl;
       cin >> again;
       cout << endl;

   }while(again=='y');

   return 0;
}

//This function plays the game, input is the randomly selected word
void PlayGame(string gameWord)
{
    bool win=false;             //stores the value true(has won) or false(has not won yet)
    int badGuess=0;             //bad guess counter
    char guess;                 //char variable stores a player's guess
    int i;                      //for loop initializer
   
    List  guesses;        // guesses is initialized to empty
    List  word;           // word is to be initialized with the game word

    cout << "H A N G M A N" << endl << "-------------" << endl;

    // initialize words
    int length = gameWord.length();
    for (int i=0; i<length; i++)
    {
        ItemType newItem;
        newItem.value = gameWord[i];
        newItem.show = false;

        word.Insert(newItem);
    }
    
    //This while loop gets the guess, check if the guess is correct or not.
    //loop continues as long as the player has not lost or win
    while(!win && badGuess<8)
    {
        cout << "============";
        Display(gameWord.length());
        cout << endl;
        cout << "Game board: ";
        DisplayWord(word);   // display the gameboard
        cout << "============";
        Display(gameWord.length());
        cout  << endl << endl;
 
        guess=GetGuess();    

        //This while loop prints the error message if the guess is duplicated
        ItemType newItem;
        newItem.value = guess;
        newItem.show = false;

        while(guesses.IsThere(newItem))
        {
            cerr << "You have already guessed that letter. Please try another." << endl << endl;
            guess=GetGuess();
            newItem.value = guess;
            newItem.show = false;
        }
        guesses.Insert(newItem);

        //This conditional statements checks if the guess is correct or not
        if(CorrectGuess(word, guess))
        {
            cout << "Good Guess! KeepGoing" << endl;
        }
        else
        {
            cout << "Sorry, bad guess!";
            DisplayHung(badGuess);
            badGuess++;
        }

        DisplayGuesses(guesses);
        win=CheckWon(word);
    }

    //This branch checks and prints either the player has won or lsot
    if(win)
    {
        cout << "Congratulations! You won." << endl;
    }
    else
    {
        cout << "Sorry, you lose." << endl << "The word is: " << gameWord << endl;
    }
}

//This function prompts the player for a guess
char GetGuess()
{
    char input;         //stores the player's guess

    cout << "You may guess any letter from a to z." << endl;
    cout << "Please enter your guess: ";
    cin >> input;
    cout << endl;

    //This while loop checks if the guess is a lower-case letter
    while(!((input>='a' && input<='z') || (input>='A' && input<='Z')))
    {
        cerr << "Your guess is invalid. Please try another." << endl;
        cout << "Please enter your guess: ";
        cin >> input;
	input = tolower(input);
    }

    return input;
}


//This function checks whether the player's guess is correct
bool CorrectGuess(List& word, char guessedLetter)
{
    ItemType newItem;
    newItem.value = guessedLetter;
    newItem.show = true;
    bool correct = false;

    if (word.IsThere(newItem))
    {
        word.Modify(newItem);
        correct = true;
    }
    
    return correct;
}

//This function displays the content of the word.
void DisplayWord(List word)
{
    int length=word.GetLength();
    word.ResetList();

    for(int i=0; i<length; i++)
    {
        ItemType item=word.GetNextItem();
        if (item.show)
           cout << item.value;
        else
           cout << '*';
    }
    cout << endl;
}

//This function displays the player's guesses so far.
void DisplayGuesses(List guesses)
{
    guesses.ResetList();

    cout << "You have guessed these letter: " << endl;
    while (guesses.HasNext())
    {
       ItemType item=guesses.GetNextItem();
       cout << item.value << " ";
    }
    cout << endl << endl;
}


//This function determines whether or not the player has won the game
bool CheckWon(List word)
{
    int length=word.GetLength();      //for loop initializer
    word.ResetList();

    for(int i=0; i<length; i++)
    {
        ItemType item = word.GetNextItem();
        if (!item.show)
            return false;
    }
    return true;
}

void DisplayHung(int h)
{
    cout << "Hung Status: " << endl;
    for (int i=0; i<=h; i++)
    {
    	switch (HungType(i))
    	{
    	    case PLATFORM:  cout << "PLATFORM" << endl; break;
    	    case HEAD:      cout << "HEAD" << endl; break;
    	    case BODY:      cout << "BODY" << endl; break;
    	    case LEFT_ARM:  cout << "LEFT_ARM" << endl; break;
    	    case RIGHT_ARM: cout << "RIGHT_ARM" << endl; break;
    	    case LEFT_LEG:  cout << "LEFT_LEG" << endl; break;
    	    case RIGHT_LEG: cout << "RIGHT_LEG" << endl; break;
    	    case HUNG:      cout << "HUNG" << endl; break;
    	}
    }
    cout << endl;
}

void Display(int count)
{
    for (int i=0; i<=count; i++)  cout << "=";
}
