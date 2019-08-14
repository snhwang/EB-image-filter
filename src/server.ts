import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { EWOULDBLOCK } from 'constants';
import { ExecOptionsWithBufferEncoding } from 'child_process';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

/* Based on code at https://stackoverflow.com/questions/46858445/express-js-response-sent-callback
 * as well as code from the Udacity course materials (udacity-c2-restapi).
 * This was also helpful: 
 * https://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
 */
  app.get("/filteredimage", async (req, res) => {
      let { image_url } = req.query
      // Error code 400 is Invalid Request
      if (!image_url) {
        return res.status(400).send({ message: 'An image URL is required' });
      }
      const filtered_image = await(filterImageFromURL(image_url));
      res.status(200).sendFile(filtered_image);
      res.on('finish', function() {
        try {
          deleteLocalFiles([filtered_image]);
        } catch(e) {
          // Error code 422 is Unprocessable Entity
          res.status(422).send("An error occurred during deletion of files on server.");
        }
      })
    }
  )

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();