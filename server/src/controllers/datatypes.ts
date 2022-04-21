import {
  Post,
  Get,
  HttpCode,
  Body,
  JsonController,
  Param,
  NotFoundError,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { firefly } from '../clients/firefly';
import { formatTemplate, quoteAndEscape as q } from '../utils';
import { AsyncResponse, DatatypeInterface } from '../interfaces';

/**
 * Datatypes - API Server
 */
@JsonController('/datatypes')
@OpenAPI({ tags: ['Datatypes'] })
export class DatatypesController {
  @Get('')
  @ResponseSchema(DatatypeInterface, { isArray: true })
  @OpenAPI({ summary: 'List all datatypes' })
  async getAllDatatypes(): Promise<DatatypeInterface[]> {
    const datatypes = await firefly.getDatatypes();
    return datatypes.map((d) => ({ id: d.id, name: d.name, version: d.version, schema: d.value }));
  }

  @Get('/:name/:version')
  @ResponseSchema(DatatypeInterface)
  @OpenAPI({ summary: 'List datatype by name and version' })
  async getAPI(
    @Param('name') name: string,
    @Param('version') version: string,
  ): Promise<DatatypeInterface> {
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

  @Post('')
  @HttpCode(202)
  @ResponseSchema(AsyncResponse)
  @OpenAPI({ summary: 'Creates and broadcasts a new datatype' })
  async createDatatype(@Body() body: DatatypeInterface): Promise<AsyncResponse> {
    // See DatatypesTemplateController and keep template code up to date.
    const datatype = await firefly.createDatatype({
      name: body.name,
      version: body.version,
      value: body.schema,
    });
    return { type: 'datatype', id: datatype.id };
  }
}
