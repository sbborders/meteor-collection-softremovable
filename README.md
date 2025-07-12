# Soft remove for collections

This package is a fork from [zimme/meteor-collection-softremovable](https://github.com/zimme/meteor-collection-softremovable) 

Release Notes: 

## Version 2

* support Autoform 6.3+
* suporte to Meteor 2.8
* code converted from CoffeeScript to JavaScript
* support to new MongoDB Package Async API

## Version 3
* underscore dependency removed
* suporte to Meteor 3+
* code optimization


Add soft remove to collections.

### Install
```sh
meteor npm install simpl-schema
meteor add sbborders:collection-softremovable
```

Remember you need to remove zimme:collection-softremovable before

### Usage

Basic usage examples.

#### Attach

```js
Posts = new Mongo.Collection('posts');

//Attach behaviour with the default options
Posts.attachBehaviour('softRemovable');

//Attach behaviour with custom options
Posts.attachBehaviour('softRemovable', {
  removed: 'deleted',
  removedBy: false,
  restoredAt: 'undeletedAt',
  restoredBy: false
});
```

#### Remove/Restore

```js
// Soft remove document by _id
Posts.softRemove({_id: 'BFpDzGuWG8extPwrE'});

// Restore document by _id
Posts.restore('BFpDzGuWG8extPwrE');

// Actually remove document from collection
Posts.remove({_id: 'BFpDzGuWG8extPwrE'});
```

#### Find

```js
// Find all posts except soft removed posts
Posts.find({});

// Find only posts that have been soft removed
Posts.find({removed: true});

// Find all posts including removed
Posts.find({}, {removed: true});
```

#### Publish

For you to be able to find soft removed documents on the client you will need
to explicitly publish those. The example code below belongs in server-side code.

```js
Meteor.publish('posts', function() {
  return Posts.find({});
});

Meteor.publish('removedPosts', function() {
  return Posts.find({removed: true});
});

Meteor.publish('allPosts', function() {
  return Posts.find({}, {removed: true});
});
```

### Options

The following options can be used:

* `removed`: Optional. Set to `'string'` to change the fields name.
  This field can't be omitted.

* `removedAt`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `removedBy`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `restoredAt`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `restoredBy`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `systemId`: Optional. Set to `'string'` to change the id representing the
  system.

### Global configuration

```js
// Configure behaviour globally
// All collection using this behaviour will use these settings as defaults
// The settings below are the package default settings
CollectionBehaviours.configure('softRemovable',{
  removed: 'removed',
  removedAt: 'removedAt',
  removedBy: 'removedBy',
  restoredAt: 'restoredAt',
  restoredBy: 'restoredAt',
  systemId: '0'
});
```

### Notes

* This package attaches a schema to the collection if `aldeed:simple-schema`,
  `aldeed:collection2` and/or `aldeed:autoform` are used in the application.
