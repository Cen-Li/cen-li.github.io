#include "type.h"

#ifndef CARDCLASS_H
#define CARDCLASS_H

class CardClass
{
	public:
		CardClass();
		//Default Constructor: creates the deck of cards by assigning
		//appropriate suit, value, and points for each card
		//Pre-condition: none
		//Post-condition: A deck of cards created
		//				  number of cards remaining in deck is assigned
	
		void ShuffleCards();
		//Shuffles the cards into a random order
		//Pre-condition: A deck of cards in order
		//Post-condition: A deck of cards in random order
	
		CardStruct& DealCards();
		//Deals out one card only
		//Pre-condition: Shuffled deck of cards, 
		//				 number of cards in the deck remaining
		//Post-condition: one card is dealt to the player,
		//				  -1 cards in the deck remaining

	private:
		int numOfCards;
		//number of cards remaining in deck
	
		CardStruct deck[MAX_DECK_SIZE];
		//the deck of cards
};

#endif
