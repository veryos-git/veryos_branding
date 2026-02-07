# abstract 
AI tools have become very powerful. This app makes use of them to percieve image, video (many images) and audio data and convert them to text. this text is very preciuous because it provides a different form of data that later can be used to filter and and manipulate the original image and audio data. 

# technical 

## GUI
a denojs webserver will provide a simple http server to initially serve a web GUI. on the client side the javascript then connects to a websocket to make sure a blazing fast communcation can be established from the client to server and backwards. 
## backend server programming language  
denojs (native ESM6 javascript, not Typescript!, whereer possible)
denojs -> calls binaries 
 - python (used for locally running Artifical Intelligence models )
 - ffmpeg: helpful tools for extracting image data from videos for example

## frontend 
- native html , javascript and css. 


## persistant data (database)
DB: SQLite (file-based, no server)
ORM: DenoDB

## working directory structure

### webserved_dir
the html , css, and javascript that is sent and run on the client
#### ./functions.module.js
the generic javascript functions that are used on the client side and maybe on the server side, for example instantiating an object f_o_dimensions(...) can be done on the client side and also on the server side. 
#### ./constructors.module.js

### ./functions.module.js
the generic functions that can only be used on the server side. for example reading files from the file system can be done with Deno.readFile() but cannot be done on the client side javascript


### ./webserver_denojs.js
the main entry point for the webserver

### ./function_testing.module.js
a file used for executing and testing functions 

### 

# milestones
the application is developed step by step 
the goals/milestones are documentet here

## read directory recursively
create a front end page that takes a input string and has a button 'f_a_o_file' . once clicked the inputted path gets checked, and file information in this folder is gathered recursively.
then the folders are shown as a list . the folders can be clicked to be expanded and to show their content. the sub folders are indented (depending on the nesting level )and can also can be clicked. 

### one page for all
there should be a home page with all 'subpages' . technically all runs on that single page but there is a navigation on top when a navigation item is clicked all other pages are hidden and the page with the title that has been clicked on  should be shown. 
currently we have two pages: 
- analyze files
    - a page where a directory can be scanned 
- configuration
    - a page where the configuration of this application instance can be updated
        - configuration

### data persistency
the object f_o_config should be written (crud 'create' and 'update')to the database. and if the configuration page is  visited the config should be read (crud 'read')

### database 
all the f_o_[namehere] functions in the constructos.module.js represent 'models' that should be available in the database


### gui for database
a page 'data' that is like a minimal version of 'phpmyadmin' that lets browse the database and allows data manipulation (CRUD) of the database


### crud db function
there is a generic function that can be used to manipulate db data 'f_v_crud__indb' , implement this 

### code cleanup, 
the function f_o_model__from_s_name_table can be loaded from 'constructors.module.js'. so that it has not to be coded redundantly. find other functions that may are coded redundant. 

### frontend change to Vue.js v3 with options API
the project front end currently is programmed in native html css javascript. 
use Vue.js 3 for the frontend

### refactor o_file to o_fsnode
in linux a file and  a folder are basically both a node with the only difference that a folder 
can have children . that is why we renamed the model 'o_file' to 'o_fsnode'

### analyze files
data persistance:
- when the path has been changed and 'f_a_o_file' has been clicked. the path should be written to the config. when the page is reloaded that path should be read from config

- when a folder is being analized. 