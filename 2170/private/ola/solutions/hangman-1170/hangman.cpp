//// PROGRAMMER:    Solution
// Assignment:      Open Lab Assignment 1
// Class:           CSCI 2170-003
// Course Instructor: Dr. Cen Li
// Due Date:        Wednesday, 2/2/2011
// Description:     This program plays the game hangman
//                  Input is in the form of data file and it contains
//                  and it contains the word bank.
//                  Program output is the record of the game play.

#include<iostream>
#include<fstream>
#include<cassert>
#include<cstdlib>
#include<string.h>
using namespace std;

const int MAX_NUM_OF_WORDS = 200;       //maximum number of words
const int MAX_WORD_SIZE = 80;           //maximum size of a word
enum Hung_Status {PLATFORM=1, HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG,HUNG};

void DisplayHung(int value);
//Function Read_Text to read the words from a file into the words[][] array
void ReadText(ifstream &, char[][MAX_WORD_SIZE], int&);
//This function randomly select one word from the list
void SelectWord(char[][MAX_WORD_SIZE], char[MAX_WORD_SIZE], int );
//This function plays the game, input is the randomly selected word
void PlayGame(char[]);
//This function prompts the player for a guess
char GetGuess();
//This function looks to see if the player has made a duplicate guess
bool DupGuess(char, bool[]);
//This function displays the player's guesses so far.
bool CorrectGuess(char[], char[], char);
//This function displays the content of the word.
void DisplayWord(const char[]);
//This function displays the player's guesses so far.
void DisplayGuesses(const bool[]);
//This function determines whether or not the player has won the gam
bool CheckWon(const char[], const char[]);

int main()
{
   // declare 2 -dimensional array for the words in the data file
   char words[MAX_NUM_OF_WORDS][MAX_WORD_SIZE];

   int  numOfWords;                     // counts the number of words
   char selectedWord[MAX_WORD_SIZE];    // holds the randomly selected word
   char again;                          // gets y/n depending if the player wants to play again

   // open external file
   ifstream infile;
   infile.open("words.dat");

   assert(infile);

   ReadText(infile, words, numOfWords);

   // close external file
   infile.close();

   //This do-while loop executes the game at least once
   //and then plays again if the player's answer is y(es).
   do
   {
       SelectWord(words, selectedWord, numOfWords);
       PlayGame(selectedWord);
       cout << "Would you like to play again? (y/n)" << endl;
       cin >> again;
       cout << endl;
   }while(again=='y');

   return 0;
}

//Function Read_Text to read the words from a file into the words[][] array
void ReadText(ifstream & infile,
               char words[][MAX_WORD_SIZE],
               int& numOfLines)
{
   int position;        //position

   numOfLines = 0;

   //This while loop reads the words from a data file
   while(infile.peek() != EOF)
   {
      position = 0;
      while((infile.peek() != '\n') && (infile.peek() != EOF))
      {
         infile.get(words[numOfLines][position++]);
      }
      infile.ignore(100, '\n');
      words[numOfLines][position]='\0';
      numOfLines++;
   }
}

//This function randomly select one word from the list
void SelectWord(char words[][MAX_WORD_SIZE], char selectedWord[], int numOfWords)
{
    int randomChoice;       //holds the random number

    srand(time(0));
    randomChoice = rand() % numOfWords;

    strcpy(selectedWord, words[randomChoice]);
}

//This function plays the game, input is the randomly selected word
void PlayGame(char selectedWord[])
{
    bool win=false;             //stores the value true(has won) or false(has not won yet)
    int badGuess=0;             //bad guess counter
    char guess;                 //char variable stores a player's guess
    bool alphabets[26]={false}; //boolean array for checking the duplicate guess
    int i;                      //for loop initializer
    //char array stores the player's game board
    char gameBoard[MAX_WORD_SIZE];

    cout << "H A N G M A N" << endl << "-------------" << endl << endl;
    for(i=0; i<strlen(selectedWord); i++)
         gameBoard[i]='*';


    //This while loop gets the guess, check if the guess is correct or not.
    //loop continues as long as the player has not lost or win
    while(!win && badGuess<8)
    {
        //This for loop displays the content of the game board
        //after each guess.
        cout << "===================="<<endl;
        cout << "Game Board:  ";
        for(i=0; i<strlen(selectedWord); i++)
            cout << gameBoard[i] << " ";
        cout <<endl<< "===================="<<endl;
        
        guess=GetGuess();

        //This while loop prints the error message if the guess is duplicated
        while(DupGuess(guess, alphabets))
        {
            cerr << "You have already guessed that letter. Please try another." << endl << endl;
            guess=GetGuess();
        }

        //This conditional statements checks if the guess is correct or not
        if(CorrectGuess(gameBoard, selectedWord, guess))
        {
            for(i=0; i<strlen(selectedWord); i++)
            {
                cout << gameBoard[i] << " ";
            }
            cout << endl << endl;
            cout << "Good Guess! KeepGoing" << endl;
        }
        else
        {
            badGuess++;
            DisplayHung(badGuess);
        }
        DisplayGuesses(alphabets);
        win=CheckWon(selectedWord, gameBoard);
    }

    //This branch checks and prints either the player has won or lsot
    if(win)
    {
        cout << "Congratulations! You won." << endl;
    }
    else
    {
        cout << "Sorry, you lose." << endl << "The word was "; 
        DisplayWord(selectedWord);
        cout << "." << endl;
    }
}

void DisplayHung(int value)
{
    if (value>=HUNG)      cout << "HUNG" << endl;
    if (value>=RIGHT_LEG) cout << "RIGHT_LEG" << endl;
    if (value>=LEFT_LEG)  cout << "LEFT_LEG" << endl;
    if (value>=RIGHT_ARM) cout << "RIGHT_ARM" << endl;
    if (value>=LEFT_ARM)  cout << "LEFT_ARM" << endl;
    if (value>=BODY)     cout << "BODY" << endl;
    if (value>=HEAD)     cout << "HEAD" << endl;
    if (value>=PLATFORM) cout << "PLATFORM" << endl;
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

//This function looks to see if the player has made a duplicate guess
bool DupGuess(char guess, bool alphabets[])
{
    //if the array element is true, then it is a duplicate guess
    if(alphabets[guess-'a'])
        return true;
    //if the array element is false, then it is a valid guess
    else
    {
        alphabets[guess-'a']=true;
        return false;
    }
}

//This function checks whether the player's guess is correct
bool CorrectGuess(char gameBoard[], char selectedWord[], char guessedLetter)
{
    int index;          //for loop initializer
    bool check=false;   //stores the value true(correct) or false(incorrect)

    //This for loop checks if the guessed letter is correct or not
    //boolean variable is to check if there are two or more guess letters
    //in the word
    for(index=0; index<strlen(selectedWord); index++)
    {
        //Find if any element matches the guess letter
        if(selectedWord[index]==guessedLetter)
        {
            gameBoard[index]=guessedLetter;
            check=true;
        }
    }

    //if check is true, it means the guess is correct
    if(check)
        return true;
    else
        return false;
}

//This function displays the content of the word.
void DisplayWord(const char word[])
{
    int i;          //for loop initializer

    //This for loop prints the elements in the word
    for(i=0; i<strlen(word); i++)
        cout << word[i];
}

//This function displays the player's guesses so far.
void DisplayGuesses(const bool letters[])
{
    int i;          //for loop initializer
    char letter;    //stores the guessed letter

    cout << "Letters guessed so far" << endl;

    //This for loop checks and prints the guessed letters so far
    for(i=0; i<26; i++)
    {
        //if the letter has been guessed, then it prints that letter
        if(letters[i])
        {
            letter=i+'a';
            cout << letter << " ";
        }
    }

    cout << endl << endl;
}

//This function determines whether or not the player has won the game
bool CheckWon(const char word[], const char board[])
{
    int i;      //for loop initializer

    //This for loop checks if every elements in the selected word and
    //the player's game board matches
    //If every elements match, then the player has won.
    for(i=0; i<strlen(word); i++)
    {
        //if at least one element does not match, then the player has not won yet.
        if(word[i]!=board[i])
            return false;
    }
    return true;
}
