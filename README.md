<!-- TOC --><a name="qrestau"></a>
# QRestau

**QRestau** is a virtual menu and ordering system for your restaurant. Manage your menu items and staff in the back office, print a QR Code that you can display on each table and let your customers order from their phone.


<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Try out the app](#try-out-the-app)
- [Usage](#usage)
   * [As an Admin](#as-an-admin)
      + [Access the back-office](#access-the-back-office)
      + [Manage users](#manage-users)
      + [Manage menu items](#manage-menu-items)
      + [Manage tables](#manage-tables)
      + [What about the other models ?](#what-about-the-other-models-)
   * [As a Staff](#as-a-staff)
      + [Log in](#log-in)
      + [The dashboard](#the-dashboard)
      + [Start the meal](#start-the-meal)
      + [Close the meal](#close-the-meal)
      + [Order for your clients](#order-for-your-clients)
      + [Edit not yet delivered ordered items](#edit-not-yet-delivered-ordered-items)
   * [As a Customer](#as-a-customer)
      + [Access menu](#access-menu)
      + [Add to cart](#add-to-cart)
      + [Confirm order](#confirm-order)
      + [Ordered items](#ordered-items)
- [Installation](#installation)
   * [Back end (Django)](#back-end-django)
   * [Front end (React)](#front-end-react)
- [Build (Front end)](#build-front-end)
- [Technical details](#technical-details)
- [TODO](#todo)

<!-- TOC end -->

<!-- TOC --><a name="try-out-the-app"></a>
# Try out the app
An instance of **QRestau** is installed at [https://thomasf.dev/qrestau/](https://thomasf.dev/qrestau/)

Refer to the **Usage > As a staff** and **Usage > As a customer** sections for help.

<!-- TOC --><a name="usage"></a>
# Usage
There are three types of users that will be using this app:
1. Admin: will manage staff, menu items and tables by using the backoffice.
2. Staff (waiters): will attend to tables and help customers ordering.
3. Customer: will order food from the menu


<!-- TOC --><a name="as-an-admin"></a>
## As an Admin
There is pre-populated data in the SQLITE database that is in the repository. You may use it if you're only looking to try on the app but otherwise we recommend setting up your own database.

All admin actions will have to be done through the django admin screen.

The default credentials for the admin is:
username: admin
password: admin

<!-- TOC --><a name="access-the-back-office"></a>
### Access the back-office
Access the backoffice login form at this URL:
http://localhost:8000/admin/

<!-- TOC --><a name="manage-users"></a>
### Manage users
Manage users in this screen:
http://localhost:8000/admin/auth/user/

There are only one group of user (Staff) that you should assign to every staff member.

You do not need to create users for your customers as the system will automatically create a new user for each meal.


<!-- TOC --><a name="manage-menu-items"></a>
### Manage menu items
Manage menu items from this screen:
http://localhost:8000/admin/qrestauApp/item/

<!-- TOC --><a name="manage-tables"></a>
### Manage tables
Manage tables fronm this screen:
http://localhost:8000/admin/qrestauApp/table/

<!-- TOC --><a name="what-about-the-other-models-"></a>
### What about the other models ?
As an admin you don't need to touch any other data as the system will handle this automatically.

<!-- TOC --><a name="as-a-staff"></a>
## As a Staff
The staff group represent waiters and other employees of the restaurant that will attend the tables. All actions made by the staff will be made through the front-end.

Default staff account:
username: staff1
password: staffstaff

<!-- TOC --><a name="log-in"></a>
### Log in
Staff members can log in through this screen
http://localhost:3000/staff

<!-- TOC --><a name="the-dashboard"></a>
### The dashboard
The dashboard shows a list of tables. A table can be inoccupied, in which case it will have a blue color, or occupied, in orange, meaning that someone is already eating at that table.

http://localhost:3000/staff/dashboard

<!-- TOC --><a name="start-the-meal"></a>
### Start the meal
The screen is located at the following URL (You may need to change the table ID)
http://localhost:3000/staff/tables/1

Before customers are able to login on a table, a staff member has to start the meal by clicking the **Start meal** button.

The staff has to enter a password that they will communicate to the customers. They will need this password to start ordering on this table.


<!-- TOC --><a name="close-the-meal"></a>
### Close the meal
The screen is located at the following URL (You may need to change the table ID):
http://localhost:3000/staff/tables/1

When the meal is over, to make the table available again to other customers, the staff will have to end the meal. This will make sure no other order can be made for this meal.


<!-- TOC --><a name="order-for-your-clients"></a>
### Order for your clients
The screen is located at the following URL (You may need to change the table ID):
http://localhost:3000/staff/tables/1

Once a meal is started, you will have access to a **Menu** button that should bring you to this next screen:

http://localhost:3000/customer/tables/1/meals/20/menu
(table and meal ID may differ)

You can there chose a menu item from a category and add it to the cart. You then have to review the cart and confirm the order.

<!-- TOC --><a name="edit-not-yet-delivered-ordered-items"></a>
### Edit not yet delivered ordered items
The screen is located at the following URL (You may need to change the table ID):
http://localhost:3000/staff/tables/1

Staff have the possibility to change the quantity of ordered items as long as they havent been delivered yet. Click on the **Order** button. You will access the next screen:

http://localhost:3000/customer/tables/1/meals/20/order
(table and meal ID may differ)

Customers have access to the same screen to review their order but only Staff members can edit/delete an item, or mark them as delivered once they are on the table.

<!-- TOC --><a name="as-a-customer"></a>
## As a Customer
Customers will only have access to a handeful of the front-end screens.

<!-- TOC --><a name="access-menu"></a>
### Access menu
After a Staff member start a meal on the customers' table, they will have to give a password to the customers. The customer can then access the login page through a QRCode that should be displayed on their table. The URL should be looking like this (table ID may differ):

http://localhost:3000/customer/tables/4/

They can then enter the password and press the **Login** button

<!-- TOC --><a name="add-to-cart"></a>
### Add to cart
From the menu screen, customers are available to add items to their cart:
http://localhost:3000/customer/tables/4/meals/15/menu
(Table ID and meal ID may differ)

Customers have to press a **+** button that is located on the right side of every menu item. Each time a customer hit the **+** button it will add one unit of the corresponding item to the cart. The **-** button will remove one unit. the trash button will remove all units of the item from the cart.

The cart can also be emptied completely with the bottom left trash button.

When the user is comfortable with their decision they can press the Cart button to review the entirety of their cart.

<!-- TOC --><a name="confirm-order"></a>
### Confirm order
The corresponding screen is located on a similar URL:
http://localhost:3000/customer/tables/4/meals/15/cart
(Table ID and meal ID may differ)

This gives the customer a last change to update their cart. Once the **Order** button is pressed they will have to ask a Staff member if they want to change their order (before the order is delivered)


<!-- TOC --><a name="ordered-items"></a>
### Ordered items
From the Menu item customers can access the Ordered Items view:
http://localhost:3000/customer/tables/4/meals/15/menu
(Table ID and meal ID may differ)

This screen's only purpose is to show to customers what they already ordered. They are not able to edit anything from this list.

<!-- TOC --><a name="installation"></a>
# Installation
``git clone git@github.com:thomas-figved/qrestau.git .``

<!-- TOC --><a name="back-end-django"></a>
## Back end (Django)
Get into the back end folder

``cd qrestau_back``

Install environment

``pipenv install``

``pipenv shell``

Then start the python server

``python manage.py runserver``



<!-- TOC --><a name="front-end-react"></a>
## Front end (React)
Get into the front end folder

``cd qrestau_front``

Copy .env.template and change the values as necessary to match your environment

``cp .env.template .env``

``cp .env.template .env.development``


Install dependencies

``npm install``

Run server 

``npm start``

You might need to authorize the front-end URL in Django's allowed origins: qrestau_back/qrestau/settings.py

``CORS_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]``


<!-- TOC --><a name="build-front-end"></a>
# Build (Front end)
Get into the front end folder
``cd qrestau_front``

Install dependencies if not done already
``npm install``

Run the build
``npm run build``

<!-- TOC --><a name="technical-details"></a>
# Technical details


<!-- TOC --><a name="todo"></a>
# TODO
1. Error management
2. API Throttling
3. Testing both front and back
4. Websocket to update order list
5. Add item descriptions
6. Add possibility to give instruction to the chef such as "no sauce" and the like

