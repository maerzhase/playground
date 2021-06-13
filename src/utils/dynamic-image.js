import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';
import wkhtmltopdf from 'wkhtmltopdf';


const HOSTNAME = 'http://localhost:3000';


const wkhtmltopdf_async = (url, res, options) => new Promise((resolve, reject) => {
  wkhtmltopdf(url, options, function (error, stream) {
    if (error) {
      reject(error);
    } else {
      stream.pipe(res);
      resolve();
    }
  })
});


 const dynamicImageHandler = (children, styles, options={}) => async (req, res) => {
  const { query } = req;
  const { referer, host } = req.headers;
  const refererUrl = new URL(`${HOSTNAME}${query.url}`);
 	const {
 		width=200, 
 		height= 200,
 	} = options;

  const body = (
      children
  );

  const sheets = new ServerStyleSheets();
	sheets.collect(children);

  const bodyString = ReactDOMServer.renderToString(body);
  const html = `<html><head><style>
        ${styles}
      </style></head><body>${bodyString}</body></html>`;
  // const image = await nodeHtmlToImage({
  //   html,
  //   puppeteerArgs: {args:['--no-sandbox']},
  //   transparent: true,
  // });
  // res.writeHead(200, { 'Content-Type': 'image/png' });
      //res.end(stream, 'binary');
  try {
    const stream = await wkhtmltopdf_async(refererUrl.href, res,  { pageSize: 'letter' });
  } catch(error) {
    console.log(error);
    // res.send("400");
  }
}

export default dynamicImageHandler;
