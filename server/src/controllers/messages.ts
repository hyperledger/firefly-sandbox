import { Post, Get, HttpCode, UploadedFile, Req, Body, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { plainToClassFromExist } from 'class-transformer';
import { firefly } from '../clients/firefly';
import {
  formatTemplate,
  quoteAndEscape as q,
  FormDataSchema,
  getMessageBody,
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
@OpenAPI({ tags: ['Messages'] })
export class MessagesController {
  @Post('/broadcast')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with an inline value' })
  async broadcast(@Body() body: BroadcastValue): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const dataBody = getMessageBody(body);
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [dataBody],
    });
    return { type: 'message', id: message.header.id };
  }

  @Post('/broadcastblob')
  @HttpCode(202)
  @FormDataSchema(BroadcastBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly broadcast with a binary blob' })
  async broadcastblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new BroadcastBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ id: data.id }],
    });
    return { type: 'message', id: message.header.id };
  }

  @Post('/private')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with an inline value' })
  async send(@Body() body: PrivateValue): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const dataBody = getMessageBody(body);
    const message = await firefly.sendPrivateMessage({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      group: {
        members: body.recipients.map((r) => ({ identity: r })),
      },
      data: [dataBody],
    });
    return { type: 'message', id: message.header.id };
  }

  @Post('/privateblob')
  @HttpCode(202)
  @FormDataSchema(PrivateBlob)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Send a FireFly private message with a binary blob' })
  async sendblob(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<AsyncResponse> {
    // See MessagesTemplateController and keep template code up to date.
    const body = plainToClassFromExist(new PrivateBlob(), req.body);
    const data = await firefly.uploadDataBlob(file.buffer, file.originalname);
    const message = await firefly.sendPrivateMessage({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      group: {
        members: body.recipients.map((r) => ({ identity: r })),
      },
      data: [{ id: data.id }],
    });
    return { type: 'message', id: message.header.id };
  }
}

/**
 * Messages - Code Templates
 * Allows the frontend to display representative code snippets for backend operations.
 * For demonstration purposes only.
 */
@JsonController('/messages/template')
@OpenAPI({ tags: ['Messages'] })
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
        <%= ${q('filename')} %>,
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
        <%= ${q('filename')} %>,
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
  createDatatypeTemplate() {
    return formatTemplate(`
      const datatype = await firefly.createDatatype({
        name: <%= ${q('name')}  %>,
        version: <%= ${q('version')} %>,
      }, <%= ${q('schema', { isObject: true, truncate: true })}  %>);
      return { type: 'datatype', id: datatype.id };
    `);
  }
}
