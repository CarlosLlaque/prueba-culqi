import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import { exceptionHandlerMiddleware } from './middlewares/exceptionHandlerMiddleware';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(routes);

app.use(exceptionHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
