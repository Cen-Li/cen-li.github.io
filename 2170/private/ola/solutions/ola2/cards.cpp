// Due Date:        Soft Copy: Midnight, Sunday, 2/13/2011
//                  Hard Copy: Monday, 2/14/2011
// Description:     This program creats and shuffles a deck of cards,
//                  and then it deal the cards to each of the four players
//                  one at a time.
//                  After all cards are dealt to the players, the program
//                  organizes the cards in each player's hand by sorting
//                  their cards by suit.
//                  Then the program will display each player's cards.

#include <iostream>
#include <string>
#include <cstdlib>
#include <iomanip>
using namespace std;

const int MAX_DECK_SIZE = 52;           //size of the deck
const int MAX_SUIT = 4;                 //number of suits in the deck
const int MAX_CARDS_PER_SUIT = 13;      //number of cards per suit
const int MAX_PLAYERS = 4;              //number of players
const int MAX_CARDS_PER_PLAYER = 13;    //number of cards per player


//define enum type CardSuitType
enum CardSuitType { DIAMOND, CLUB, HEART, SPADE };

//define card struct
struct card{
    CardSuitType suit;
    int value;
    int points;
};

//This function creates the deck of cards
void FormCards(card deck[]);

//This function shuffles the cards into random order
void ShuffleCards(card deck[]);

//This function deals out shuffled cards to the players
void DealCards(card deck[], card table[][MAX_CARDS_PER_PLAYER]);

//This function sorts one player's cards by suit
void SortCards(card playersCards[]);

//This function prints the cards of one player in sorted order
void PrintCards(const card playersCards[], const int playerNum);

//This function swaps the two elements
void Swap(card & a, card & b);

//This cards searches for 2 of CLUB in one’s hand. 
// It returns the index of the card in the hand if it is found, 
// or -1 if the card is not found
int LinearSearch(card playersCards[], int size);

int main()
{
    int i;                                          //loop index
    int k;                                          //loop index
    card deck[MAX_DECK_SIZE];                       //deck of cards: array of the structs 'card'
    card table[MAX_PLAYERS][MAX_CARDS_PER_PLAYER];  //players and cards per each player

    srand(time(0)); //prevents the rand() from generating same number

    cout << endl;
    cout << "++++++++++++++++++++" << endl;
    cout << "+++   DEMO ONLY  +++" << endl;
    cout << "++++++++++++++++++++" << endl;
    cout << endl;

    FormCards(deck);                                //Call function FormCards

    ShuffleCards(deck);                             //Call function ShuffleCards
    DealCards(deck, table);                         //Call function DealCards

    for(i=0; i<MAX_PLAYERS; i++)                    //This for loop calls the function
        SortCards(table[i]);                        //SortCards 'number of players' times
    for(i=0; i<MAX_PLAYERS; i++)                    //This for loop calls the function
        PrintCards(table[i], i+1);                  //PrintsCards 'number of players' times

    for (i=0; i<MAX_PLAYERS; i++)
    {
        int index=LinearSearch(table[i], MAX_CARDS_PER_PLAYER);
        if (index >= 0)
        {
			cout << "Player " << i+1 << " has the card 2 of CLUB." << endl;
			break;
		}
    }

    return 0;
}

//This function creates the deck of cards
void FormCards(card deck[])
{
    int i, k;           //loop index
    int index=0;        //used for assigning points and values in nested for loop

    //This for loop assigns suit
    //13 cards per suit
    for(i=0; i<MAX_DECK_SIZE; i++)
    {
        if(i<13)
            deck[i].suit=DIAMOND;
        else if(i<26)
            deck[i].suit=CLUB;
        else if(i<39)
            deck[i].suit=HEART;
        else
            deck[i].suit=SPADE;
    }

    //This nested for loop assigns values and points
    for(i=0; i<MAX_SUIT; i++)
    {
        for(k=0; k<MAX_CARDS_PER_SUIT; k++)
        {
            //assign values
            deck[index].value=k+1;

            //assign points
            //HEART cards less than 10 has a point of 5
            //HEART cards of J, Q, K have points of 10
            if(deck[index].suit==HEART)
            {
                if(deck[index].value>=10)
                    deck[index].points=10;
                else
                    deck[index].points=5;
            }
            //Queen of SPADE has a point of 100
            else if(deck[index].suit==SPADE && deck[index].value==12)
                deck[index].points=100;
            //Jack of CLUB has a point of -100
            else if(deck[index].suit==CLUB && deck[index].value==11)
                deck[index].points=-100;
            //rest of the cards have 0 point
            else
                deck[index].points=0;
            index++;                    //increase index by 1
        }
    }
}

//This function shuffles the cards into random order
void ShuffleCards(card deck[])
{
    int i;          //loop index
    int randNum;    //stores the random number
    card temp;      //to use in swap


    //This for loop shuffles the cards into random order
    for(i=0; i<MAX_DECK_SIZE; i++)
    {
        randNum = rand() % MAX_DECK_SIZE;
        temp=deck[i];
        deck[i]=deck[randNum];
        deck[randNum]=temp;
    }
}

//This function deals out shuffled cards to the players
void DealCards(card deck[], card table[][MAX_CARDS_PER_PLAYER])
{
    int i,k;        //loop index
    int index=0;    //used for assigning

    //This for loop deals the cards to the players
    for(i=0; i<MAX_PLAYERS; i++)
    {
        for(k=0; k<MAX_CARDS_PER_PLAYER; k++)
        {
            table[i][k]=deck[index];
            index++;
        }
    }
}

//This function sorts one player's cards by suit
void SortCards(card playersCards[])
{
    //bubble sort
    bool sorted=false;                  //is the list sorted?
    int last=MAX_CARDS_PER_PLAYER-1;    //start last at the last array element
    int i;                              //loop index

    while(!sorted)
    {
        sorted=true;
        for(i=0; i<last; i++)
        {
            if((playersCards[i].suit > playersCards[i+1].suit)  ||
               ((playersCards[i].suit == playersCards[i+1].suit) &&
                      (playersCards[i].value < playersCards[i+1].value)))
            {
                Swap(playersCards[i], playersCards[i+1]);
                sorted=false;
            }
        }
        last--;
    }
}

//This function prints the cards of one player in sorted order
void PrintCards(const card playersCards[], const int playerNum)
{
    int i;              //loop index

    cout << "PLAYER " << playerNum << endl;
    cout << setw(6) << "SUIT";
    cout << setw(14) << "VALUE";
    cout << setw(14) << "POINTS" << endl;

    //This for loop prints the current player's cards
    for(i=0; i<MAX_CARDS_PER_PLAYER; i++)
    {
        //Using enum type switch expression
        //Print values of each card
        //And if the value is 1,  then print A.
        //    if the value is 11, then print J.
        //    if the value is 12, then print Q.
        //    if the value is 13, then print K.
        //Then print point of each card
        switch (playersCards[i].suit)
        {
            case DIAMOND:
                cout << setw(8) << "Diamond";
                if(playersCards[i].value==1)
                    cout << setw(10) << "A";
                else if(playersCards[i].value==11)
                    cout << setw(10) << "J";
                else if(playersCards[i].value==12)
                    cout << setw(10) << "Q";
                else if(playersCards[i].value==13)
                    cout << setw(10) << "K";
                else
                    cout << setw(10) << playersCards[i].value;
                cout << setw(14) << playersCards[i].points;
                cout << endl;
                break;

            case CLUB:
                cout << setw(6) << "Club";
                if(playersCards[i].value==1)
                    cout << setw(12) << "A";
                else if(playersCards[i].value==11)
                    cout << setw(12) << "J";
                else if(playersCards[i].value==12)
                    cout << setw(12) << "Q";
                else if(playersCards[i].value==13)
                    cout << setw(12) << "K";
                else
                    cout << setw(12) << playersCards[i].value;
                cout << setw(14) << playersCards[i].points;
                cout << endl;
                break;

            case HEART:
                cout << setw(7) << "Heart";
                if(playersCards[i].value==1)
                    cout << setw(11) << "A";
                else if(playersCards[i].value==11)
                    cout << setw(11) << "J";
                else if(playersCards[i].value==12)
                    cout << setw(11) << "Q";
                else if(playersCards[i].value==13)
                    cout << setw(11) << "K";
                else
                    cout << setw(11) << playersCards[i].value;
                cout << setw(14) << playersCards[i].points;
                cout << endl;
                break;
                
            case SPADE:
                cout << setw(7) << "Spade";
                if(playersCards[i].value==1)
                    cout << setw(11) << "A";
                else if(playersCards[i].value==11)
                    cout << setw(11) << "J";
                else if(playersCards[i].value==12)
                    cout << setw(11) << "Q";
                else if(playersCards[i].value==13)
                    cout << setw(11) << "K";
                else
                    cout << setw(11) << playersCards[i].value;
                cout << setw(14) << playersCards[i].points;
                cout << endl;
                break;
        }
    }
    cout << endl;
}

//This function swaps the two elements
void Swap(card & a, card & b)
{
    card temp;

    temp=a;
    a=b;
    b=temp;
}

int LinearSearch(card playersCards[], int size)
{
    int i;
    for (i=0; i<size; i++)
	{
		if (playersCards[i].value == 2 && playersCards[i].suit == CLUB)
			return i;
	}
	return -1;
}
