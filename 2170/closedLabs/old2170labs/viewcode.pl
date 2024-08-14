#!/usr/bin/perl
#####################
# viewcode.pl by Brad Rudnik
#
#	***edited for use with the 117 manual Aug. 2001***
#	***edited for use with the 2170 manual on CS Linux May 2008***
#
# A Perl CGI Script file for the 217 Manual 
#
# This program will read and display a C++ Program Code Files in 
# the browser in standard HTML format.
#
# Based on the file name passed to the program in the URL in the form:
#    http://www.cs.mtsu.edu/~cs2170/manual/viewcode.pl?FileName.cc
#
# The directory containing the files must be listed in this program and is 
# currently set to:
$path = "~cs2170/public_html/2170/CLA/";  #set base directory path to CLA files

#unix command used to format the file
$Command = "pr -n' '3 -t -e4";


#determine file to display
$FileName = $ENV{'QUERY_STRING'};


#page set up
print "Content-type:text/html\n\n";
print <<EndOfHTML;
<html><head><title> $FileName </title></head>
<body BGCOLOR="#C0C0C0" TEXT="#000000">
<center><h2> $FileName </h2></center><br></center>
<pre>
EndOfHTML
;

#set up the path and file name to display
$datafile = "$path";
$datafile .= "$FileName";

#these two line were replaced in order to format the output using 
#standard unix system commands
#read file name data
#&ReadArray("$datafile");

#read and format the file
@filedata = `$Command $datafile`;
 
#loop thru log entries printing them to the page 
foreach $line (@filedata) {
$line =~ s/</&lt;/g;        #replace the html tag bracket <
print "$line";
}


#close HTML page
print "</pre></body></html>";


################
#END Main Driver
################


#read an array of data from a file
# INPUT REQ: file name to read $_[0]
sub ReadArray 
{
    open (READ, "$_[0]") || print "<br>$_[0] file open failed<br>";
    @filedata = <READ>;
    close(READ);

}#END ReadArray



#END Program 

