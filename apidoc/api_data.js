define({ "api": [
  {
    "type": "delete",
    "url": "/tags/:id",
    "title": "Delete a tag",
    "name": "DeleteTag",
    "group": "Tag",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Name of the Tag</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/tag.js",
    "groupTitle": "Tag"
  },
  {
    "type": "post",
    "url": "/tags/",
    "title": "Create a tag",
    "name": "PostTag",
    "group": "Tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique name of the Tag.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Tag.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Name of the Tag</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Tag.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/tag.js",
    "groupTitle": "Tag"
  },
  {
    "type": "put",
    "url": "/tags/:id",
    "title": "Update a tag",
    "name": "PutTag",
    "group": "Tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique name of the Tag.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Tag.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Name of the Tag</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Tag.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/tags.js",
    "groupTitle": "Tag"
  },
  {
    "type": "post",
    "url": "/tags/",
    "title": "Create a tag",
    "name": "PostTag",
    "group": "Tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Lastname of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/users.js",
    "groupTitle": "Tag"
  }
] });
