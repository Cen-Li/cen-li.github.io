void queensClass::PlaceQueens(int Column, bool& Done)
// Calls: IsUnderAttack, SetQueen, RemoveQueen.
{
   if (Column > BOARD_SIZE)
      Done = true;  // base case
   else
   {  Done = false;
      int Row = 1;  // number of square in column

      while ( !Done && (Row <= BOARD_SIZE) )
      {  // if square can be attacked
         if (IsUnderAttack(Row, Column))
            ++Row;  // then consider next square in column
         else       // else place queen and consider next
         {          // column
            SetQueen(Row, Column);
            PlaceQueens(Column+1, Done);

            // if no queen is possible in next column,
            if (!Done)
            {  // backtrack: remove queen placed earlier
               // and try next square in column
               RemoveQueen(Row, Column);
               ++Row;
            }  // end if
         } // end if
      }  // end while
   }  // end if
}  // end PlaceQueens

