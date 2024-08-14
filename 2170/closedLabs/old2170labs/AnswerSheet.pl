#!/usr/bin/perl
###################################################################
# ~cs$COURSE/public_html/manual/AnswerSheet.pl
#     ^^^^^^  set below
#
# This file was copied from frank and modified for use on the
# CS Linux systems by Roland Untch and Al Cripps, May 2008.
# It was also changed to be more "generic".  By changing the
# variable COURSE below, it should work for either 1170 or 2170.
#
# This file has a convoluted history.  It was originally developed
# by use in the CSCI 117 (1170) closed labs.  It was then decided
# to rewrite the CSCI 217 (2170) closed labs to use this format.
# Towards that end, Brad Rudnik copied on 5/4/1999 the file
# /usr/local/etc/httpd/cgi-bin/users/csdept/117man/master.pl
# and modified it for use in the 217 online manual.
# All references to 117 were changed to 217 and this version was changed to
# support a separate Window for the Answer Sheet.  
# /usr/local/etc/httpd/cgi-bin/users/csdept/217man/AnswerSheet.pl
#
# Later still this file was modified by Tom Cheatham and Jungsoon Yoo.
# Eventually this file was renamed and made to reside on frank as:
# /usr/local/etc/httpd/cgi-bin/users/csci217/AnswerSheet.pl
# It was this last file that serves as the basis of the current file.
#
# Changes were inspired from the old 1170 AnswerSheet.pl.  Most changes
# relate to path name changes directly due to porting to the CS Linux
# system.  Also the vestiges of student logging were eliminated and
# a slightly different temporary file naming convention was adopted.
#
#
# ======== Original Comments follow: =================
#
#This document is the heart of the 217manual online.
#This document:
#  Opens, reads, displays all html code for the answer sheet
#  Presents the user interface which secures the student identity
#  Does some input verification for malicious entries
#  Opens, extracts existing answer files and saves new answers
#
#This programs uses regular expression matching.
#Be very cautious about altering regular expressions in this document.
#Also, NEVER MATCH OR SUBSTITUTE VALUES for SUBMIT BUTTONS with this
#design.
#
#It would be prudent to place all input fields in the .html answer sheets 
#on a separate line from other text.
#
#Project Leader: Dr. Thomas Cheatham, CS Dept MTSU  
#Programmers: Kay Anthony
#             Benji Henson
#
#
# Jan 2000 - Brad Rudnik
# added a function to log the student information to the file
# listed below. LogStudentID() is at the end of this file.
###################################################################

### Change these global values if porting system:
$USR = "/nfshome";
$COURSE = "2170";

###
use CGI;                               
$in = new CGI;
print $in->header ("text/html");

#load these variables with the student, lab & file name info  
$student=$in->param('name');
$uname = $in->param('uname');
$lab = $in->param('lab');
$labNum = $lab;
$labNum =~ s/\/lab[^\/]+\///;
# Following line replaced with the one above to correctly parse the lab num
# It did NOT work with 2-digit lab numbers.  TC. 3/25/99
#$labNum =~ s/\/lab.\///;

$Sname = $student;

#don't know identity? -- get it 
if ($student eq '')
{
   &GetIdentity();
}

#start lesson
elsif ($in->param('submit') eq 'Load Answer Sheet')
{
    #if student entered acceptable values for name, partner, etc.
    #check for previous entries -- load object with entries. Print
    #lesson to screen.  
    if (&CleanEntries())
    {
       if (open (DF, "/tmp/$COURSE.$labNum.$uname"))
       {
          $in = new CGI (DF);
          close (DF);
       }
       &printHTML($lab."Ans.html");
    } 
}
    #the above line was changed to point the answer sheet rather than
    #the lesson as stated above. Changed 5/5/99 by Brad Rudnik to 
    #convert this master.pl to service a seperate Answer Window.
 
#save answers
elsif ($in->param('submit') eq 'Save Answers' || 
    $in->param('submit') eq 'Click to Save Answers: Only if you must quit now')
{
   &SaveAnswers();
}

#view answer sheet
elsif ($in->param('submit') eq 'View Answer Sheet')
{
#Following if() added by TC 1/17 to automatically save answers for
#safety reasons due to printer errors at the local PCs.

   if (open (DOUT,">/tmp/$COURSE.$labNum.$uname"))
   {
      $in -> save(DOUT);
      close(DOUT);
   }

    &printHTML($lab."Ans.html");
}

#present printable/final answer sheet
elsif ($in->param('submit') eq 'Final Answer Sheet')
{
#Following if() added by TC 2/5 to automatically save answers after last
#updates for safety reasons due to printer errors at the local PCs.

   if (open (DOUT,">/tmp/$COURSE.$labNum.$uname"))
   {
      $in -> save(DOUT);
      close(DOUT);
   }

   &printFINAL($lab."Ans.html");
}


#End of main driver

###############################################################
#Clean Entries
#Validate user entries for name, class acct name, & instructor.
#Allow only alphaneumeric (with spaces) and nonblank entries.
#Warn user if entries are bad & tell user to start lesson again.
#Return true for acceptable entries, bad otherwise. 
###########
sub CleanEntries
{
   $StudentName=$in->param('name');
   $AcctName=$in->param('uname');

   unless ($StudentName =~ /^[\w\s]+$/ && $AcctName =~ /^[\w\s]+$/)
   {
    print "<h1>Name Entered:&nbsp;$StudentName<br>";
    print "Class Account Entered:&nbsp;$AcctName<br></h1><p>";
    print "<h2>One or both of the above entries either contain characters";
    print " which are a security risk or is/are blank.<p>";
    print "Entries are required and only alphaneumerics are allowed.";
    print "You must begin the lesson again (click the browser's back button).";
    print "<p>See your lab assistant if you have questions.<p></h2>";
    print $in->end_html;
   }
   return ($StudentName=~/^[\w\s]+$/ && $AcctName=~/^[\w\s]+$/);
}





################################################################
#sub GetIdentity
#Get info from user on name, partner, class acct name & instructor. 
###############
sub GetIdentity
{
     $gif=$ENV{'PATH_INFO'}.".gif";     
     print $in->start_html(-title=>'Student Identity',
           -BACKGROUND=>"http://www.cs.mtsu.edu/~cs$COURSE/manual.$gif",
           -BGCOLOR=>'FAF0E6');
     print $in->start_multipart_form('GET',
            "http://www.cs.mtsu.edu/~cs$COURSE/manual/AnswerSheet.pl");
    ##################the above line must point to the name of this file - 
    ##these lines added by Brad Rudnik 5/99. #############################
     print "<h1> Student Identity:</h1><p>";
    
     print "<b>The information you enter in the boxes below will be used to print your answer sheet for this lesson. Only alphanumeric entries are allowed.<p>These entries are also used if you should decide to save your answers. You cannot change these entries later in the lesson.<p><font COLOR=483D8B><I>Click the mouse inside the box with the white background to put the focus there so you can type an answer.<p></I></font>";  

     print $in->hidden('lab',$ENV{'PATH_INFO'}); 
     print "Enter your name:&nbsp", $in->textfield('name',''),"<p>";
     print "Enter your class username:&nbsp", $in->textfield('uname',''),"<p>";
     print "Enter your partner's name:&nbsp", $in->textfield('partner','');
     print "<p>Enter your instructor's name:&nbsp";
     print $in->popup_menu(-name=>'instructor', 
            -values=>['Select your teacher\'s name',
            'Al-Tobasei','Bucher','Butler','Carroll','Detmer','Dong','Gu','Li',
            'Parker','Pettey','Sarkar','Seo','Untch','JYoo','SYoo','other']);
     print "<br><br></b>";
     print "<center>", $in->submit('submit','Load Answer Sheet'),"</center>";
     print $in->endform;
     print $in->end_html;
}
     



##################################################################
#Function: SaveAnswers
#If file opens, save user's answers and inform user that he/she will
#need to remember the username used to create the file. Show the user
#the entries used. If file fails to open, inform user that answers
#were not saved.
########################################  
sub SaveAnswers 
{
   #if the file opens for output, save the answers using the
   #student identity info as the file name.  
   if (open (DOUT,">/tmp/$COURSE.$labNum.$uname"))
   {
      $in -> save(DOUT);
      close(DOUT);
      print "<h1><center>Your answers have been saved.</center></h1><p>";
      print "<b> To recover these answers later, you MUST input the same class username that you entered when you began this lesson. The username you entered at the beginning of this lesson was:<p>";
 
  print "username:&nbsp; <font color=B22222>$uname</font><p>";
  print $in->end_html;
   }
   else
   {
	   print "****", $labNum, "****<p>";
       print "Write failed. These answers were not saved.";
       print $in->end_html;  
   }
}



###################################################################
#Function: printFINAL 
#Function prints the final answer sheet for this lesson.
###################################
sub printFINAL
{
   $file=$_[0];
   open (FINAL, "$USR/cs$COURSE/public_html/manual$file")
        || die "Final Form open failure";
  
   #put the student/partner/instructor identities on the answer sheet 
   print "<b>Name:&nbsp;", $in->param('name'), "<br>";
   print "Partner:&nbsp;", $in->param('partner'), "<br>";
   print "Instructor:&nbsp;", $in->param('instructor'), "<p></b>"; 
   $tm = localtime(time());
   print "$tm<p></b>";

   print "<p><p><center><h2><font color=\"0000FF\"> ";
   print "Print hardcopy using the Browser\'s Print Button or via File menu ";
   print "</font></h2></center><p>";
   
   #while lines in file, check for form input fields. If found,
   #snag the name of the field and use it to print the object data.
   #Expects input fields to be one of three types:
   #  <input type=hidden ...>
   #  <input type=text ...>
   #  <textarea name= ...></textarea>
   #do not print any matched lines, instead print corr. stored value.
   #(DO NOT MATCH OR PRINT SUBMIT BUTTONS)
   #if no match was found on the line, print the line as read

   while (<FINAL>)
   {
       $name="";
# Changed by TC and MW 3/8/99 to fix problem with "" around names
       if (/(^.*<textarea *name *= *"?)([^ \t"]+)("?.*$)/)   
       {  
           $name=$2;
# next lines added by T. Cheatham 1/17 to correct a lack of CR in
#final answers and to correct display of < or > in an answer.
		   $hold = $in -> param($name);
		   $hold =~ s/</&lt;/g;	# incase the ans contains <
		   $hold =~ s/>/&gt;/g;	# in case the ans contains >
		   $hold =~ s/\012/<br>/g;
		   $hold =~ s/\015//g;

#Changed by TC and MW 3/8/99 to fix the loss of spacing in a text area
#answer. -- due to print problems this change was reversed by BAR 8-29-02
		   print $hold, "<br>";
		   #print "<pre>",$hold, "</pre>";

           #print $in->param($name), "<p>";
       }
# next lines added by T. Cheatham 1/18 to handle <input type= text ...>

	   elsif (/<[Ii]nput *type *= *text *.*name *= *"?([^ \t"]+)"?/)
	   { #handle answers in type=text areas
		   $name = $1;
		   $hold = $in -> param($name);
		   $hold =~ s/</&lt;/g;	# incase the ans contains <
		   $hold =~ s/>/&gt;/g;	# in case the ans contains >

		   print $hold;
	   }
       elsif (! /^.*<input type=submit .*/) 
       {  
#Took out "<p>" from following print to correct spacing problem in 
#final answer. TC, 3/3/99.
         print $_; 
       }
   }
   close (FINAL);
   print $in->end_html;
} 


####################################################################
#Function: printHTML
# Reads an HTML file and substitutes corresponding values from the
# $in->param() object for hidden fields (defined in the HTML, probably
# without values) as the HTML text is printed to the browser.  There
# are some complicated regular expressions to pick out the pieces of
# an HTML input line.
########
sub printHTML 
{
  $file=$_[0];

  open (HTML, "$USR/cs$COURSE/public_html/manual$file")
         || die "HTML open failure";
     

  #Read the lines and print them substituting the previously saved value
  #when appropriate.

  while (<HTML>)
  {
    $name = $_;
    chop ($name);
    $value = "";               #reinitialize for this pass 

 
    ####### NEVER CAPTURE SUBMIT BUTTON VALUES ####################


    $name =~ s/^.*<input type=hidden *name *= *([^ \t]+).*$/$1/;
    $value = $in->param($name);
    if (defined($value) && ($value ne "")) 
    {
#Following 4 lines added bt T.C. 2/16/99 to correct error in value being
#held which contains < > or single quote.  Actually, problem was with
#type=text but I changed it here too just in case it happens later.
#	   $value =~ s/</&lt;/g;	# in case the ans contains <
#	   $value =~ s/>/&gt;/g;	# in case the ans contains >
#	   $value =~ s/'([^']*)'/sq($1)/g;	# replace single quote with \' so okay
#      $value = "'".$value."'";

    #insert the value into the hidden field so it will be available later
s/(^.*<input type=hidden name=[^ \t]+ *value=)(\"?)([^\"]*)(\"?)(.*$)/$1\"$value\"$5/;
    }           

    #capture textareas  -- regular expression matching is working fine
    #Insert the actual value submitted into the textarea when it is
    #displayed in the "view answers" page.
# Changed by TC and MW 3/8/99 to fix problem with "" around names
    $name =~ s/^[^<]*<textarea *name *= *"?([^ "]+)"?.*$/$1/;
    #$name =~ s/^[ \t]*<textarea *name *= *"?([^ "]+)"?.*$/$1/;
	# JYoo:this has been changed to make text area appear any where in a line
    $value = $in->param($name);
    if (defined($value) && ($value ne ""))          
    {
	   $value =~ s/</&lt;/g;	# incase the ans contains <
	   $value =~ s/>/&gt;/g;	# in case the ans contains >

    s/(^[^<]*<textarea [^>]*>)([^<]*)(<\/textarea>.*$)/$1$value$3/;
    }

# following lines added by T. Cheatham to handle output on "view
# answers" screen for <input type=text ...>, 1/18/99
	#capture <input type=text ...>
    #Insert the actual value submitted into the text box when it is
# following line changed by MW and TC 2/24/99 to fix a parsing problem
# that occurs when the name of the field in the answer HTML file had 
# quotes around it.  In this case the parser was wrong and lost the
# answer.
    $name =~ s/^.*<[Ii]nput *type *= *text *name *= *"?([^ \t"]+)"?.*$/$1/;
	$value = $in -> param($name);
	
    if (defined($value) && ($value ne ""))
	{
#Following 4 lines added bt T.C. 2/16/99 to correct error in value being
#held which contains < > or single quote.  Actually, problem was with
#type=text but I changed it here too just in case it happens later.
	   $value =~ s/</&lt;/g;	# incase the ans contains <
	   $value =~ s/>/&gt;/g;	# in case the ans contains >
	   $value =~ s/'([^']*)'/sq($1)/g;		# replace single quote with sq(*)
       $value = "'".$value."'";	#enclose value in '' incase it contains spaces

	s/(^.*<[Ii]nput *type=text *name= *[^>]*)(>.*$)/$1 value=$value$2/;
	}
 
    #displayed in the "view answers" page.
  	#Print the line after all alterations 
	#Line below changed by M.W. and T.C. to prevent double
	#spacing of <pre> formatted text.  2/10/99
	#print $_,"\n";        
	print $_;        
  } 

  close(HTML);

  print $in->end_html;
 

} #end of printHTML
