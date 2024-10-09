#!/bin/bash
# Check if exactly two arguments are provided
if [ $# -ne 2 ]; then
	echo "Error: Please provide project name and file path as arguments"
	exit 1
fi
# Store arguments in variables
project=$1
file=$2

path=$file
extension="${path##*.}"
# Skip non-js, non-ts, and non-proto files
if [[ "$extension" != "js" && "$extension" != "ts" && "$extension" != "avsc" ]]; then
	exit 0
fi
# Check if it is not a spec file
if [[ "$path" != *".spec."* ]]; then
	if [[ "$extension" == "avsc" ]]; then
		# Replace the extension with .spec.ts
		spec_path="${path%.*}.avsc.spec.ts"
	else
		# Replace the extension with .spec.js or .spec.ts
		spec_path="${path%.*}.spec.$extension"
	fi
else
	spec_path=$path
fi
# Skip if the spec file does not exists
if [[ ! -f "$spec_path" ]]; then
	base=$(basename -- "$file")
	echo "[$base] Changed, but no spec file found"
	exit 0
fi
clear

# Test the spec file
npx nx test $project --testFile=$spec_path --skip-nx-cache
echo "👀 Watching for file changes"
