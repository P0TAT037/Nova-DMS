listen here you little cat potato thingy:
----1st things 1st, add type of node in getnodes api, response should look like this 
{
name: folder
hid:/6/
type: folder
},
{
name: file
hid:/7/
type: file
}
----make get /roles request, this should return each role with users that have this role, response should look like this
{
name: role 1
users: {
	name: "ahmed"
	id: 1
	},
	{
	name: "sammy"
	id: 2
	},
	{
	name: "idunno"
	id: 3
	}
},
{
name: role 2
users: {
	name: "soha"
	id: 4
	},
	{
	name: "manal"
	id: 5
	},
	{
	name: "dr.abtelateef 5omboscare"
	id: 6
	}
}
btw users that are unassigned to any role should be returned also, to make it eaiser for admin to assign roles to unassigned users.
they should look like this
{
name: unassigned
users: {
	name: "assass"
	id: 9
	},
	{
	name: "lmao"
	id: 10
	},
}  
----make get /user/admin to return admins, response should look like this
{
name: "john"
id: 77
},
{
name: "doe"
id: 87
} 
----(optional) make delete /user that deletes user accounts, admins should only delete accounts.
if someone got fired, we would want to delete his shit too right? :p
returns [];



if i rember anything else will tell you,
was supposed to finish signup/login page today but i gave up, gonna get back at it tommorw
glhf






17/4/2023
pls finish delete node api
post node needs a folder option
finsih update node
wats da difference between content and description, and do user need to type in both for them?
post node ignores directory
make api to give premission to user on a single file, takes input of userid and file name
make get api that returns users that are premitted on file
delete api that delete user's premission on single file, takes input of user id and file name

