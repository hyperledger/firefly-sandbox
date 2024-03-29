import {
  Post,
  Get,
  HttpCode,
  Body,
  JsonController,
  Param,
  NotFoundError,
  QueryParam,
} from 'routing-controllers';
import { getFireflyClient } from '../clients/fireflySDKWrapper';
import { AsyncResponse, DatatypeInterface } from '../interfaces';
import { formatTemplate, quoteAndEscape as q } from '../utils';

/**
 * Datatypes - API Server
 */
@JsonController('/datatypes')
export class DatatypesController {
  @Get()
  async getAllDatatypes(@QueryParam('ns') namespace: string): Promise<DatatypeInterface[]> {
    const firefly = getFireflyClient(namespace);
    const datatypes = await firefly.getDatatypes();
    return datatypes.map((d) => ({ id: d.id, name: d.name, version: d.version, schema: d.value }));
  }

  @Get('/:name/:version')
  async getAPI(
    @Param('name') name: string,
    @Param('version') version: string,
    @QueryParam('ns') namespace: string,
  ): Promise<DatatypeInterface> {
    const firefly = getFireflyClient(namespace);
    const datatype = await firefly.getDatatype(name, version);
    if (datatype === undefined) {
      throw new NotFoundError();
    }
    return {
      id: datatype.id,
      name: datatype.name,
      version: datatype.version,
      schema: datatype.value,
    };
  }

  @Post()
  @HttpCode(202)
  async createDatatype(
    @Body() body: DatatypeInterface,
    @QueryParam('ns') namespace: string,
  ): Promise<AsyncResponse> {
    const firefly = getFireflyClient(namespace);
    // See DatatypesTemplateController and keep template code up to date.
    const datatype = await firefly.createDatatype({
      name: body.name,
      version: body.version,
      value: body.schema,
    });
    return { type: 'datatype', id: datatype.id };
  }
}

@JsonController('/datatypes/template')
export class DatatypesTemplateController {
  @Get()
  createDatatypeTemplate() {
    return formatTemplate(`
      const datatype = await firefly.createDatatype(
        {
          name: <%= ${q('name')}  %>,
          version: <%= ${q('version')} %>,
        },
        <%= ${q('schema', { isObject: true, truncate: true })} %>,
      );
      return { type: 'datatype', id: datatype.id };
    `);
  }
}
