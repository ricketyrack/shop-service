#!/bin/bash

psql -h localhost -p 5432 shop <<EOF
	create group app_users;
	create user app_user in group app_users  password 'password';
	alter user app_user password 'password';

EOF
