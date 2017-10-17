#!/bin/bash

case $1 in 
    patch|major|minor) echo is valid ;;
    *) 
        echo 'required argument patch major or minor'
        exit 1
        ;;
esac

ready=$(git status --porcelain)

if [ -z "$ready" ]
then
    yarn publish --new-version $1
else
    echo 'git status not ready for publish'
    exit 1
fi
