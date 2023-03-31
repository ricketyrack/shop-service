#!/bin/bash

export NEWUSER=app_user
export XDBNAME=shop
export XDBUSER=postgres
export XSCHEMA=public

# password is test

psql -U $XDBUSER $XDBNAME <<EOF
 GRANT USAGE ON SCHEMA $XSCHEMA TO $NEWUSER;
 GRANT SELECT,UPDATE,DELETE ON ALL TABLES IN SCHEMA $XSCHEMA TO $NEWUSER ;
 -- GRANT SELECT ON ALL TABLES IN SCHEMA public, my_schema TO $NEWUSER ;
 -- GRANT SELECT ON TABLE  TO $NEWUSER ;
 -- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $NEWUSER ; 
 -- ALTER DEFAULT PRIVILEGES GRANT SELECT ON TABLES TO $NEWUSER ; 
 -- guess i forgot this one FLUSH PRIVILEGES;
EOF

# to limit privileges to a user first revoke all existing privileges
# REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM limited_user;
# GRANT SELECT ON ALL TABLES IN SCHEMA public TO limited_user;

# create credentials for a user on an app
# heroku pg:credentials:create postgresql-sunny-1234 --name analyst -a example-app

# attach those credentials to the app
# heroku addons:attach postgresql-sunny-1234 --credential analyst -a example-app

# this will put the credentials in the DATABASE_URL config var if no other heroku postgres
# is attached to the app.  If DATABASE_URL already exists then a new var is created:
# HEROKU_POSTGRESQL_[COLOR]_URL

# detach the database from an application
# heroku addons:detach DATABASE -a example-app

# list the names of the credentials for an app
# heroku pg:credentials DATABASE_URL -a example-app

# create a credential for an app
# heroku pg:credentials:create DATABASE_URL --name analyst -a example-app

# destroy the credentials for an app
# heroku pg:credentials:destroy DATABASE --name analyst -a example-app

# rotate the credentials on a database
# heroku pg:credentials:rotate DATABASE --name analyst -a example-app

# get the credentials url
# heroku pg:credentials:url DATABASE --name analyst -a example-app

# repair the default credentials
# heroku pg:credentials:repair-default DATABASE -a example-app

# follower databases are near real-time copies
# if you create, destroy or rotate credentials on a follower database you get an error
# heroku pg:credentials:create postgresql-moonlight-5678 -a example-app


