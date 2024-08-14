#ifndef MyType_H
#define MyType_H

const int MAX_DECK_SIZE = 52;           //size of the deck
const int MAX_SUIT = 4;                 //number of suits in the deck
const int MAX_CARDS_PER_SUIT = 13;      //number of cards per suit
const int MAX_PLAYERS = 4;              //number of players
const int MAX_CARDS_PER_PLAYER = 13;    //number of cards per player

//define enum type CardSuitType
enum CardSuitType { DIAMOND, CLUB, HEART, SPADE };

struct CardStruct{
    CardSuitType suit;
    int value;
    int points;
};

#endif
