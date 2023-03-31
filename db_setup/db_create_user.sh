#!/bin/bash

psql -U postgres shop <<EOF
	create group app_users;
	create user app_user in group app_users  password 'password';
	alter user app_user password 'password';

EOF
