const express = require('express');
const Ajv = require('ajv');
const AjvFormats = require('ajv-formats');
const AjvErrors = require('ajv-errors');
const yaml = require('js-yaml');
const fs = require('fs');
const $RefParser = require('json-schema-ref-parser'); // Import the ref-parser

// Initialize Express
const app = express();
app.use(express.json());

// Load OpenAPI schema from YAML file
const schemaFile = fs.readFileSync('ondc_trv10_2.0.0.yaml', 'utf8'); // Assuming your OpenAPI YAML schema is in this file
const schema = yaml.load(schemaFile);

// Initialize Ajv for schema validation
const ajv = new Ajv({ allErrors: true, strict: false });
AjvFormats(ajv); // Add support for formats like date-time
// AjvErrors(ajv);  // Add support for custom error messages


// Dereference the OpenAPI schema to resolve all $ref references
$RefParser.dereference(schema)
  .then((dereferencedSchema) => {
    // Register all schemas and their sub-properties
    if (dereferencedSchema.components && dereferencedSchema.components.schemas) {
      Object.keys(dereferencedSchema.components.schemas).forEach((schemaKey) => {
        const schemaObject = dereferencedSchema.components.schemas[schemaKey];
        const schemaPath = `#/components/schemas/${schemaKey}`;

        ajv.addSchema(schemaObject, schemaPath); // Add each schema to Ajv
      });
    }

    // console.log(JSON.stringify(dereferencedSchema))
    // fs.writeFileSync("./dref.yaml", JSON.stringify(dereferencedSchema))

    // Compile schema for /search endpoint
    const searchSchema = dereferencedSchema.paths['/on_search'].post.requestBody.content['application/json'].schema;
    const validateSearch = ajv.compile(searchSchema);
    
    // Define the /search endpoint
    app.post('/search', (req, res) => {
      const isValid = validateSearch(req.body);
      console.log("err2")

      if (!isValid) {
        // If validation fails, return a 400 Bad Request with validation errors
        return res.status(400).json({
          message: "Invalid request data",
          errors: validateSearch.errors
        });
      }

      // If validation succeeds, proceed with handling the request
      res.status(200).json({
        message: "Request is valid"
      });
    });

    const initSchema = dereferencedSchema.paths['/on_init'].post.requestBody.content['application/json'].schema;
    const validateInit = ajv.compile(initSchema);

    // Define the /init endpoint
    app.post('/init', (req, res) => {
      const isValid = validateInit(req.body);

      if (!isValid) {
        // If validation fails, return a 400 Bad Request with validation errors
        return res.status(400).json({
          message: "Invalid request data",
          errors: validateSearch.errors
        });
      }

      // If validation succeeds, proceed with handling the request
      res.status(200).json({
        message: "Request is valid"
      });
    });




    const confirmSchema = dereferencedSchema.paths['/on_confirm'].post.requestBody.content['application/json'].schema;
    const validateConfirm = ajv.compile(confirmSchema);

    // Define the /confirm endpoint
    app.post('/confirm', (req, res) => {
      const isValid = validateConfirm(req.body);

      if (!isValid) {
        console.log(validateConfirm.errors)

        // If validation fails, return a 400 Bad Request with validation errors
        return res.status(400).json({
          message: "Invalid request data",
          errors: validateConfirm.errors
        });
      }

      // If validation succeeds, proceed with handling the request
      res.status(200).json({
        message: "Request is valid"
      });
    });


    const statusSchema = dereferencedSchema.paths['/on_status'].post.requestBody.content['application/json'].schema;
    const validateStatus = ajv.compile(statusSchema);

    // Define the /status endpoint
    app.post('/status', (req, res) => {
      const isValid = validateStatus(req.body);

      if (!isValid) {
        // If validation fails, return a 400 Bad Request with validation errors
        return res.status(400).json({
          message: "Invalid request data",
          errors: validateStatus.errors
        });
      }

      // If validation succeeds, proceed with handling the request
      res.status(200).json({
        message: "Request is valid"
      });
    });


    // let json = JSON.parse(fs.readFileSync("dref.json"))

    // const selectSchema = json.paths['/on_select'].post.requestBody.content['application/json'].schema;
    // const validateSelect = ajv.compile(selectSchema);

    // // Define the /select endpoint
    // app.post('/select', (req, res) => {
    //   const isValid = validateSelect(req.body);

    //   if (!isValid) {
    //     // If validation fails, return a 400 Bad Request with validation errors
    //     return res.status(400).json({
    //       message: "Invalid request data",
    //       errors: validateSearch.errors
    //     });
    //   }

    //   // If validation succeeds, proceed with handling the request
    //   res.status(200).json({
    //     message: "Request is valid"
    //   });
    // });

    // Start the server
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error(`Error dereferencing schema: ${err.message}`);
  });