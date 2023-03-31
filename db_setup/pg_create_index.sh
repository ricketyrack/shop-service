#!/bin/bash

psql shop <<EOF
	create unique index shopnbridx on shop (shopNumber);

EOF
