import { Post, Get, HttpCode, UploadedFile, Req, Body, JsonController } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { plainToClassFromExist } from 'class-transformer';
import { firefly } from '../clients/firefly';
import { formatTemplate, quoteAndEscape as q, FormDataSchema } from '../utils';
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
    const message = await firefly.sendBroadcast({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      data: [{ value: body.value }],
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
    const message = await firefly.sendPrivateMessage({
      header: {
        tag: body.tag || undefined,
        topics: body.topic ? [body.topic] : undefined,
      },
      group: {
        members: body.recipients.map((r) => ({ identity: r })),
      },
      data: [{ value: body.value }],
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
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        data: [{ value: <%= ${q('value')} %> }],
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
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
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
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
        },
        data: [{ value: <%= ${q('value')} %> }],
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
        header: {
          tag: <%= tag ? ${q('tag')} : 'undefined' %>,
          topics: <%= topic ? ('[' + ${q('topic')} + ']') : 'undefined' %>,
        },
        group: {
          members: [<%= recipients.map((r) => '{ identity: ' + ${q('r')} + ' }').join(', ') %>],
        },
        data: [{ id: data.id }],
      });
      return { type: 'message', id: message.header.id };
    `);
  }
}
