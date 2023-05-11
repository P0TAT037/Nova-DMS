listen here you little cat potato thingy:
----1st things 1st, add type of node in getnodes api, response should look like this 
======> now getNodes returns the whole metadata for each file including if it's a folder

----make get /roles request, this should return each role with users that have this role, response should look like this
======> done but no unassigned because every user can have more than 1 role therefore admin will not only assign roles to users in the unassigned role, so it's useless

----make get /user/admin to return admins, response should look like this
======> done, returning the whole user info, and changed the user object to contain the name, if you find null name in any endpoint that returns user object plz report

----(optional) make delete /user that deletes user accounts, admins should only delete accounts.
if someone got fired, we would want to delete his shit too right? :p
returns status code 200;
====>later

17/4/2023
----pls finish delete node api
=====> later

----post node needs a folder option 
=====> you type folder in the metadata content type

----finsih update node
=======> later
----wats da difference between content and description, and do user need to type in both for them?
======> content is literally the content of the file, for example a txt files content is the text inside it, it should be fetched 
		by the ocr, editable by the user, or the user can enter it or you can look for a library or Something to read the txt/pdf
		/docx..etc files and fill it automatically. Description is just a description, like thats a photo of the president or a
		contract for such and such, entered by the user and can be empty.  
----post node ignores directory
======> ?????? wdym by ignore???

-----make api to give premission to user on a single file, takes input of userid and file name
======>changeperm does the trick, but it uses file id

-----make get api that returns users that are premitted on file
======> later

-----delete api that delete user's premission on single file, takes input of user id and file name
======> changeperm does do that too, but it uses file id


nigga sleep nigga sleep
errors i faced:
getnodes still retarded.

