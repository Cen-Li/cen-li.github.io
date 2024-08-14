#include "CardClass.h"
#include "PlayerClass.h"
#include <iostream>
#include <iomanip>
#include <cstdlib>
using namespace std;

const int MAX_ROUNDS = 13;			//Maximum rounds

//This function calls the member function to find lead
//Pre-Condition: player class array
//Post-Condition: returns the player's index who has 2 of club
int FindLead(PlayerClass p[]);

//This function plays the rounds
//Pre-Condition: player class array, game table,
//					and index of the player who's lead
//Post-Condition: plays the round
void PlayRound(PlayerClass p[], CardStruct t[], int & lead);

//This function displays a card's suit and value
//Pre-condition: one card in supplied
//Post-condition: supplied card's suit and value is printed
void DisplayCard(const CardStruct c);

//This function read the user's choice
//Pre-condition: User has >1 cards
//Post-condition: Plays the card of user's choice
//					if the choice matches with the leading suit
//					or user does not have card of leading suit
int GetChoice(PlayerClass user, CardSuitType s, int turn);

//This function find who has played the card of highest value of the round
//Pre-condition: table and score variable is supplied
//Post-condition: returns the index of player who has the highest value card
//					and returns the sum of the points by parameter
int FindCollector(const CardStruct t[], int & score, CardSuitType leadingSuit);

//This function prints each player's score
//Pre-condition: player class array is supplied
//Post-condition: scores of each player are printed
void DisplayScoreBoard(PlayerClass p[]);

//This function finds who won the game
//Pre-condition: player class array is supplied
//Post-condition: returns the index of player who has the lowest points
int FindWinner(PlayerClass p[]);

int main()
{
	int i;								//loop index
	int k;								//loop index
	int lead;							//who is leading
	int round=1;						//round
	int highVal=0;						//used for comparison
	int winner;							//holds winner's index
	
	int highValuePlayerIndex;			//Holds the player's index who has the highest value
	
	CardStruct table[MAX_PLAYERS];		//Current Card
	CardClass deckOfCards;				//deck is created
	PlayerClass players[MAX_PLAYERS];	//user and players
	
    srand(time(NULL));

    cout << "+++++++++++++++++++++++++++++" << endl;
    cout << "++                         ++" << endl;
    cout << "++     DEMO  DEMO   DEMO   ++" << endl;
    cout << "++                         ++" << endl;
    cout << "+++++++++++++++++++++++++++++" << endl;

	deckOfCards.ShuffleCards(); //shuffle the deck of cards
	
	//This for loop deals ONLY ONE card at a time
	//by repetitively calling the DealCard method of CardClass
	for(i=0; i<MAX_PLAYER_CARDS; i++)
	{
		for(k=0; k<MAX_PLAYERS; k++)
		{
			players[k].AddCard(deckOfCards.DealCards());
		}
	}
	
	//This for loop sorts each players cards
	for(i=0; i<MAX_PLAYERS; i++)
		players[i].SortCards();
	
	cout << "**********************************************" << endl;
	cout << "                    HEARTS                    " << endl;
	cout << "**********************************************" << endl;
	
	//Find who leads the first round
	lead = FindLead(players);
	
	cout << endl;
	
	//This while loop iterates 13 rounds
	while(round<=13)
	{
		cout << "ROUND " << round << endl;
		cout << "Your Cards" << endl;
		players[0].DisplayCards();
		
		PlayRound(players, table, lead);
		
		round++;
	}
	
	//Find winner
	winner = FindWinner(players);
	
	//prints the player who won the game
	if(winner==0)
		cout << "You won!" << endl;
	else
		cout << "Computer " << winner << " has won the game." << endl;
	
	return 0;
}

//This function calls the member function to find lead
int FindLead(PlayerClass p[])
{
	int i;						//loop index
	
	//This for loop check each players hand if he has a 2 of club
	for(i=0; i<MAX_PLAYERS; i++)
	{
		if(p[i].IsFirstLead())
		{
			if(i==0)
				cout << "You are the first lead." << endl;
			else
				cout << "Computer " << i << " is the first lead." << endl;
			return i;
		}
	}
}

//This function plays the rounds
void PlayRound(PlayerClass p[], CardStruct t[], int & lead)
{
	int i;					//loop index
	int choice;				//user's choice
	int roundScore;			//score of a round
	CardSuitType leadingSuit;	//leading suit
	
	//this switch statement prints "user" if the lead is 0
	//otherwise prints computer number
	switch(lead)
	{
		case 0:
			cout << "User";
			break;
		case 1:
		case 2:
		case 3:
			cout << "Computer " << lead;
			break;
	}
	cout << " is leading the round" << endl << endl;
	
	//This for loop lets the players to play a card
	for(i=0; i<MAX_PLAYERS; i++)
	{
		//if a player's hand is full
		//and if the player is leading,
		//then start the game by play 2 of club
		if(p[lead].GetCount() == 13 && i==0)
			t[lead] = p[lead].StartOneHand();
		
		//if computer is leading, then the computer plays a card
		else if(lead!=0 && i==0)
			t[lead] = p[lead].StartOneHand();
		
		//else if the user is leading, get a choice from the user
		//otherwise computer plays a card by following a leading suit
		else
		{
			switch(lead)
			{
				case 0:
					choice = GetChoice(p[lead], leadingSuit, i);
					t[lead] = p[lead].PlaySelectedCard(choice);
					break;
				case 1:
				case 2:
				case 3:
					t[lead] = p[lead].FollowOneCard(leadingSuit);
					break;
			}
		}
		
		//this switch statement prints "user" if the lead is 0
		//otherwise prints computer number
		switch(lead)
		{
			case 0:
				cout << "User: ";
				break;
			case 1:
			case 2:
			case 3:
				cout << "Computer " << lead << ": ";
				break;
		}
		
		//sets the leading suit played by the players who is leading the round
		if(i==0)
			leadingSuit = t[lead].suit;
		
		//Displays a card played by a current player
		DisplayCard(t[lead]);
		
		//Clockwise rotation
		lead=(lead+1)%4;
	}
	
	//Finds who has the highest value of a round
	//And assigns lead to who has the highest value
	lead=FindCollector(t, roundScore, leadingSuit);
	
	cout << endl;
	
	//this switch statement prints "user" if the lead is 0
	//otherwise prints computer number
	switch(lead)
	{
		case 0:
			cout << "User";
			break;
		case 1:
		case 2:
		case 3:
			cout << "Computer " << lead;
			break;
	}
	
	cout << " gets " << roundScore << " points." << endl << endl;
	
	//Adds current round's score to the player who had the highest value
	p[lead].AddScore(roundScore);
	
	//Prints the score board
	DisplayScoreBoard(p);
	cout << endl;
}

//This function prints one card's suit and value
void DisplayCard(const CardStruct c)
{
	//using enum type switch statement
	switch(c.suit)
	{
		case DIAMOND:
			if(c.value==14)
				cout << "Ace";
			else if(c.value==13)
				cout << "King";
			else if(c.value==12)
				cout << "Queen";
			else if(c.value==11)
				cout << "Jack";
			else
				cout << c.value;
			cout << " of Diamond" << endl;
			break;
			
		case CLUB:
			if(c.value==14)
				cout << "Ace";
			else if(c.value==13)
				cout << "King";
			else if(c.value==12)
				cout << "Queen";
			else if(c.value==11)
				cout << "Jack";
			else
				cout << c.value;
			cout << " of Club" << endl;
			break;
			
		case HEART:
			if(c.value==14)
				cout << "Ace";
			else if(c.value==13)
				cout << "King";
			else if(c.value==12)
				cout << "Queen";
			else if(c.value==11)
				cout << "Jack";
			else
				cout << c.value;
			cout << " of Heart" << endl;
			break;
			
		case SPADE:
			if(c.value==14)
				cout << "Ace";
			else if(c.value==13)
				cout << "King";
			else if(c.value==12)
				cout << "Queen";
			else if(c.value==11)
				cout << "Jack";
			else
				cout << c.value;
			cout << " of Spade" << endl;
			break;
	}
}

//This function read the user's choice
int GetChoice(PlayerClass user, CardSuitType s, int turn)
{
	bool validChoice=false;		//is a choice valid?
	int choice;
	
    int currentLength = user.GetCount();

	//if the user is leading the round
	//get a choice from the user
	if(turn==0)
	{
        do
        {
		    cout << "Please enter the card number you want to play: ";
		    cin >> choice;
        }
        while ( choice<1 || choice > currentLength);
		return choice;
	}
	
	//if the user is playing after the lead,
	//then get a choice and check if it is a valid choice
	else
	{
		cout << endl;
		cout << "Leading suit: ";
		
		//enum type switch statement
		switch(s)
		{
			case DIAMOND: cout << "Diamond" << endl; break;
			case CLUB: cout << "Club" << endl; break;
			case HEART: cout << "Heart" << endl; break;
			case SPADE: cout << "Spade" << endl; break;
		}
		
		//get user's choice until it is valid
		while(!validChoice)
		{
            char answer[20];
            do 
            {
			    cout << "Please enter the card number you want to play: ";
			    cin >> answer;
            } while (!isdigit(answer[0]));
            choice = atoi(answer);
							
			if(user.IsValidChoice(s, choice))
			{
				validChoice = true;
				return choice;
			}
			else
				cout << "Not a valid choice." << endl;
		}
	}
}

//This function find who has played the card of highest value of the round
int FindCollector(const CardStruct t[], int & score, CardSuitType leadingSuit)
{
	int hiVal=0;			//holds highest value
	int hiValPlayer=0;		//holds the index of player 
							//who has the highest value
	int i;					//loop index
	
	score = 0;

	//This for loop sums all of the points
	//and then finds who has playeed the card of highest value fo the round
	for(i=0; i<MAX_PLAYERS; i++)
	{
		score = score + t[i].points;
		
		if((t[i].value > hiVal) && (t[i].suit == leadingSuit))
		{
			hiVal=t[i].value;
   			hiValPlayer=i;
		}
	}
	
	return hiValPlayer;
}

//This function prints each player's score
void DisplayScoreBoard(PlayerClass p[])
{
	int i;
	
	cout << "-----Score Board-----" << endl;
	
	//This for loop prints each player's score
	for(i=0; i<MAX_PLAYERS; i++)
	{
		if(i==0)
			cout << "User: ";
		else
			cout << "Computer " << i << ": ";
		cout << p[i].GetScore() << " points" << endl;
	}
}

//This function finds who won the game
int FindWinner(PlayerClass p[])
{
	int i;							//loop index
	int winner=0;					//hold the winner's index
	int temp = p[0].GetScore();		//temporary integer variable
	
	
	//This for loop finds who has the lowest points
	for(i=0; i<MAX_PLAYERS; i++)
	{
		if(p[i].GetScore() < temp)
		{
			temp = p[i].GetScore();
			winner = i;
		}
	}
	
	return winner;
}
