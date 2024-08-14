#include "CardClass.h"
#include <ctime>
#include <cstdlib>

CardClass::CardClass()
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
            deck[index].value=k+2;

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
	
	numOfCards = MAX_DECK_SIZE;
}

void CardClass::ShuffleCards()
{
	int i;          //loop index
    int randNum;    //stores the random number
    CardStruct temp;      //to use in swap

    //This for loop shuffles the cards into random order
    for(i=0; i<MAX_DECK_SIZE; i++)
    {
        randNum = rand() % MAX_DECK_SIZE;
        temp=deck[i];
        deck[i]=deck[randNum];
        deck[randNum]=temp;
    }
}

CardStruct& CardClass::DealCards()
{
	numOfCards--;				//decrement the number of cards remaining in the deck
	return deck[numOfCards];	//deal one card
}
