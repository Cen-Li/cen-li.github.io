// Program Ounces converts ounces to cups, quarts, and gallons

/*  1 */ #include <iostream>
/*  2 */ using namespace std;

/*  3 */ const int OUNCES = 9946;

/*  4 */ int main()
/*  5 */ {
/*  6 */   int cups;
/*  7 */   int quarts;
/*  8 */   int gallons;
/*  9 */   cups = OUNCES / 8;
/* 10 */   cout << OUNCES  << " ounces is "  << cups
		      << " cups and "  << OUNCES % 8  << " ounces."
		      << endl;
/* 11 */   quarts = cups / 4;
/* 12 */   cout  << OUNCES  << " ounces is "  << quarts
		       << " quarts and "
		       << cups % 4 * 8 + OUNCES % 8  << " ounces ."
		       << endl;
/* 13 */   gallons = OUNCES / 128;
/* 14 */   cout  << OUNCES  << " ounces is "  << gallons
		       << " gallons and "  << OUNCES % 128
		       << " ounces."  << endl;
/* 15 */   return 0;
/* 16 */ }
  

