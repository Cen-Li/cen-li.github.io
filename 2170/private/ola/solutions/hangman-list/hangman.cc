//Author: Nick Black
//Assignment: OLA 3
//Date: 10/20/2014
//Purpose: The purpose of this program is to play a game of hangman with the
//	   user.  To do so it selects a random word from a word bank which is
//	   provide in the file 'words.dat.'  This word is then put into a list
//	   object which which also serves to record the state of the game. The
//	   program will continue to play games of hangman with the user until
//	   the user specifies that they no longer wish to continue playing the
//   	   game.

#include<iostream>
#include<fstream>
#include<string>
#include<ctime>
#include<cstdlib>
#include"list.h"

using namespace std;

enum gamestate{NONE,PLATFORM,HEAD,BODY,LEFT_ARM,RIGHT_ARM,LEFT_LEG,RIGHT_LEG,HUNG};

void GetWords(ifstream&, string w[], int& num);
string PickWord(const string w[], int num);
List InsertTheWord(string rw);
void DisplayWord(List& hw, List& gl);
void PlayGame(List& hw, string rw);
bool CheckWin(List& hw);
ItemType GetGuess();
void CorrectGuess(List& hw, List& gl, ItemType& g, gamestate& s);
void DisplayState(gamestate s);

const int SIZE = 103;

int main()
{
	ifstream getdata;	//gets the data from the file.
	string words[SIZE];	//stores the words that are read from the file
	string randwd;		//the randomly picked word.
	int numwords;		//the number of words read.
	List hangword;		//the hangman word.
	char keepPlaying;	//store the result of prompting the user to keep playing.

	getdata.open("words.dat");

	GetWords(getdata, words, numwords);

	getdata.close();

	//Play the game while the user wishes to.
	do
	{
		randwd = PickWord(words, numwords);
		hangword = InsertTheWord(randwd);
		ItemType temp;
        //clrscr();
        cout << "\033[2J\033[1;1H";
		cout << "H A N G M A N" << endl;
		cout << "*************" << endl << endl;
		PlayGame(hangword, randwd);
		cout << "Would you like to continue playing the game? (y/n): ";
		cin >> keepPlaying;
	}while (keepPlaying != 'n');

	return 0;
}

//Extracts the words from the file words.dat
void GetWords(ifstream& getdata, string w[], int& num)
{
	int i = 0;
	getline(getdata,w[i]);
	while(getdata && i < SIZE)
	{
		i++;
		getline(getdata,w[i]);
	}
	num = i;
	return;
}

//selects a random word from the array of words.
string PickWord(const string w[], int num)
{
	int randindex;
	srand(time(0));

	randindex = rand()%num;

	return w[randindex];
}

//Insert the random word into a list and return it.
List InsertTheWord(string rw)
{
	List hw;
	ItemType temp;
	for (int i = 0; i < rw.length(); i++)
	{
		temp.value = rw[i];
		temp.show = false;
		hw.Insert(temp);
	}
	return hw;
}

//The game.  Collects guesses from the player and checks them against the
//hangword list.  Guesses are also checked against the guess list to make
//sure they are valid guesses. It also informs the winner if they have won
//or lost.
void PlayGame(List& hw, string rw)
{
	bool win = CheckWin(hw);	//store the result of checking to see
					//if the player has won.
	ItemType guess;			//the player's guess.
	gamestate state = NONE;		//the state of the game.
	List guesslist;			//list object containing player's guesses.

	DisplayWord(hw, guesslist);
	while(!win && (state != HUNG))
	{
		guess = GetGuess();
		CorrectGuess(hw, guesslist, guess, state);
		DisplayState(state);
        cout << "\033[2J\033[1;1H";
		DisplayWord(hw, guesslist);
		win = CheckWin(hw);
	}
	if (win)
	{
		cout << "Congratulations! You didn't get hung!" << endl;
	}
	else
	{
		cout <<"You were hung..." << endl;
		cout << "The word was: " << rw << endl;
	}
}

//Displays the list of guesses and the gameboard.
void DisplayWord(List& hw, List& gl)
{
	ItemType temp;
	if (gl.GetLength() != 0)
	{
		cout << "Guesses: ";
		for(int i = 0; i < gl.GetLength(); i++)
		{
			temp = gl.GetNextItem();
			cout << temp.value << " ";
		}
		gl.ResetList();
		cout << endl << endl;
	}

	for (int i = 0; i < 12 + (hw.GetLength()); i++)
	{
		cout << "=";
	}
	cout << endl;
	cout << "Game Board: ";

	for(int i = 0; i < hw.GetLength(); i++)
	{
		temp = hw.GetNextItem();
		if (temp.show)
		{
			cout << temp.value;
		}
		else
		{
			cout << '*';
		}
	}
	hw.ResetList();
	cout << endl;
	for (int i = 0; i < 12 + (hw.GetLength()); i++)
	{
		cout << "=";
	}
	cout << endl << endl;
}

//Collects a guess from the player and returns the lowercase version of the
//guess.
ItemType GetGuess()
{
	ItemType g;
	cout << "Please enter your guess: ";
	cin >> g.value;
	g.show = true;
	g.value = tolower(g.value);
	return g;
}

//Check the guess of the player against the list of previous guesses and the
//hangword list to see if a guess is correct.  The guess list is updated if
//the guess is new.  If the guess is correct the hangword list is updated.
void CorrectGuess(List& hw, List& gl, ItemType& g, gamestate& s)
{
	while ((g.value < 'a') || (g.value > 'z'))
	{
		cout << "Guess is not between a and z. ";
		g = GetGuess();
		cout << endl;
	}
	while (gl.IsThere(g))
	{
		cout << "Guess already entered. ";
		g = GetGuess();
		cout << endl;
	}
	gl.Insert(g);

	if (hw.IsThere(g))
	{
		hw.Modify(g);
		cout << "Correct! Keep guessing!" << endl << endl;
	}
	else
	{
		s = gamestate(s+1);
		cout << "Sorry. Bad Guess." << endl << endl;
	}
}

//Checks to see if player has one the game by checking the values of the
//various show variables in the list.
bool CheckWin(List& hw)
{
	ItemType temp;
	for (int i = 0; i < hw.GetLength(); i++)
	{
		temp = hw.GetNextItem();
		if (!temp.show)
		{
			hw.ResetList();
			return false;
		}
	}
	hw.ResetList();
	return true;
}

//Displays the state of the game, the "Hung" status of the player.
void DisplayState(gamestate s)
{
	gamestate state;	//loop variable.

	cout << "State of the Game: " << endl;

	//while less than the actually state of the game, display states.
	for (state = NONE; state <= s; state = gamestate(state+1))
	{
		switch (state)
		{
			case NONE: 	break;
			case PLATFORM:	cout << "PLATFORM" << endl;
					break;
			case HEAD:	cout << "HEAD" << endl;
					break;
			case BODY:	cout << "BODY" << endl;
					break;
			case LEFT_ARM:	cout << "LEFT_ARM" << endl;
					break;
			case RIGHT_ARM:	cout << "RIGHT_ARM" << endl;
					break;
			case LEFT_LEG:	cout << "LEFT_LEG" << endl;
					break;
			case RIGHT_LEG:	cout << "RIGHT_LEG" << endl;
					break;
			case HUNG:	cout << "HUNG" << endl;
					break;
			default:	break;
		}
	}
	cout << endl;
}
