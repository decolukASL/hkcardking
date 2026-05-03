i would want to create a website using nextjs 
2. please investigate the db schema in db folder
3. 
this site function in below


#top menu bar
	- "search button" user can input the text and system will search the data in table "ePostCard"
	- "Shopping cart" button

#main page
upper area 
	- like "Pagination tags" the news (load data from table "eNews" load max 7 record and desc by date)  
below area 
	-  i want have a "Waterfall Flow" to display the image 
	(load by table "ePostCard" select the main image in "ePostCardImg" by path "pci_path")
	- each photo width 200px  height 350px
	- in the photo below have the price "pc_price"
	- the button "add to cart" 	
	
#normal user registation page (function button in right corner)
	- the user can create account the data will insert to table "mUser"
	- click the register button will display the popup form
	

#normal user management page
	- after normal user login , user have the management page to create a record in "ePostCardValidation" table 
	- user can upload max 2 image the file will stored in path "tempimage" folder the id is retrieve by eAttachment "atm_key"  the key is yyyymmdd + 18 random string and no symbol /TEMPIMAGE/20260504_LJSDAHFKJHSDFUE
	
#language button (function button in right corner)
	- user can switch the language "Chinese to English" or "English to Chinese"



#Shopping cart List
will list out all selected item 
the Check out button 


login page
	- management page
			- user can update the password, email
			
			- user can attachment the image and create the record in 
		
	- admin page
		- login by system administrator 
		