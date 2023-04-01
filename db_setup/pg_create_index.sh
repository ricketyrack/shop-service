#!/bin/bash

psql shop <<EOF
	create unique index storeNumber on shop (storeNumber);

EOF
