# package-linker

Link utility for npm packages.

## Installation:

```
npm i -g package-linker
```

## Usage:
When working in several inter-dependent packages at the same time it is useful to checkout all the repositories
at the same level and then link them as needed by mean of the 'npm link' command.
This utility reads the packages to inter-link from a configuration file, finds the matching projects from within the
current subfolders and performs different command (as shown below).

### Create a configuration file in the folder containing the packages to link:

```
.npmpl.json:

{
  "packages": ["foo-*", "bar"]
}

```

### Link all packages and then link all their dependencies:
Finds all the existing folders matching the given patterns or names, first goes into each of the
directories and performs a 'npm link' and then goes a second time into each of the directories, finds out which
dependencies are 'linkable' and performs a 'npm link <linkable dependency>'.

```
npmpl link
```

### Unlink all packages and then unlink all their dependencies:
Finds all the existing folders matching the given patterns or names, first goes into each of the
directories and performs a 'npm unlink' and then goes a second time into each of the directories, finds out which
dependencies are 'unlinkable' and performs a 'npm unlink <linkable dependency>'.

```
npmpl unlink
```

### Link / Unlink only the packages:
Finds all the existing folders matching the given patterns or names, goes into each of the directories and performs a
'npm unlink' or a 'npm unlink'.

```
npmpl link -op

npmpl link --only-packages

npmpl unlink -op

npmpl unlink --only-packages
```

### Link / Unlink only the dependencies
Finds all the existing folders matching the given patterns or names, goes into each of the directories, finds out which
dependencies are 'linkable' or 'unlinkable' and performs a 'npm link <linkable dependency>' or a
'npm unlink <linkable dependency>'.

```
npmpl link -od

npmpl link --only-dependencies

npmpl unlink -od

npmpl unlink --only-dependencies
```
