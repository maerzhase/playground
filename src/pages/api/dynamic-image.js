import React from 'react';
import createDynamicImageHandler from '@/utils/dynamic-image';
import DynamicImage from '@/componennts/DynamicImage';
import Test from '@/components/Test';
import ReactDOMServer from 'react-dom/server';
import Cors from 'cors'
import { ServerStyleSheets } from '@material-ui/core/styles';

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const dynimg = (
  <DynamicImage>
    <Test />
  </DynamicImage>
);

const sheets = new ServerStyleSheets();

ReactDOMServer.renderToString(sheets.collect(dynimg));

const styles = sheets.toString();

const dynamicImageHandler = createDynamicImageHandler(dynimg, styles);

export default async function handler(req, res) {
    
  await runMiddleware(req, res, cors)
  await dynamicImageHandler(req, res);

}