import {
  Post,
  Get,
  HttpCode,
  UploadedFile,
  Req,
  Body,
  JsonController,
  Redirect,
  QueryParam,
} from 'routing-controllers';
import { Request } from 'express';
import { plainToClassFromExist } from 'class-transformer';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import {
  formatTemplate,
  quoteAndEscape as q,
  getBroadcastMessageBody,
  getPrivateMessageBody,
  EmptyVal,
} from '../utils';
import {
  BroadcastBlob,
  BroadcastValue,
  PrivateValue,
  PrivateBlob,
  AsyncResponse,
} from '../interfaces';

/**
 * Messages - API Server
 */
@JsonController('/messages')
export class MessagesController {
  @Post('/broadcast')
  @HttpCode(202)
  async broadcast(
    @Body() body: BroadcastValue,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const message = await firefly.sendBroadcast(getBroadcastMessageBody(body));
    return { type: 'message', id: message.header.id };
  }

  @Post('/broadcastblob')
  @HttpCode(202)
  async broadcastblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new BroadcastBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, { filename: file.originalname });
    const message = await firefly.sendBroadcast(getBroadcastMessageBody(body, data.id));
    return { type: 'message', id: message.header.id };
  }

  @Post('/private')
  @HttpCode(202)
  async send(
    @Body() body: PrivateValue,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const message = await firefly.sendPrivateMessage(getPrivateMessageBody(body));
    return { type: 'message', id: message.header.id };
  }

  @Post('/privateblob')
  @HttpCode(202)
  async sendblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new PrivateBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, { filename: file.originalname });
    const message = await firefly.sendPrivateMessage(getPrivateMessageBody(body, data.id));
    return { type: 'message', id: message.header.id };
  }
}

/**
 * Messages - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/messages/template')
export class MessagesTemplateController {
  @Get('/broadcast')
  broadcastTemplate() {
    return formatTemplate(`
      const message = await firefly.sendBroadcast({
        header: {<% if (tag) { %>
          <% print('tag: ' + ${q('tag')} + ',') } if (topic) { %>
          <% print('topics: [' + ${q('topic')} + '],') } %>
        },
        data: [<% if (jsonValue) { %>
          {<% if (datatypename || datatypeversion) { %>
            datatype: {
              name: <%= ${q('datatypename')} %>,
              version: <%= ${q('datatypeversion')} %>,
            },<% } %>
            value: <%= ${q('jsonValue', { isObject: true, truncate: true })} %>,
          },
        <% } else { %>
          { value: <%= ${q('value', { empty: EmptyVal.STRING })} %> },
        <% }
        %>],
      });
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/broadcastblob')
  broadcastblobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(
        file.buffer,
        {
          filename: <%= ${q('filename')} %>,
        },
      );
      const message = await firefly.sendBroadcast({
        header: {<% if (tag) { %>
          <% print('tag: ' + ${q('tag')} + ',') } if (topic) { %>
          <% print('topics: [' + ${q('topic')} + '],') } %>
        },
        data: [{ id: data.id }],
      });
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/private')
  sendTemplate() {
    return formatTemplate(`
      const message = await firefly.sendPrivateMessage({
        header: {<% if (tag) { %>
          <% print('tag: ' + ${q('tag')} + ',') } if (topic) { %>
          <% print('topics: [' + ${q('topic')} + '],') } %>
        },
        group: {
          members: [<% for (const r of recipients) { %>
            <% print('{ identity: ' + ${q('r')} + ' },') } %>
          ],
        },
        data: [<% if (jsonValue) { %>
          {<% if (datatypename || datatypeversion) { %>
            datatype: {
              name: <%= ${q('datatypename')} %>,
              version: <%= ${q('datatypeversion')} %>,
            },<% } %>
            value: <%= ${q('jsonValue', {
              isObject: true,
              truncate: true,
            })} %>
          },
        <% } else { %>
          { value: <%= ${q('value', { empty: EmptyVal.STRING })} %> },
        <% }
        %>],
      });
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/privateblob')
  sendblobTemplate() {
    return formatTemplate(`
      const data = await firefly.uploadDataBlob(
        file.buffer,
        {
          filename: <%= ${q('filename')} %>,
        },
      );
      const message = await firefly.sendPrivateMessage({
        header: {<% if (tag) { %>
          <% print('tag: ' + ${q('tag')} + ',') } if (topic) { %>
          <% print('topics: [' + ${q('topic')} + '],') } %>
        },
        group: {
          members: [<% for (const r of recipients) { %>
            <% print('{ identity: ' + ${q('r')} + ' },') } %>
          ],
        },
        data: [{ id: data.id }],
      });
      return { type: 'message', id: message.header.id };
    `);
  }

  @Get('/datatypes')
  @Redirect('../../datatypes/template')
  datatypesTemplate() {
    // This template actually lives in DatatypesTemplateController, but a redirect is
    // provided here because the UI displays datatypes in the Messages category.
  }
}
